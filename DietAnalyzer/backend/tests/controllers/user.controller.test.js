import { jest } from '@jest/globals';


jest.mock('../../src/models/user.model.js');
jest.mock('jsonwebtoken');

// Import modules after mocking
import { signUp, signIn } from '../../src/controllers/user.controller.js';
import { User } from '../../src/models/user.model.js';
import jwt from 'jsonwebtoken';

// Define utility classes


global.ApiError = class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
  }
};

global.ApiResponse = class ApiResponse {
  constructor(statusCode, data, message) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
};

// Mock environment variables
process.env.MONGO_URI = 'mongodb+srv://ritik224:holaamigo@cluster0.vk31i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0PORT=8000t';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.ACCESS_TOKEN_SECRET = 'complex_string';
process.env.REFRESH_TOKEN_SECRET = 'complex_string_2';
process.env.PORT = '8000';

// Bad Smell 1: Duplicate error handling in each controller method
// Each controller has its own try-catch block with similar error handling logic

// Bad Smell 2: Scattered validation logic
// Each controller handles its own input validation without centralization

describe('User Controller (Original - with code smells)', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup request object
    req = {
      body: {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      },
      cookies: {
        refreshToken: 'test-refresh-token'
      },
      user: {
        _id: 'test-user-id'
      }
    };
    
    // Setup response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    // Mock console.log
    console.log = jest.fn();
  });

  describe('signUp with duplicate error handling', () => {
    test('handles successful signup', async () => {
      // Setup
      const mockUser = {
        _id: 'test-id',
        username: 'testuser',
        email: 'test@test.com'
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(mockUser);
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Execute
      const result = await signUp(req, res);

      // Verify
      expect(User.findOne).toHaveBeenCalled();
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 201,
          message: "User created successfully"
        })
      );
    }, 30000); // Increased timeout

    test('demonstrates duplicate error handling', async () => {
      // Setup
      User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      // Execute
      const result = await signUp(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: "Internal server error"
        })
      );
    }, 30000); // Increased timeout
  });

  describe('signIn with scattered validation', () => {
    test('shows scattered validation handling', async () => {
      // Setup
      req.body = {};
      
      // Execute
      const result = await signIn(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Username is required"
        })
      );
    }, 30000); // Increased timeout

    test('demonstrates successful login', async () => {
      // Setup
      const mockUser = {
        _id: 'test-id',
        username: 'testuser',
        isPasswordCorrect: jest.fn().mockResolvedValue(true),
        generateAccessToken: jest.fn().mockReturnValue('access-token'),
        generateRefreshToken: jest.fn().mockReturnValue('refresh-token'),
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Execute
      const result = await signIn(req, res);

      // Verify
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 200,
          data: expect.objectContaining({
            user: expect.anything()
          }),
          message: "User logged in successfully"
        })
      );
    }, 30000); // Increased timeout
  });
});

global.ApiError = class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
  }
};

global.ApiResponse = class ApiResponse {
  constructor(statusCode, data, message) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
};

// Create mock functions
const mockGenerateTokens = {
  generateAccessToken: jest.fn().mockReturnValue('mock-access-token'),
  generateRefreshToken: jest.fn().mockReturnValue('mock-refresh-token'),
  save: jest.fn().mockResolvedValue(true)
};

// Mock User model
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  ...mockGenerateTokens
};

// Set up mocks
jest.mock('../../src/models/user.model.js', () => ({
  User: mockUserModel
}));

jest.mock('../../src/utils/ApiResonse.js', () => ({
  ApiResponse: global.ApiResponse
}));

jest.mock('../../src/utils/ApiError.js', () => ({
  ApiError: global.ApiError
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
  verify: jest.fn(() => ({ _id: 'mock-user-id' }))
}));

// Import controller functions
import { signUp, signIn } from '../../src/controllers/user.controller.js';

describe('User Controller (Original - with code smells)', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      },
      cookies: {
        refreshToken: 'test-refresh-token'
      },
      user: {
        _id: 'test-user-id'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };

    console.log = jest.fn();
  });

  describe('signUp with duplicate error handling', () => {
    test('handles successful signup', async () => {
      // Arrange
      const mockUser = {
        _id: 'test-id',
        username: 'testuser',
        email: 'test@test.com',
        ...mockGenerateTokens
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Act
      await signUp(req, res);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ username: 'testuser' }, { email: 'test@test.com' }]
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 201,
          message: "User created successfully"
        })
      );
    });

    test('demonstrates duplicate error handling', async () => {
      // Arrange
      const dbError = new Error('Database error');
      mockUserModel.findOne.mockRejectedValue(dbError);

      // Act
      await signUp(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
          message: "Internal server error"
        })
      );
    });
  });

  describe('signIn with scattered validation', () => {
    test('shows scattered validation handling', async () => {
      // Arrange
      req.body = {};
      
      // Act
      await signIn(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: "Username is required"
        })
      );
    });

    test('demonstrates successful login', async () => {
      // Arrange
      const mockUser = {
        _id: 'test-id',
        username: 'testuser',
        isPasswordCorrect: jest.fn().mockResolvedValue(true),
        ...mockGenerateTokens
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      // Act
      await signIn(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 200,
          message: "User logged in successfully"
        })
      );
    });
  });
});