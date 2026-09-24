import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Response,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import type { Response as ExpressResponse } from 'express';
import { SubmissionsService } from './submissions.service.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';
import { ReviewSubmissionDto } from './dto/review-submission.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator.js';
import { Permission } from '../auth/enums/permission.enum.js';

interface AuthenticatedRequest extends Express.Request {
  user: {
    id: string;
    email: string;
    identification: string;
    fullName: string;
    roleKey: string;
    permissions: string[];
  };
}

const storage = diskStorage({
  destination: path.resolve(process.cwd(), 'uploads', 'documents'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `submission-${uniqueSuffix}${ext}`);
  },
});

@Controller('submissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('upload')
  @RequirePermissions(Permission.DOCUMENT_SUBMIT)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 30 * 1024 * 1024, // 30 MB máximo por entrega
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadSubmission(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateSubmissionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file && !body.fileUrl) {
      throw new BadRequestException('Debes adjuntar un archivo para completar la entrega.');
    }
    return this.submissionsService.submitDocument(req.user.id, body, file);
  }

  @Get('my-submissions/:workspaceId')
  @RequirePermissions(Permission.DOCUMENT_SUBMIT)
  @HttpCode(HttpStatus.OK)
  async getMySubmissions(
    @Param('workspaceId') workspaceId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.submissionsService.getMySubmissions(req.user.id, workspaceId);
  }

  @Get('workspace/:workspaceId')
  @RequirePermissions(Permission.DOCUMENT_REVIEW)
  @HttpCode(HttpStatus.OK)
  async findByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.submissionsService.findByWorkspace(workspaceId);
  }

  @Patch(':id/review')
  @RequirePermissions(Permission.DOCUMENT_REVIEW)
  @HttpCode(HttpStatus.OK)
  async reviewSubmission(
    @Param('id') id: string,
    @Body() reviewDto: ReviewSubmissionDto,
  ) {
    return this.submissionsService.review(id, reviewDto);
  }

  @Get(':id/download')
  async downloadSubmission(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpressResponse,
  ) {
    const info = await this.submissionsService.getDownloadInfo(
      id,
      req.user.id,
      req.user.permissions,
      req.user.roleKey,
    );

    res.setHeader('Content-Type', info.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${info.filename}"`);
    return res.download(info.filePath, info.filename);
  }
}
