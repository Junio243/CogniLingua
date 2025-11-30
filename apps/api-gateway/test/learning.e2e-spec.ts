import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { LearningService } from '../src/learning/learning.service';
import * as jwt from 'jsonwebtoken';

const buildAuthToken = () =>
  jwt.sign({ sub: 'student-123', roles: ['student'] }, process.env.ACCESS_TOKEN_SECRET || 'cognilingua_access_secret');

describe('LearningController (e2e)', () => {
  let app: INestApplication;
  const mockResponse = {
    success: true,
    message: 'Mock gRPC processed lesson',
    correlationId: 'corr-mock',
  };

  const learningServiceMock = {
    processLessonCompleted: jest.fn().mockResolvedValue(mockResponse),
  } satisfies Partial<LearningService>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LearningService)
      .useValue(learningServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve aceitar o webhook lesson-completed e encaminhar ao serviço gRPC mockado', async () => {
    const payload = {
      studentId: 'student-123',
      lessonId: 'lesson-789',
      score: 0.95,
      timestamp: new Date().toISOString(),
    };

    await request(app.getHttpServer())
      .post('/learning/lesson-completed')
      .set('Authorization', `Bearer ${buildAuthToken()}`)
      .send(payload)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject(mockResponse);
      });

    expect(learningServiceMock.processLessonCompleted).toHaveBeenCalledWith(payload, undefined);
  });
});
