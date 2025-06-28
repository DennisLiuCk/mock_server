import { MockConfig, ServerConfig, ApiEndpoint, ValidationError, HttpMethod } from '../types/config';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * ConfigValidator validates Mock API Server configuration objects
 * Ensures all required fields are present and have valid values
 */
export class ConfigValidator {
  private readonly validHttpMethods: HttpMethod[] = [
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'
  ];

  /**
   * Validate a complete configuration object
   * @param config Configuration object to validate
   * @returns ValidationResult with validation status and errors
   */
  validate(config: MockConfig): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate server configuration
    if (!config.server) {
      errors.push({
        field: 'server',
        message: 'Server configuration is required'
      });
    } else {
      errors.push(...this.validateServer(config.server));
    }

    // Validate APIs array
    if (!config.apis) {
      errors.push({
        field: 'apis',
        message: 'APIs array is required'
      });
    } else if (!Array.isArray(config.apis)) {
      errors.push({
        field: 'apis',
        message: 'APIs must be an array'
      });
    } else {
      errors.push(...this.validateApis(config.apis));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate server configuration
   * @param server Server configuration object
   * @returns Array of validation errors
   */
  validateServer(server: ServerConfig): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate port
    if (typeof server.port !== 'number') {
      errors.push({
        field: 'server.port',
        message: 'Port must be a number',
        value: server.port
      });
    } else if (server.port < 1 || server.port > 65535) {
      errors.push({
        field: 'server.port',
        message: 'Port must be between 1 and 65535',
        value: server.port
      });
    }

    // Validate host
    if (typeof server.host !== 'string') {
      errors.push({
        field: 'server.host',
        message: 'Host must be a string',
        value: server.host
      });
    } else if (server.host.trim() === '') {
      errors.push({
        field: 'server.host',
        message: 'Host cannot be empty',
        value: server.host
      });
    }

    // Validate cors
    if (typeof server.cors !== 'boolean') {
      errors.push({
        field: 'server.cors',
        message: 'CORS must be a boolean',
        value: server.cors
      });
    }

    return errors;
  }

  /**
   * Validate APIs array
   * @param apis Array of API endpoint configurations
   * @returns Array of validation errors
   */
  validateApis(apis: ApiEndpoint[]): ValidationError[] {
    const errors: ValidationError[] = [];

    apis.forEach((api, index) => {
      errors.push(...this.validateApiEndpoint(api, index));
    });

    return errors;
  }

  /**
   * Validate a single API endpoint
   * @param api API endpoint configuration
   * @param index Index of the API in the array (for error reporting)
   * @returns Array of validation errors
   */
  private validateApiEndpoint(api: ApiEndpoint, index: number): ValidationError[] {
    const errors: ValidationError[] = [];
    const prefix = `apis[${index}]`;

    // Validate path
    if (typeof api.path !== 'string') {
      errors.push({
        field: `${prefix}.path`,
        message: 'API path must be a string',
        value: api.path
      });
    } else if (api.path.trim() === '') {
      errors.push({
        field: `${prefix}.path`,
        message: 'API path cannot be empty'
      });
    }

    // Validate method
    if (!this.validHttpMethods.includes(api.method)) {
      errors.push({
        field: `${prefix}.method`,
        message: `Invalid HTTP method: ${api.method}`,
        value: api.method
      });
    }

    // Validate response
    if (!api.response) {
      errors.push({
        field: `${prefix}.response`,
        message: 'API response is required'
      });
    } else {
      errors.push(...this.validateApiResponse(api.response, `${prefix}.response`));
    }

    // Validate responses array if present
    if (api.responses) {
      if (!Array.isArray(api.responses)) {
        errors.push({
          field: `${prefix}.responses`,
          message: 'Responses must be an array',
          value: api.responses
        });
      } else {
        api.responses.forEach((response, responseIndex) => {
          if (response.response) {
            errors.push(...this.validateApiResponse(
              response.response,
              `${prefix}.responses[${responseIndex}].response`
            ));
          }
        });
      }
    }

    return errors;
  }

  /**
   * Validate API response configuration
   * @param response API response configuration
   * @param fieldPrefix Prefix for error field names
   * @returns Array of validation errors
   */
  private validateApiResponse(response: any, fieldPrefix: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate status code
    if (typeof response.status !== 'number') {
      errors.push({
        field: `${fieldPrefix}.status`,
        message: 'Response status must be a number',
        value: response.status
      });
    } else if (response.status < 100 || response.status > 599) {
      errors.push({
        field: `${fieldPrefix}.status`,
        message: 'HTTP status code must be between 100 and 599',
        value: response.status
      });
    }

    // Validate headers if present
    if (response.headers && typeof response.headers !== 'object') {
      errors.push({
        field: `${fieldPrefix}.headers`,
        message: 'Response headers must be an object',
        value: response.headers
      });
    }

    // Validate delay if present
    if (response.delay !== undefined) {
      if (typeof response.delay !== 'number') {
        errors.push({
          field: `${fieldPrefix}.delay`,
          message: 'Response delay must be a number',
          value: response.delay
        });
      } else if (response.delay < 0) {
        errors.push({
          field: `${fieldPrefix}.delay`,
          message: 'Response delay cannot be negative',
          value: response.delay
        });
      }
    }

    return errors;
  }
}