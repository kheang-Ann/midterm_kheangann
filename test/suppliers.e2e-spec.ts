import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { default as request } from 'supertest';
import { AppModule } from '../src/app.module';

describe('Suppliers Endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdSupplierId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'sup-test@example.com', password: 'Password123', name: 'Sup Tester' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'sup-test@example.com', password: 'Password123' });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  describe('POST /suppliers', () => {
    it('should create a new supplier', async () => {
      const res = await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Tech Supplies Co.',
          email: 'supplier-e2e@techsupplies.com',
          phone: '+1-555-0100',
          contactPerson: 'Jane Smith',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Tech Supplies Co.');
      createdSupplierId = res.body.id;
    });

    it('should return 409 if supplier email already exists', async () => {
      await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Duplicate', email: 'supplier-e2e@techsupplies.com' })
        .expect(409);
    });

    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Bad Email', email: 'not-an-email' })
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/suppliers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: '+1-555-0000' })
        .expect(400);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/suppliers')
        .send({ name: 'Unauth', email: 'unauth@example.com' })
        .expect(401);
    });
  });

  // ─── READ ALL ────────────────────────────────────────────────────────────────

  describe('GET /suppliers', () => {
    it('should return all suppliers', async () => {
      const res = await request(app.getHttpServer())
        .get('/suppliers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/suppliers').expect(401);
    });
  });

  // ─── READ ONE ────────────────────────────────────────────────────────────────

  describe('GET /suppliers/:id', () => {
    it('should return a supplier by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/suppliers/${createdSupplierId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.id).toBe(createdSupplierId);
    });

    it('should return 404 for non-existent supplier', async () => {
      await request(app.getHttpServer())
        .get('/suppliers/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  describe('PATCH /suppliers/:id', () => {
    it('should update a supplier', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/suppliers/${createdSupplierId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Supplier Name', phone: '+1-555-9999' })
        .expect(200);

      expect(res.body.name).toBe('Updated Supplier Name');
      expect(res.body.phone).toBe('+1-555-9999');
    });

    it('should return 404 for non-existent supplier', async () => {
      await request(app.getHttpServer())
        .patch('/suppliers/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Ghost' })
        .expect(404);
    });
  });

  // ─── DELETE ──────────────────────────────────────────────────────────────────

  describe('DELETE /suppliers/:id', () => {
    it('should delete a supplier', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/suppliers/${createdSupplierId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toContain('deleted successfully');
    });

    it('should return 404 after deletion', async () => {
      await request(app.getHttpServer())
        .get(`/suppliers/${createdSupplierId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent supplier', async () => {
      await request(app.getHttpServer())
        .delete('/suppliers/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/suppliers/${createdSupplierId}`)
        .expect(401);
    });
  });
});
