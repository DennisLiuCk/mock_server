import { Express, Request, Response } from 'express';
import { ApiEndpoint, HttpMethod } from '../types/config';
import { TemplateEngine } from '../response/template-engine';

/**
 * RouteManager handles registration and management of API routes
 * Converts API endpoint configurations into Express routes
 */
export class RouteManager {
  private templateEngine: TemplateEngine;

  constructor() {
    this.templateEngine = new TemplateEngine();
  }

  /**
   * Register an API endpoint as an Express route
   * @param app Express application instance
   * @param apiEndpoint API endpoint configuration
   */
  registerRoute(app: Express, apiEndpoint: ApiEndpoint): void {
    const { path, method } = apiEndpoint;

    // Convert Express path format (e.g., /users/:id)
    const expressPath = this.convertPathFormat(path);

    // Get the appropriate Express method
    const expressMethod = this.getExpressMethod(method);

    // Register the route
    (app as any)[expressMethod](expressPath, async (req: Request, res: Response) => {
      try {
        // Process the response
        await this.handleRequest(req, res, apiEndpoint);
      } catch (error) {
        console.error(`Error handling ${method} ${path}:`, error);
        res.status(500).json({
          error: 'Internal Server Error',
          message: (error as Error).message
        });
      }
    });

    console.log(`Registered route: ${method} ${path}`);
  }

  /**
   * Handle incoming request and generate response
   * @private
   */
  private async handleRequest(req: Request, res: Response, apiEndpoint: ApiEndpoint): Promise<void> {
    const { response } = apiEndpoint;

    // Set status code
    res.status(response.status);

    // Set custom headers
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }

    // Process response body with template engine
    let responseBody = response.body;
    if (responseBody && typeof responseBody === 'object') {
      responseBody = this.templateEngine.processTemplate(responseBody, {
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers
      });
    }

    // Handle delay if specified
    if (response.delay && response.delay > 0) {
      await this.delay(response.delay);
    }

    // Send response
    if (responseBody !== undefined) {
      res.json(responseBody);
    } else {
      res.end();
    }
  }

  /**
   * Convert path format to Express-compatible format
   * @private
   */
  private convertPathFormat(path: string): string {
    // For now, assume the path is already in Express format
    // In the future, we might need to convert from other formats
    return path;
  }

  /**
   * Get Express method name from HTTP method
   * @private
   */
  private getExpressMethod(method: HttpMethod): string {
    return method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
  }

  /**
   * Create a delay promise
   * @private
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}