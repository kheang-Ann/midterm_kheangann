import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const mockAuthResult = {
  user: { id: 1, email: 'test@example.com', name: 'Test User', role: 'user', createdAt: new Date(), updatedAt: new Date() },
  token: 'mock-jwt-token',
};

const mockProfile = { id: 1, email: 'test@example.com', name: 'Test User', role: 'user', createdAt: new Date(), updatedAt: new Date() };

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      authService.register.mockResolvedValue(mockAuthResult);

      const result = await controller.register({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });

      expect(authService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      authService.login.mockResolvedValue(mockAuthResult);

      const result = await controller.login({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with user id from request', async () => {
      authService.getProfile.mockResolvedValue(mockProfile);
      const mockReq = { user: { id: 1 } };

      const result = await controller.getProfile(mockReq);

      expect(authService.getProfile).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProfile);
    });
  });
});
