import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { LearningService } from '../src/learning/learning.service';

describe('LearningController (e2e)', () => {
  let app: INestApplication;
  const mockResponse = {
    success: true,
    message: 'Mock gRPC processed lesson',
  };

  const learningServiceMock = {
    forwardLessonCompleted: jest.fn().mockResolvedValue(mockResponse),
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
      score: 95,
      timestamp: new Date().toISOString(),
    };

    await request(app.getHttpServer())
      .post('/learning/lesson-completed')
      .send(payload)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(mockResponse);
      });

    expect(learningServiceMock.forwardLessonCompleted).toHaveBeenCalledWith(payload);
  });
});
