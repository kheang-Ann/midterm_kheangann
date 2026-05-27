import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: '$2a$10$hashedpassword',
  name: 'Test User',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── Register ───────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should register a new user and return token', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash the password before saving', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      // Capture what was passed to create() to verify password was hashed
      await service.register({
        email: 'new@example.com',
        password: 'plainpassword',
        name: 'New User',
      });

      // The create call should have received a hashed password (not the plain one)
      const createCallArg = userRepository.create.mock.calls[0][0];
      expect(createCallArg.password).not.toBe('plainpassword');
      expect(createCallArg.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });

  // ─── Login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userWithHash = { ...mockUser, password: hashedPassword };
      userRepository.findOne.mockResolvedValue(userWithHash);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      userRepository.findOne.mockResolvedValue({ ...mockUser, password: hashedPassword });

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── validateUser ────────────────────────────────────────────────────────────

  describe('validateUser', () => {
    it('should return user if found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.validateUser(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await service.validateUser(999);
      expect(result).toBeNull();
    });
  });

  // ─── getProfile ──────────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.getProfile(1);
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.getProfile(999)).rejects.toThrow(UnauthorizedException);
    });
  });
});
