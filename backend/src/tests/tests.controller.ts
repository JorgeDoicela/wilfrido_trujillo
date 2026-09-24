import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TestsService } from './tests.service.js';
import { CreateTestDto, SubmitTestAnswersDto } from './dto/test.dto.js';
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

@Controller('tests')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @RequirePermissions(Permission.TEST_MANAGE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTestDto: CreateTestDto) {
    return this.testsService.create(createTestDto);
  }

  @Get('workspace/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async findByWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const isTeacher =
      req.user.permissions?.includes(Permission.TEST_MANAGE) ||
      req.user.roleKey === 'INGENIERO' ||
      req.user.roleKey === 'SUPERADMIN';

    return this.testsService.findByWorkspace(workspaceId, isTeacher);
  }

  @Post(':testId/submit')
  @RequirePermissions(Permission.TEST_TAKE)
  @HttpCode(HttpStatus.OK)
  async submitTest(
    @Param('testId') testId: string,
    @Body() submitDto: SubmitTestAnswersDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.testsService.submitTest(testId, submitDto, req.user.id);
  }

  @Get(':testId/my-attempts')
  @HttpCode(HttpStatus.OK)
  async getMyAttempts(
    @Param('testId') testId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.testsService.getMyAttempts(testId, req.user.id);
  }
}
