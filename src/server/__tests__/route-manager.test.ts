import express, { Express } from 'express';
import request from 'supertest';
import { RouteManager } from '../route-manager';
import { ApiEndpoint } from '../../types/config';

describe('RouteManager', () => {
  let app: Express;
  let routeManager: RouteManager;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    routeManager = new RouteManager();
  });

  describe('registerRoute', () => {
    it('should register a simple GET route', async () => {
      // 🔴 RED: This test will fail because RouteManager doesn't exist yet
      const apiEndpoint: ApiEndpoint = {
        path: '/api/test',
        method: 'GET',
        response: {
          status: 200,
          body: { message: 'Hello World' }
        }
      };

      routeManager.registerRoute(app, apiEndpoint);

      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.body).toEqual({ message: 'Hello World' });
    });

    it('should register a POST route', async () => {
      // 🔴 RED: This test will fail because RouteManager doesn't exist yet
      const apiEndpoint: ApiEndpoint = {
        path: '/api/users',
        method: 'POST',
        response: {
          status: 201,
          body: { id: 1, name: 'Created' }
        }
      };

      routeManager.registerRoute(app, apiEndpoint);

      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John' })
        .expect(201);

      expect(response.body).toEqual({ id: 1, name: 'Created' });
    });

    it('should handle path parameters', async () => {
      // 🔴 RED: This test will fail because RouteManager doesn't exist yet
      const apiEndpoint: ApiEndpoint = {
        path: '/api/users/:id',
        method: 'GET',
        response: {
          status: 200,
          body: { id: '{{params.id}}', name: 'User {{params.id}}' }
        }
      };

      routeManager.registerRoute(app, apiEndpoint);

      const response = await request(app)
        .get('/api/users/123')
        .expect(200);

      expect(response.body).toEqual({ id: '123', name: 'User 123' });
    });

    it('should handle custom headers', async () => {
      // 🔴 RED: This test will fail because RouteManager doesn't exist yet
      const apiEndpoint: ApiEndpoint = {
        path: '/api/custom-headers',
        method: 'GET',
        response: {
          status: 200,
          headers: {
            'X-Custom-Header': 'custom-value',
            'Content-Type': 'application/json'
          },
          body: { message: 'With headers' }
        }
      };

      routeManager.registerRoute(app, apiEndpoint);

      const response = await request(app)
        .get('/api/custom-headers')
        .expect(200);

      expect(response.headers['x-custom-header']).toBe('custom-value');
      expect(response.body).toEqual({ message: 'With headers' });
    });

    it('should handle different HTTP methods', async () => {
      // 🔴 RED: This test will fail because RouteManager doesn't exist yet
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
      
      methods.forEach(method => {
        const apiEndpoint: ApiEndpoint = {
          path: `/api/${method.toLowerCase()}`,
          method,
          response: {
            status: 200,
            body: { method }
          }
        };

        routeManager.registerRoute(app, apiEndpoint);
      });

      // Test each method
      for (const method of methods) {
        const response = await request(app)
          [method.toLowerCase() as 'get'](`/api/${method.toLowerCase()}`)
          .expect(200);

        expect(response.body).toEqual({ method });
      }
    });

    it('should handle query parameters in templates', async () => {
      // 🔴 RED: This test will fail because RouteManager doesn't exist yet
      const apiEndpoint: ApiEndpoint = {
        path: '/api/search',
        method: 'GET',
        response: {
          status: 200,
          body: { 
            query: '{{query.q}}',
            limit: '{{query.limit}}'
          }
        }
      };

      routeManager.registerRoute(app, apiEndpoint);

      const response = await request(app)
        .get('/api/search?q=test&limit=10')
        .expect(200);

      expect(response.body).toEqual({ 
        query: 'test',
        limit: '10'
      });
    });

    it('should handle request body in templates', async () => {
      // 🔴 RED: This test will fail because RouteManager doesn't exist yet
      const apiEndpoint: ApiEndpoint = {
        path: '/api/echo',
        method: 'POST',
        response: {
          status: 200,
          body: { 
            received: '{{body.message}}',
            user: '{{body.user.name}}'
          }
        }
      };

      routeManager.registerRoute(app, apiEndpoint);

      const response = await request(app)
        .post('/api/echo')
        .send({ 
          message: 'Hello',
          user: { name: 'John' }
        })
        .expect(200);

      expect(response.body).toEqual({ 
        received: 'Hello',
        user: 'John'
      });
    });
  });
});