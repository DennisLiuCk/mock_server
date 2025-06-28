// Configuration types for the Mock API Server

export interface ServerConfig {
  port: number;
  host: string;
  cors: boolean;
}

export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  response: ApiResponse;
  responses?: ConditionalResponse[];
}

export interface ApiResponse {
  status: number;
  headers?: Record<string, string>;
  body?: unknown;
  delay?: number;
}

export interface ConditionalResponse {
  condition?: ResponseCondition;
  probability?: number;
  response: ApiResponse;
}

export interface ResponseCondition {
  [key: string]: unknown;
}

export interface MockConfig {
  server: ServerConfig;
  apis: ApiEndpoint[];
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}