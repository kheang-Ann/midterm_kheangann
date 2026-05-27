import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { default as request } from 'supertest';
import { AppModule } from '../src/app.module';

describe('Inventory Endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdItemId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    // Register and login to get token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'inv-test@example.com', password: 'Password123', name: 'Inv Tester' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'inv-test@example.com', password: 'Password123' });

    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  describe('POST /inventory', () => {
    it('should create a new inventory item', async () => {
      const res = await request(app.getHttpServer())
        .post('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Laptop Dell XPS 15',
          sku: 'DELL-XPS15-E2E',
          price: 1299.99,
          quantity: 50,
          category: 'Electronics',
          lowStockThreshold: 10,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.sku).toBe('DELL-XPS15-E2E');
      expect(res.body.status).toBe('available');
      createdItemId = res.body.id;
    });

    it('should return 409 if SKU already exists', async () => {
      await request(app.getHttpServer())
        .post('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Duplicate', sku: 'DELL-XPS15-E2E', price: 100 })
        .expect(409);
    });

    it('should return 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'No SKU or Price' })
        .expect(400);
    });

    it('should return 400 for negative price', async () => {
      await request(app.getHttpServer())
        .post('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Bad Price', sku: 'BAD-PRICE-001', price: -10 })
        .expect(400);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/inventory')
        .send({ name: 'Unauth', sku: 'UNAUTH-001', price: 100 })
        .expect(401);
    });

    it('should set status to out_of_stock when quantity is 0', async () => {
      const res = await request(app.getHttpServer())
        .post('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Empty Item', sku: 'EMPTY-E2E-001', price: 50, quantity: 0 })
        .expect(201);

      expect(res.body.status).toBe('out_of_stock');
    });
  });

  // ─── READ ALL ────────────────────────────────────────────────────────────────

  describe('GET /inventory', () => {
    it('should return all inventory items', async () => {
      const res = await request(app.getHttpServer())
        .get('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const res = await request(app.getHttpServer())
        .get('/inventory?category=Electronics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((item: any) => {
        expect(item.category).toBe('Electronics');
      });
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer()).get('/inventory').expect(401);
    });
  });

  // ─── READ ONE ────────────────────────────────────────────────────────────────

  describe('GET /inventory/:id', () => {
    it('should return a single item by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/inventory/${createdItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.id).toBe(createdItemId);
      expect(res.body.sku).toBe('DELL-XPS15-E2E');
    });

    it('should return 404 for non-existent item', async () => {
      await request(app.getHttpServer())
        .get('/inventory/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 for invalid ID format', async () => {
      await request(app.getHttpServer())
        .get('/inventory/not-a-number')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  // ─── READ BY SKU ─────────────────────────────────────────────────────────────

  describe('GET /inventory/sku/:sku', () => {
    it('should return item by SKU', async () => {
      const res = await request(app.getHttpServer())
        .get('/inventory/sku/DELL-XPS15-E2E')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.sku).toBe('DELL-XPS15-E2E');
    });

    it('should return 404 for non-existent SKU', async () => {
      await request(app.getHttpServer())
        .get('/inventory/sku/NONEXISTENT-SKU')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  // ─── AVAILABILITY ────────────────────────────────────────────────────────────

  describe('GET /inventory/:id/availability', () => {
    it('should return availability info', async () => {
      const res = await request(app.getHttpServer())
        .get(`/inventory/${createdItemId}/availability`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('isAvailable');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('quantity');
      expect(res.body.isAvailable).toBe(true);
    });
  });

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  describe('PATCH /inventory/:id', () => {
    it('should update an inventory item', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/inventory/${createdItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Laptop', price: 1199.99 })
        .expect(200);

      expect(res.body.name).toBe('Updated Laptop');
      expect(parseFloat(res.body.price)).toBe(1199.99);
    });

    it('should return 404 for non-existent item', async () => {
      await request(app.getHttpServer())
        .patch('/inventory/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Ghost' })
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/inventory/${createdItemId}`)
        .send({ name: 'Unauth' })
        .expect(401);
    });
  });

  // ─── STOCK ADJUSTMENT ────────────────────────────────────────────────────────

  describe('PATCH /inventory/:id/stock', () => {
    it('should increase stock', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/inventory/${createdItemId}/stock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ adjustment: 20, reason: 'New shipment' })
        .expect(200);

      expect(res.body.quantity).toBe(70);
    });

    it('should decrease stock', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/inventory/${createdItemId}/stock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ adjustment: -10 })
        .expect(200);

      expect(res.body.quantity).toBe(60);
    });

    it('should return 400 when stock goes below 0', async () => {
      await request(app.getHttpServer())
        .patch(`/inventory/${createdItemId}/stock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ adjustment: -9999 })
        .expect(400);
    });
  });

  // ─── LOW STOCK ───────────────────────────────────────────────────────────────

  describe('GET /inventory/low-stock', () => {
    it('should return low stock items', async () => {
      // Create a low-stock item first
      await request(app.getHttpServer())
        .post('/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Low Stock Item', sku: 'LOW-E2E-001', price: 10, quantity: 3, lowStockThreshold: 10 });

      const res = await request(app.getHttpServer())
        .get('/inventory/low-stock')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ─── DELETE ──────────────────────────────────────────────────────────────────

  describe('DELETE /inventory/:id', () => {
    it('should delete an inventory item', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/inventory/${createdItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toContain('deleted successfully');
    });

    it('should return 404 after deletion', async () => {
      await request(app.getHttpServer())
        .get(`/inventory/${createdItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent item', async () => {
      await request(app.getHttpServer())
        .delete('/inventory/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/inventory/${createdItemId}`)
        .expect(401);
    });
  });
});
