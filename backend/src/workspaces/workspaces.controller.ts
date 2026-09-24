import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service.js';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto.js';
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

@Controller('workspaces')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @RequirePermissions(Permission.WORKSPACE_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.workspacesService.findAll();
  }

  @Get('my-workspaces')
  @HttpCode(HttpStatus.OK)
  async getMyWorkspaces(@Request() req: AuthenticatedRequest) {
    return this.workspacesService.getUserEnrollments(req.user.id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findByCode(@Param('code') code: string) {
    return this.workspacesService.findByAccessCode(code);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.workspacesService.findOne(id);
  }

  @Post('join/:code')
  @HttpCode(HttpStatus.OK)
  async joinByCode(
    @Param('code') code: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.workspacesService.joinByAccessCode(code, req.user.id);
  }

  @Post(':workspaceId/induction/complete')
  @HttpCode(HttpStatus.OK)
  async completeInduction(
    @Param('workspaceId') workspaceId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.workspacesService.completeInduction(workspaceId, req.user.id);
  }

  @Get(':workspaceId/induction/status')
  @HttpCode(HttpStatus.OK)
  async getInductionStatus(
    @Param('workspaceId') workspaceId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.workspacesService.getInductionStatus(workspaceId, req.user.id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.WORKSPACE_UPDATE)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, updateWorkspaceDto);
  }
}
