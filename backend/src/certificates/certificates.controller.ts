import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Response,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { CertificatesService } from './certificates.service.js';
import { IssueCertificateDto } from './dto/issue-certificate.dto.js';
import { ClaimCertificateDto } from './dto/claim-certificate.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator.js';
import { Permission } from '../auth/enums/permission.enum.js';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  // Emisión oficial por el Ingeniero / Coordinador
  @Post('issue')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.CERTIFICATE_ISSUE)
  @HttpCode(HttpStatus.CREATED)
  async issue(@Body() dto: IssueCertificateDto) {
    return this.certificatesService.issueCertificate(dto);
  }

  // Reclamo público por asistente de conferencia
  @Post('claim/:code')
  @HttpCode(HttpStatus.CREATED)
  async claim(
    @Param('code') code: string,
    @Body() dto: ClaimCertificateDto,
  ) {
    return this.certificatesService.claimCertificate(code, dto);
  }

  // Listar certificados emitidos para un espacio de trabajo
  @Get('workspace/:workspaceId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.CERTIFICATE_MANAGE)
  @HttpCode(HttpStatus.OK)
  async findByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.certificatesService.findByWorkspace(workspaceId);
  }

  // Verificación pública vía QR
  @Get('verify/:hash')
  @HttpCode(HttpStatus.OK)
  async verify(@Param('hash') hash: string) {
    return this.certificatesService.verifyCertificate(hash);
  }

  // Descarga del documento PDF generado
  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Response() res: ExpressResponse,
  ) {
    const info = await this.certificatesService.getDownloadInfo(id);

    res.setHeader('Content-Type', info.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${info.filename}"`);
    return res.download(info.filePath, info.filename);
  }
}
