import { ConfigValidator } from '../config-validator';
import { MockConfig, ValidationError } from '../../types/config';

describe('ConfigValidator', () => {
  let validator: ConfigValidator;

  beforeEach(() => {
    validator = new ConfigValidator();
  });

  describe('validate', () => {
    it('should validate a correct configuration', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const validConfig: MockConfig = {
        server: {
          port: 3000,
          host: 'localhost',
          cors: true
        },
        apis: [
          {
            path: '/api/users',
            method: 'GET',
            response: {
              status: 200,
              body: { message: 'Hello' }
            }
          }
        ]
      };

      const result = validator.validate(validConfig);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject configuration without server', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const invalidConfig = {
        apis: []
      } as MockConfig;

      const result = validator.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'server',
        message: 'Server configuration is required'
      });
    });

    it('should reject configuration without apis', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const invalidConfig = {
        server: {
          port: 3000,
          host: 'localhost',
          cors: true
        }
      } as MockConfig;

      const result = validator.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'apis',
        message: 'APIs array is required'
      });
    });

    it('should validate server port range', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const invalidConfig: MockConfig = {
        server: {
          port: 99999, // Invalid port
          host: 'localhost',
          cors: true
        },
        apis: []
      };

      const result = validator.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'server.port',
        message: 'Port must be between 1 and 65535',
        value: 99999
      });
    });

    it('should validate HTTP methods', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const invalidConfig: MockConfig = {
        server: {
          port: 3000,
          host: 'localhost',
          cors: true
        },
        apis: [
          {
            path: '/api/test',
            method: 'INVALID' as any,
            response: {
              status: 200,
              body: {}
            }
          }
        ]
      };

      const result = validator.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'apis[0].method',
        message: 'Invalid HTTP method: INVALID',
        value: 'INVALID'
      });
    });

    it('should validate API paths', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const invalidConfig: MockConfig = {
        server: {
          port: 3000,
          host: 'localhost',
          cors: true
        },
        apis: [
          {
            path: '', // Empty path
            method: 'GET',
            response: {
              status: 200,
              body: {}
            }
          }
        ]
      };

      const result = validator.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'apis[0].path',
        message: 'API path cannot be empty'
      });
    });

    it('should validate response status codes', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const invalidConfig: MockConfig = {
        server: {
          port: 3000,
          host: 'localhost',
          cors: true
        },
        apis: [
          {
            path: '/api/test',
            method: 'GET',
            response: {
              status: 999, // Invalid status code
              body: {}
            }
          }
        ]
      };

      const result = validator.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'apis[0].response.status',
        message: 'HTTP status code must be between 100 and 599',
        value: 999
      });
    });

    it('should validate multiple errors', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const invalidConfig = {
        server: {
          port: -1,
          host: '',
          cors: true
        },
        apis: [
          {
            path: '',
            method: 'INVALID',
            response: {
              status: 999,
              body: {}
            }
          }
        ]
      } as MockConfig;

      const result = validator.validate(invalidConfig);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateServer', () => {
    it('should validate server configuration separately', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const validServer = {
        port: 3000,
        host: 'localhost',
        cors: true
      };

      const errors = validator.validateServer(validServer);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateApis', () => {
    it('should validate APIs array separately', () => {
      // 🔴 RED: This test will fail because ConfigValidator doesn't exist yet
      const validApis = [
        {
          path: '/api/test',
          method: 'GET' as const,
          response: {
            status: 200,
            body: { message: 'test' }
          }
        }
      ];

      const errors = validator.validateApis(validApis);
      expect(errors).toHaveLength(0);
    });
  });
});