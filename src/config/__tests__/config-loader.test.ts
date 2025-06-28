import { ConfigLoader } from '../config-loader';
import { MockConfig } from '../../types/config';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('ConfigLoader', () => {
  let configLoader: ConfigLoader;
  const testConfigPath = 'test-config.yaml';

  beforeEach(() => {
    configLoader = new ConfigLoader();
    jest.clearAllMocks();
  });

  describe('loadFromFile', () => {
    it('should load valid YAML configuration file', async () => {
      // 🔴 RED: This test will fail because ConfigLoader doesn't exist yet
      const validYamlConfig = `
server:
  port: 3000
  host: localhost
  cors: true
apis:
  - path: /api/users
    method: GET
    response:
      status: 200
      body:
        - id: 1
          name: "John Doe"
`;

      mockedFs.readFileSync.mockReturnValue(validYamlConfig);
      mockedFs.existsSync.mockReturnValue(true);

      const config = await configLoader.loadFromFile(testConfigPath);

      expect(config).toBeDefined();
      expect(config.server.port).toBe(3000);
      expect(config.server.host).toBe('localhost');
      expect(config.server.cors).toBe(true);
      expect(config.apis).toHaveLength(1);
      expect(config.apis[0].path).toBe('/api/users');
      expect(config.apis[0].method).toBe('GET');
      expect(config.apis[0].response.status).toBe(200);
    });

    it('should load valid JSON configuration file', async () => {
      // 🔴 RED: This test will fail because ConfigLoader doesn't exist yet
      const validJsonConfig = JSON.stringify({
        server: {
          port: 4000,
          host: '0.0.0.0',
          cors: false
        },
        apis: [
          {
            path: '/api/posts',
            method: 'POST',
            response: {
              status: 201,
              body: { id: 1, title: 'New Post' }
            }
          }
        ]
      });

      mockedFs.readFileSync.mockReturnValue(validJsonConfig);
      mockedFs.existsSync.mockReturnValue(true);

      const config = await configLoader.loadFromFile('test-config.json');

      expect(config).toBeDefined();
      expect(config.server.port).toBe(4000);
      expect(config.server.host).toBe('0.0.0.0');
      expect(config.server.cors).toBe(false);
      expect(config.apis).toHaveLength(1);
      expect(config.apis[0].path).toBe('/api/posts');
      expect(config.apis[0].method).toBe('POST');
    });

    it('should throw error when file does not exist', async () => {
      // 🔴 RED: This test will fail because ConfigLoader doesn't exist yet
      mockedFs.existsSync.mockReturnValue(false);

      await expect(configLoader.loadFromFile('nonexistent.yaml'))
        .rejects
        .toThrow('Configuration file not found: nonexistent.yaml');
    });

    it('should throw error when file contains invalid YAML', async () => {
      // 🔴 RED: This test will fail because ConfigLoader doesn't exist yet
      const invalidYaml = `
server:
  port: 3000
  host: localhost
  cors: true
apis:
  - path: /api/users
    method: GET
    response:
      status: 200
      body: [invalid yaml syntax
`;

      mockedFs.readFileSync.mockReturnValue(invalidYaml);
      mockedFs.existsSync.mockReturnValue(true);

      await expect(configLoader.loadFromFile(testConfigPath))
        .rejects
        .toThrow('Invalid YAML format');
    });

    it('should throw error when file contains invalid JSON', async () => {
      // 🔴 RED: This test will fail because ConfigLoader doesn't exist yet
      const invalidJson = '{ "server": { "port": 3000, "host": "localhost" } invalid json }';

      mockedFs.readFileSync.mockReturnValue(invalidJson);
      mockedFs.existsSync.mockReturnValue(true);

      await expect(configLoader.loadFromFile('test-config.json'))
        .rejects
        .toThrow('Invalid JSON format');
    });
  });

  describe('loadFromObject', () => {
    it('should load configuration from object', () => {
      // 🔴 RED: This test will fail because ConfigLoader doesn't exist yet
      const configObject = {
        server: {
          port: 3000,
          host: 'localhost',
          cors: true
        },
        apis: [
          {
            path: '/api/test',
            method: 'GET' as const,
            response: {
              status: 200,
              body: { message: 'test' }
            }
          }
        ]
      };

      const config = configLoader.loadFromObject(configObject);

      expect(config).toEqual(configObject);
    });
  });
});