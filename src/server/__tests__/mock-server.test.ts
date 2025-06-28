import request from 'supertest';
import { MockServer } from '../mock-server';
import { MockConfig } from '../../types/config';

describe('MockServer', () => {
  let mockServer: MockServer;
  let testConfig: MockConfig;

  beforeEach(() => {
    testConfig = {
      server: {
        port: 3001, // Use different port for testing
        host: 'localhost',
        cors: true
      },
      apis: [
        {
          path: '/api/test',
          method: 'GET',
          response: {
            status: 200,
            body: { message: 'Hello World' }
          }
        },
        {
          path: '/api/users/:id',
          method: 'GET',
          response: {
            status: 200,
            body: { id: '{{params.id}}', name: 'User {{params.id}}' }
          }
        }
      ]
    };
  });

  afterEach(async () => {
    if (mockServer) {
      await mockServer.stop();
    }
  });

  describe('constructor', () => {
    it('should create MockServer instance with configuration', () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      mockServer = new MockServer(testConfig);
      expect(mockServer).toBeDefined();
      expect(mockServer.getConfig()).toEqual(testConfig);
    });

    it('should throw error with invalid configuration', () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      const invalidConfig = {} as MockConfig;
      
      expect(() => {
        new MockServer(invalidConfig);
      }).toThrow('Configuration validation failed');
    });
  });

  describe('start', () => {
    it('should start the server on configured port', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      mockServer = new MockServer(testConfig);
      
      await mockServer.start();
      expect(mockServer.isRunning()).toBe(true);
      
      // Test if server is actually listening
      const response = await request(mockServer.getApp())
        .get('/api/test')
        .expect(200);
      
      expect(response.body).toEqual({ message: 'Hello World' });
    });

    it('should throw error if server is already running', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      mockServer = new MockServer(testConfig);
      await mockServer.start();
      
      await expect(mockServer.start()).rejects.toThrow('Server is already running');
    });

    it('should enable CORS when configured', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      mockServer = new MockServer(testConfig);
      await mockServer.start();
      
      const response = await request(mockServer.getApp())
        .options('/api/test')
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('stop', () => {
    it('should stop the running server', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      mockServer = new MockServer(testConfig);
      await mockServer.start();
      expect(mockServer.isRunning()).toBe(true);
      
      await mockServer.stop();
      expect(mockServer.isRunning()).toBe(false);
    });

    it('should not throw error if server is not running', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      mockServer = new MockServer(testConfig);
      
      await expect(mockServer.stop()).resolves.not.toThrow();
    });
  });

  describe('API endpoints', () => {
    beforeEach(async () => {
      mockServer = new MockServer(testConfig);
      await mockServer.start();
    });

    it('should handle GET requests', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      const response = await request(mockServer.getApp())
        .get('/api/test')
        .expect(200);
      
      expect(response.body).toEqual({ message: 'Hello World' });
    });

    it('should handle path parameters', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      const response = await request(mockServer.getApp())
        .get('/api/users/123')
        .expect(200);
      
      expect(response.body).toEqual({ id: '123', name: 'User 123' });
    });

    it('should return 404 for undefined routes', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      await request(mockServer.getApp())
        .get('/api/nonexistent')
        .expect(404);
    });

    it('should handle POST requests with body', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      const postConfig: MockConfig = {
        ...testConfig,
        apis: [
          ...testConfig.apis,
          {
            path: '/api/users',
            method: 'POST',
            response: {
              status: 201,
              body: { id: '{{random.number}}', name: '{{body.name}}' }
            }
          }
        ]
      };

      await mockServer.stop();
      mockServer = new MockServer(postConfig);
      await mockServer.start();

      const response = await request(mockServer.getApp())
        .post('/api/users')
        .send({ name: 'John Doe' })
        .expect(201);
      
      expect(response.body.name).toBe('John Doe');
      expect(response.body.id).toBeDefined();
    });
  });

  describe('updateConfig', () => {
    it('should update configuration and reload routes', async () => {
      // 🔴 RED: This test will fail because MockServer doesn't exist yet
      mockServer = new MockServer(testConfig);
      await mockServer.start();

      const newConfig: MockConfig = {
        ...testConfig,
        apis: [
          {
            path: '/api/new-endpoint',
            method: 'GET',
            response: {
              status: 200,
              body: { message: 'New endpoint' }
            }
          }
        ]
      };

      await mockServer.updateConfig(newConfig);

      const response = await request(mockServer.getApp())
        .get('/api/new-endpoint')
        .expect(200);
      
      expect(response.body).toEqual({ message: 'New endpoint' });
    });
  });
});