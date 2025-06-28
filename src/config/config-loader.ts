import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { MockConfig } from '../types/config';
import { ConfigValidator } from './config-validator';

/**
 * ConfigLoader handles loading and parsing configuration files
 * Supports both YAML and JSON formats
 */
export class ConfigLoader {
  private readonly supportedExtensions = ['.yaml', '.yml', '.json'];
  private readonly validator = new ConfigValidator();

  /**
   * Load configuration from a file (YAML or JSON)
   * @param filePath Path to the configuration file
   * @returns Promise<MockConfig> Parsed configuration object
   * @throws Error if file doesn't exist or has invalid format
   */
  async loadFromFile(filePath: string): Promise<MockConfig> {
    this.validateFilePath(filePath);
    
    const fileContent = this.readFileContent(filePath);
    const configObject = this.parseFileContent(fileContent, filePath);
    
    return this.loadFromObject(configObject as MockConfig);
  }

  /**
   * Load configuration from an object
   * @param configObject Configuration object
   * @returns MockConfig Validated configuration object
   * @throws Error if configuration is invalid
   */
  loadFromObject(configObject: MockConfig): MockConfig {
    // Basic type validation
    if (!configObject || typeof configObject !== 'object') {
      throw new Error('Configuration must be an object');
    }

    // Detailed validation using ConfigValidator
    const validationResult = this.validator.validate(configObject);
    
    if (!validationResult.isValid) {
      const errorMessages = validationResult.errors
        .map(error => `${error.field}: ${error.message}`)
        .join('; ');
      throw new Error(`Configuration validation failed: ${errorMessages}`);
    }

    return configObject;
  }

  /**
   * Validate file path and existence
   * @private
   */
  private validateFilePath(filePath: string): void {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File path must be a non-empty string');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Configuration file not found: ${filePath}`);
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    if (!this.supportedExtensions.includes(fileExtension)) {
      throw new Error(`Unsupported file format: ${fileExtension}. Supported formats: ${this.supportedExtensions.join(', ')}`);
    }
  }

  /**
   * Read file content safely
   * @private
   */
  private readFileContent(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file: ${filePath}. ${(error as Error).message}`);
    }
  }

  /**
   * Parse file content based on extension
   * @private
   */
  private parseFileContent(content: string, filePath: string): unknown {
    const fileExtension = path.extname(filePath).toLowerCase();

    try {
      if (fileExtension === '.yaml' || fileExtension === '.yml') {
        return yaml.load(content);
      } else if (fileExtension === '.json') {
        return JSON.parse(content);
      }
    } catch (error) {
      if (error instanceof yaml.YAMLException) {
        throw new Error(`Invalid YAML format: ${error.message}`);
      } else if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON format: ${error.message}`);
      }
      throw error;
    }

    throw new Error(`Unsupported file format: ${fileExtension}`);
  }
}