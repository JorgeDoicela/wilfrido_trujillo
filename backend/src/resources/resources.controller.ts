import {
  Controller,
  Get,
  Post,
  Delete,
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
import { ResourcesService } from './resources.service.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
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
  destination: path.resolve(process.cwd(), 'uploads', 'resources'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resource-${uniqueSuffix}${ext}`);
  },
});

@Controller('resources')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('workspace/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async findByWorkspace(@Param('workspaceId') workspaceId: string) {
    return this.resourcesService.findByWorkspace(workspaceId);
  }

  @Post('upload')
  @RequirePermissions(Permission.RESOURCE_MANAGE)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 25 * 1024 * 1024, // 25 MB máximo por plantilla
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadResource(
    @Body() body: CreateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file && !body.fileUrl) {
      throw new BadRequestException('Debes adjuntar un archivo de plantilla o especificar fileUrl.');
    }
    return this.resourcesService.create(body, file);
  }

  @Post()
  @RequirePermissions(Permission.RESOURCE_MANAGE)
  @HttpCode(HttpStatus.CREATED)
  async createResource(@Body() body: CreateResourceDto) {
    return this.resourcesService.create(body);
  }

  @Get(':id/download')
  async downloadResource(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Response() res: ExpressResponse,
  ) {
    const info = await this.resourcesService.getDownloadInfo(
      id,
      req.user.id,
      req.user.permissions,
      req.user.roleKey,
    );

    res.setHeader('Content-Type', info.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${info.filename}"`);
    return res.download(info.filePath, info.filename);
  }

  @Delete(':id')
  @RequirePermissions(Permission.RESOURCE_MANAGE)
  @HttpCode(HttpStatus.OK)
  async removeResource(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
