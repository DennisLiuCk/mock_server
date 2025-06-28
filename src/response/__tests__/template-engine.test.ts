import { TemplateEngine } from '../template-engine';

describe('TemplateEngine', () => {
  let templateEngine: TemplateEngine;

  beforeEach(() => {
    templateEngine = new TemplateEngine();
  });

  describe('processTemplate', () => {
    it('should replace path parameters', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        id: '{{params.id}}',
        name: 'User {{params.id}}'
      };

      const context = {
        params: { id: '123' },
        query: {},
        body: {},
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(result).toEqual({
        id: '123',
        name: 'User 123'
      });
    });

    it('should replace query parameters', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        search: '{{query.q}}',
        limit: '{{query.limit}}'
      };

      const context = {
        params: {},
        query: { q: 'test', limit: '10' },
        body: {},
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(result).toEqual({
        search: 'test',
        limit: '10'
      });
    });

    it('should replace request body fields', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        message: 'Hello {{body.name}}',
        email: '{{body.email}}'
      };

      const context = {
        params: {},
        query: {},
        body: { name: 'John', email: 'john@example.com' },
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(result).toEqual({
        message: 'Hello John',
        email: 'john@example.com'
      });
    });

    it('should handle nested object access', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        userName: '{{body.user.name}}',
        userAge: '{{body.user.age}}'
      };

      const context = {
        params: {},
        query: {},
        body: { 
          user: { 
            name: 'Jane', 
            age: 25 
          } 
        },
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(result).toEqual({
        userName: 'Jane',
        userAge: 25
      });
    });

    it('should generate random numbers', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        id: '{{random.number}}',
        code: 'CODE-{{random.number}}'
      };

      const context = {
        params: {},
        query: {},
        body: {},
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(typeof result.id).toBe('number');
      expect(result.id).toBeGreaterThan(0);
      expect(result.code).toMatch(/^CODE-\d+$/);
    });

    it('should generate current timestamp', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        created_at: '{{now}}',
        message: 'Created at {{now}}'
      };

      const context = {
        params: {},
        query: {},
        body: {},
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(typeof result.created_at).toBe('string');
      expect(new Date(result.created_at as string)).toBeInstanceOf(Date);
      expect(result.message).toMatch(/^Created at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should handle arrays with templates', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = [
        {
          id: '{{params.id}}',
          name: 'Item {{params.id}}'
        },
        {
          id: '{{random.number}}',
          name: 'Random Item'
        }
      ];

      const context = {
        params: { id: '456' },
        query: {},
        body: {},
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual({
        id: '456',
        name: 'Item 456'
      });
      expect(typeof result[1].id).toBe('number');
    });

    it('should handle missing template variables gracefully', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        existing: '{{params.id}}',
        missing: '{{params.nonexistent}}',
        nested: '{{body.user.missing}}'
      };

      const context = {
        params: { id: '123' },
        query: {},
        body: {},
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(result).toEqual({
        existing: '123',
        missing: '{{params.nonexistent}}', // Should remain unchanged
        nested: '{{body.user.missing}}'     // Should remain unchanged
      });
    });

    it('should handle non-string values in templates', () => {
      // 🔴 RED: This test will fail because TemplateEngine doesn't exist yet
      const template = {
        number: 42,
        boolean: true,
        null_value: null,
        template_string: '{{params.id}}'
      };

      const context = {
        params: { id: '789' },
        query: {},
        body: {},
        headers: {}
      };

      const result = templateEngine.processTemplate(template, context);

      expect(result).toEqual({
        number: 42,
        boolean: true,
        null_value: null,
        template_string: '789'
      });
    });
  });
});