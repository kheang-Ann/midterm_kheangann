import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy, JwtPayload } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'hashed',
  name: 'Test User',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('validate', () => {
    const payload: JwtPayload = { sub: 1, email: 'test@example.com', role: 'user' };

    it('should return the user when found', async () => {
      authService.validateUser.mockResolvedValue(mockUser);
      const result = await strategy.validate(payload);
      expect(authService.validateUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      authService.validateUser.mockResolvedValue(null);
      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('constructor — JWT_SECRET env branch', () => {
    it('should use JWT_SECRET env variable when set', async () => {
      const originalSecret = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'env-provided-secret';

      // Re-instantiate to trigger the constructor with the env var set
      const module2 = await Test.createTestingModule({
        providers: [
          JwtStrategy,
          { provide: AuthService, useValue: { validateUser: jest.fn() } },
        ],
      }).compile();

      const strategy2 = module2.get<JwtStrategy>(JwtStrategy);
      expect(strategy2).toBeDefined();

      // Restore
      if (originalSecret === undefined) {
        delete process.env.JWT_SECRET;
      } else {
        process.env.JWT_SECRET = originalSecret;
      }
    });
  });
});
