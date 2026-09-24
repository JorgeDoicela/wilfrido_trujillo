import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestQuestion } from './entities/test.entity.js';
import { TestAttempt } from './entities/test-attempt.entity.js';
import { WorkspaceEnrollment } from '../workspaces/entities/workspace-enrollment.entity.js';
import { Workspace } from '../workspaces/entities/workspace.entity.js';
import { CreateTestDto, SubmitTestAnswersDto } from './dto/test.dto.js';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(TestAttempt)
    private readonly attemptRepository: Repository<TestAttempt>,
    @InjectRepository(WorkspaceEnrollment)
    private readonly enrollmentRepository: Repository<WorkspaceEnrollment>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: createTestDto.workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Espacio de trabajo con ID "${createTestDto.workspaceId}" no encontrado.`,
      );
    }

    if (!createTestDto.questions || createTestDto.questions.length === 0) {
      throw new BadRequestException('El cuestionario debe contener al menos una pregunta.');
    }

    const test = this.testRepository.create({
      workspaceId: createTestDto.workspaceId,
      title: createTestDto.title.trim(),
      passingScore: createTestDto.passingScore ?? 7,
      questions: createTestDto.questions,
      timeLimitMinutes: createTestDto.timeLimitMinutes || null,
    });

    return this.testRepository.save(test);
  }

  async findByWorkspace(
    workspaceId: string,
    isTeacher = false,
  ): Promise<Test | { id: string; title: string; passingScore: number; timeLimitMinutes: number | null; questions: Omit<TestQuestion, 'correctOptionIndex'>[] } | null> {
    const test = await this.testRepository.findOne({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });

    if (!test) {
      return null;
    }

    // Para el Ingeniero o revisor se devuelve con las respuestas correctas
    if (isTeacher) {
      return test;
    }

    // Para el estudiante se sanea el payload ocultando correctOptionIndex
    const sanitizedQuestions = test.questions.map(({ correctOptionIndex, ...q }) => q);

    return {
      id: test.id,
      title: test.title,
      passingScore: test.passingScore,
      timeLimitMinutes: test.timeLimitMinutes,
      questions: sanitizedQuestions,
    };
  }

  async findById(testId: string): Promise<Test> {
    const test = await this.testRepository.findOne({
      where: { id: testId },
    });

    if (!test) {
      throw new NotFoundException(`Evaluación con ID "${testId}" no encontrada.`);
    }

    return test;
  }

  async submitTest(testId: string, submitDto: SubmitTestAnswersDto, userId: string) {
    const test = await this.findById(testId);

    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        workspaceId: test.workspaceId,
        userId,
      },
    });

    if (!enrollment) {
      throw new BadRequestException('No estás inscrito en el espacio de trabajo de este test.');
    }

    if (!enrollment.inductionVideoWatched) {
      throw new BadRequestException(
        'Acceso denegado: Debes completar el 100% de la inducción obligatoria en video antes de rendir la evaluación.',
      );
    }

    const totalQuestions = test.questions.length;
    if (totalQuestions === 0) {
      throw new BadRequestException('El cuestionario no tiene preguntas configuradas.');
    }

    let correctCount = 0;
    const submittedAnswers = submitDto.answers || {};

    for (const q of test.questions) {
      const studentAnswer = submittedAnswers[q.id];
      if (studentAnswer !== undefined && studentAnswer === q.correctOptionIndex) {
        correctCount++;
      }
    }

    // Nota calculada sobre 10 con un decimal
    const rawScore = (correctCount / totalQuestions) * 10;
    const scoreObtained = Math.round(rawScore * 10) / 10;
    const passed = scoreObtained >= test.passingScore;

    const attempt = this.attemptRepository.create({
      enrollmentId: enrollment.id,
      testId: test.id,
      scoreObtained,
      passed,
      answersSubmitted: submittedAnswers,
      completedAt: new Date(),
    });

    const savedAttempt = await this.attemptRepository.save(attempt);

    // Si aprobó, actualizar el estado en el enrollment
    if (passed) {
      enrollment.testPassed = true;
      enrollment.testScore = Math.max(enrollment.testScore || 0, scoreObtained);
      await this.enrollmentRepository.save(enrollment);
    }

    return {
      attemptId: savedAttempt.id,
      scoreObtained,
      passingScore: test.passingScore,
      passed,
      correctCount,
      totalQuestions,
      completedAt: savedAttempt.completedAt,
    };
  }

  async getMyAttempts(testId: string, userId: string): Promise<TestAttempt[]> {
    const test = await this.findById(testId);

    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        workspaceId: test.workspaceId,
        userId,
      },
    });

    if (!enrollment) {
      return [];
    }

    return this.attemptRepository.find({
      where: {
        testId: test.id,
        enrollmentId: enrollment.id,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
