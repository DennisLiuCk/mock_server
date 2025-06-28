/**
 * Context object containing request data for template processing
 */
export interface TemplateContext {
  params: Record<string, string>;
  query: Record<string, any>;
  body: any;
  headers: Record<string, any>;
}

/**
 * TemplateEngine processes template strings and replaces placeholders
 * with actual values from the request context
 */
export class TemplateEngine {
  private readonly templateRegex = /\{\{([^}]+)\}\}/g;

  /**
   * Process a template object and replace all template strings
   * @param template Template object or value
   * @param context Request context containing data for replacement
   * @returns Processed template with replaced values
   */
  processTemplate(template: any, context: TemplateContext): any {
    if (template === null || template === undefined) {
      return template;
    }

    if (typeof template === 'string') {
      return this.processTemplateString(template, context);
    }

    if (Array.isArray(template)) {
      return template.map(item => this.processTemplate(item, context));
    }

    if (typeof template === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(template)) {
        result[key] = this.processTemplate(value, context);
      }
      return result;
    }

    // For primitive types (number, boolean), return as-is
    return template;
  }

  /**
   * Process a template string and replace placeholders
   * @private
   */
  private processTemplateString(template: string, context: TemplateContext): any {
    // If the entire string is a single template, return the actual value type
    const singleTemplateMatch = template.match(/^\{\{([^}]+)\}\}$/);
    if (singleTemplateMatch) {
      const value = this.resolveTemplateVariable(singleTemplateMatch[1].trim(), context);
      return value !== undefined ? value : template;
    }

    // Replace all templates in the string
    return template.replace(this.templateRegex, (match, variable) => {
      const value = this.resolveTemplateVariable(variable.trim(), context);
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Resolve a template variable to its actual value
   * @private
   */
  private resolveTemplateVariable(variable: string, context: TemplateContext): any {
    // Handle special functions
    if (variable === 'now') {
      return new Date().toISOString();
    }

    if (variable === 'random.number') {
      return Math.floor(Math.random() * 1000000) + 1;
    }

    // Handle object path resolution (e.g., "params.id", "body.user.name")
    const parts = variable.split('.');
    let current: any = context;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined; // Path not found
      }
    }

    return current;
  }
}