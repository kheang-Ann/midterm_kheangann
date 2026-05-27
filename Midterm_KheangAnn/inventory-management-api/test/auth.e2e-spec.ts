import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { default as request } from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── REGISTER ───────────────────────────────────────────────────────────────

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'e2e@example.com', password: 'Password123', name: 'E2E User' })
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'e2e@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should return 409 if email already registered', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'e2e@example.com', password: 'Password123', name: 'E2E User' })
        .expect(409);
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'Password123', name: 'Bad User' })
        .expect(400);
    });

    it('should return 400 for short password', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'short@example.com', password: '123', name: 'Short Pass' })
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'missing@example.com' })
        .expect(400);
    });
  });

  // ─── LOGIN ──────────────────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('should login successfully and return token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'Password123' })
        .expect(200);

      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });

    it('should return 401 for wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'WrongPassword' })
        .expect(401);
    });

    it('should return 401 for non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'ghost@example.com', password: 'Password123' })
        .expect(401);
    });

    it('should return 400 for invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'bad-email', password: 'Password123' })
        .expect(400);
    });
  });

  // ─── PROFILE ────────────────────────────────────────────────────────────────

  describe('GET /auth/profile', () => {
    it('should return profile for authenticated user', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@example.com', password: 'Password123' });
      authToken = loginRes.body.token;

      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('email', 'e2e@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });
  });
});
