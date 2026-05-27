import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('getHealth', () => {
    it('should return status ok with message', () => {
      const result = controller.getHealth();
      expect(result.status).toBe('ok');
      expect(result.message).toBe('Inventory Management API is running');
    });
  });
});
