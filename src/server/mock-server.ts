import express, { Express, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { MockConfig } from '../types/config';
import { ConfigLoader } from '../config/config-loader';
import { RouteManager } from './route-manager';

/**
 * MockServer is the core HTTP server that handles mock API requests
 * It manages Express server lifecycle and route registration
 */
export class MockServer {
  private app: Express;
  private server: Server | null = null;
  private config: MockConfig;
  private routeManager: RouteManager;
  private configLoader: ConfigLoader;

  constructor(config: MockConfig) {
    this.configLoader = new ConfigLoader();
    
    // Validate configuration
    this.config = this.configLoader.loadFromObject(config);
    
    // Initialize Express app
    this.app = express();
    this.routeManager = new RouteManager();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Start the HTTP server
   * @returns Promise that resolves when server is listening
   */
  async start(): Promise<void> {
    if (this.server) {
      throw new Error('Server is already running');
    }

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.server.port, this.config.server.host, () => {
        console.log(`Mock API Server running on http://${this.config.server.host}:${this.config.server.port}`);
        resolve();
      });

      this.server.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Stop the HTTP server
   * @returns Promise that resolves when server is closed
   */
  async stop(): Promise<void> {
    if (!this.server) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.server!.close((error) => {
        if (error) {
          reject(error);
        } else {
          this.server = null;
          console.log('Mock API Server stopped');
          resolve();
        }
      });
    });
  }

  /**
   * Check if server is currently running
   * @returns Boolean indicating if server is running
   */
  isRunning(): boolean {
    return this.server !== null && this.server.listening;
  }

  /**
   * Get the Express app instance (useful for testing)
   * @returns Express application instance
   */
  getApp(): Express {
    return this.app;
  }

  /**
   * Get current configuration
   * @returns Current MockConfig
   */
  getConfig(): MockConfig {
    return this.config;
  }

  /**
   * Update server configuration and reload routes
   * @param newConfig New configuration to apply
   */
  async updateConfig(newConfig: MockConfig): Promise<void> {
    // Validate new configuration
    const validatedConfig = this.configLoader.loadFromObject(newConfig);
    
    // Update configuration
    this.config = validatedConfig;
    
    // Clear existing routes and setup new ones
    this.clearRoutes();
    this.setupRoutes();
    
    console.log('Configuration updated and routes reloaded');
  }

  /**
   * Setup Express middleware
   * @private
   */
  private setupMiddleware(): void {
    // Enable CORS if configured
    if (this.config.server.cors) {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }

    // Parse JSON bodies
    this.app.use(express.json());
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Setup API routes based on configuration
   * @private
   */
  private setupRoutes(): void {
    // Register all API endpoints
    this.config.apis.forEach(api => {
      this.routeManager.registerRoute(this.app, api);
    });

    // 404 handler for undefined routes
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
      });
    });

    // Error handler
    this.app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Server error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Clear all registered routes
   * @private
   */
  private clearRoutes(): void {
    // Remove all routes except middleware
    this.app._router = undefined;
    
    // Re-setup middleware
    this.setupMiddleware();
  }
}