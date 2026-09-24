import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Certificate } from './entities/certificate.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { IssueCertificateDto } from './dto/issue-certificate.dto.js';
import { ClaimCertificateDto } from './dto/claim-certificate.dto.js';

export interface CertificateDownloadInfo {
  filePath: string;
  filename: string;
  mimeType: string;
}

@Injectable()
export class CertificatesService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads', 'certificates');

  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async issueCertificate(dto: IssueCertificateDto): Promise<Certificate> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: dto.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Espacio de trabajo con ID "${dto.workspaceId}" no encontrado.`,
      );
    }

    const verificationHash = this.generateHash(
      dto.recipientEmail,
      workspace.id,
      dto.hours ?? 40,
    );

    const certificate = this.certificateRepository.create({
      workspaceId: workspace.id,
      recipientName: dto.recipientName.trim(),
      recipientEmail: dto.recipientEmail.trim().toLowerCase(),
      recipientIdentification: dto.recipientIdentification
        ? dto.recipientIdentification.trim()
        : '',
      hours: dto.hours ?? 40,
      verificationHash,
      pdfPath: null,
      issuedAt: new Date(),
    });

    const savedCert = await this.certificateRepository.save(certificate);

    // Generar archivo PDF con QR físico
    const pdfPath = await this.generatePdf(savedCert, workspace.title);
    savedCert.pdfPath = pdfPath;

    return this.certificateRepository.save(savedCert);
  }

  async claimCertificate(accessCode: string, dto: ClaimCertificateDto): Promise<Certificate> {
    const cleanCode = accessCode.trim().toUpperCase();
    const workspace = await this.workspaceRepository.findOne({
      where: { accessCode: cleanCode },
    });

    if (!workspace) {
      throw new NotFoundException(`Evento con código "${cleanCode}" no encontrado.`);
    }

    // Comprobar si ya existe un certificado emitido para este correo
    const existing = await this.certificateRepository.findOne({
      where: {
        workspaceId: workspace.id,
        recipientEmail: dto.recipientEmail.trim().toLowerCase(),
      },
    });

    if (existing) {
      return existing;
    }

    return this.issueCertificate({
      workspaceId: workspace.id,
      recipientName: dto.recipientName,
      recipientEmail: dto.recipientEmail,
      recipientIdentification: dto.recipientIdentification,
      hours: 40,
    });
  }

  async findByWorkspace(workspaceId: string): Promise<Certificate[]> {
    return this.certificateRepository.find({
      where: { workspaceId },
      order: { issuedAt: 'DESC' },
    });
  }

  async verifyCertificate(hash: string) {
    const cleanHash = hash.trim().toUpperCase();

    const certificate = await this.certificateRepository.findOne({
      where: { verificationHash: cleanHash },
      relations: {
        workspace: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException(
        `Certificado con código de verificación "${cleanHash}" no encontrado o no emitido oficialmente.`,
      );
    }

    return {
      isValid: true,
      verificationHash: certificate.verificationHash,
      recipientName: certificate.recipientName,
      recipientIdentification: certificate.recipientIdentification || 'No registrada',
      eventTitle: certificate.workspace ? certificate.workspace.title : 'Evento Institucional',
      hours: certificate.hours,
      issuedAt: certificate.issuedAt,
      issuer: 'Ing. Wilfrido Trujillo, M.Sc.',
      role: 'Coordinador de Prácticas Preprofesionales y Vinculación',
      statusMessage: 'Certificado oficial, auténtico y con validez institucional verificada mediante firma digital y QR.',
      downloadUrl: `/api/certificates/${certificate.id}/download`,
    };
  }

  async getDownloadInfo(id: string): Promise<CertificateDownloadInfo> {
    const cert = await this.certificateRepository.findOne({
      where: { id },
      relations: {
        workspace: true,
      },
    });

    if (!cert) {
      throw new NotFoundException(`Certificado con ID "${id}" no encontrado.`);
    }

    let filePath = cert.pdfPath ? path.resolve(this.uploadDir, cert.pdfPath) : '';

    if (!filePath || !fs.existsSync(filePath)) {
      filePath = await this.generatePdf(
        cert,
        cert.workspace ? cert.workspace.title : 'Evento Institucional',
      );
      cert.pdfPath = path.basename(filePath);
      await this.certificateRepository.save(cert);
    }

    const safeRecipient = cert.recipientName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Certificado_${safeRecipient}_${cert.verificationHash.slice(0, 8)}.pdf`;

    return {
      filePath,
      filename,
      mimeType: 'application/pdf',
    };
  }

  private generateHash(email: string, workspaceId: string, hours: number): string {
    const raw = `${email}-${workspaceId}-${hours}-${Date.now()}-${Math.random()}`;
    const hash = crypto.createHash('sha256').update(raw).digest('hex').substring(0, 12).toUpperCase();
    return `WT-${hash.slice(0, 4)}-${hash.slice(4, 8)}-${hash.slice(8, 12)}`;
  }

  private async generatePdf(cert: Certificate, workspaceTitle: string): Promise<string> {
    const filename = `cert-${cert.verificationHash}.pdf`;
    const filePath = path.join(this.uploadDir, filename);

    // URL pública para validación del QR
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const verifyUrl = `${appUrl}/#/certificados/validar/${cert.verificationHash}`;

    // Generar buffer de imagen QR
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      margin: 1,
      width: 130,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });

    return new Promise((resolve, reject) => {
      // Documento en formato apaisado (A4 Landscape: 841.89 x 595.28 pt)
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 40,
      });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Marco decorativo y elegante exterior
      doc
        .rect(20, 20, 801.89, 555.28)
        .lineWidth(3)
        .strokeColor('#1e3a8a') // Azul institucional
        .stroke();

      doc
        .rect(26, 26, 789.89, 543.28)
        .lineWidth(1)
        .strokeColor('#cbd5e1')
        .stroke();

      // Franja superior de marca
      doc.rect(30, 30, 781.89, 8).fillColor('#2563eb').fill();

      doc.moveDown(1.5);

      // Encabezado institucional
      doc
        .fillColor('#64748b')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('REPÚBLICA DEL ECUADOR • COORDINACIÓN ACADÉMICA Y VINCULACIÓN', {
          align: 'center',
          characterSpacing: 1.5,
        });

      doc.moveDown(0.5);

      doc
        .fillColor('#0f172a')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('ING. WILFRIDO TRUJILLO, M.Sc.', {
          align: 'center',
          characterSpacing: 2,
        });

      doc.moveDown(0.4);

      doc
        .fillColor('#2563eb')
        .fontSize(14)
        .font('Helvetica')
        .text('CONFIERE EL PRESENTE', {
          align: 'center',
          characterSpacing: 3,
        });

      doc.moveDown(0.3);

      doc
        .fillColor('#1e293b')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('CERTIFICADO OFICIAL', {
          align: 'center',
          characterSpacing: 1,
        });

      doc.moveDown(0.5);

      doc
        .fillColor('#475569')
        .fontSize(12)
        .font('Helvetica')
        .text('Por haber participado y aprobado satisfactoriamente en las directrices de:', {
          align: 'center',
        });

      doc.moveDown(0.6);

      // Nombre del beneficiario resaltado
      doc
        .fillColor('#1d4ed8')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text(cert.recipientName.toUpperCase(), {
          align: 'center',
        });

      if (cert.recipientIdentification) {
        doc
          .fillColor('#64748b')
          .fontSize(11)
          .font('Helvetica')
          .text(`C.I. / Identificación: ${cert.recipientIdentification}`, {
            align: 'center',
          });
      }

      doc.moveDown(0.5);

      // Evento y Horas
      doc
        .fillColor('#334155')
        .fontSize(12)
        .font('Helvetica')
        .text(
          `En calidad de asistente / participante del programa institucional "${workspaceTitle}", cumpliendo a cabalidad con un total de ${cert.hours} horas académicas avaladas bajo la normativa del Régimen Académico.`,
          {
            align: 'center',
            width: 650,
          },
        );

      doc.moveDown(1.5);

      // Pie del Certificado con QR y Firma
      const footerY = 440;

      // Código QR a la izquierda
      doc.image(qrBuffer, 50, footerY - 15, { width: 85 });
      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text('Validación QR en tiempo real', 145, footerY - 5)
        .text(`Código de Verificación:`, 145, footerY + 8)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text(cert.verificationHash, 145, footerY + 20)
        .font('Helvetica')
        .fillColor('#64748b')
        .text(`Emitido: ${cert.issuedAt ? cert.issuedAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)}`, 145, footerY + 33);

      // Firma digital del Ingeniero a la derecha
      const signatureX = 540;
      doc
        .moveTo(signatureX, footerY + 25)
        .lineTo(signatureX + 220, footerY + 25)
        .lineWidth(1)
        .strokeColor('#0f172a')
        .stroke();

      doc
        .fillColor('#0f172a')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Ing. Wilfrido Trujillo, M.Sc.', signatureX, footerY + 32, {
          width: 220,
          align: 'center',
        });

      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text('Coordinador de Prácticas y Vinculación', signatureX, footerY + 46, {
          width: 220,
          align: 'center',
        })
        .text('Firma Electrónica / Digital Oficial', signatureX, footerY + 58, {
          width: 220,
          align: 'center',
        });

      doc.end();

      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    });
  }
}
