# Gemini Project Analysis: Mock API Server

## 1. Project Overview

This is a lightweight, configurable Mock API server designed for development and testing. It is built with Node.js and TypeScript, using Express.js as the web server framework. The project follows a Test-Driven Development (TDD) approach.

The server's primary function is to create mock API endpoints based on definitions in a configuration file (YAML or JSON). It allows developers to simulate API responses, including dynamic content, without needing a live backend.

## 2. Technology Stack

-   **Language:** TypeScript
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Testing:** Jest, Supertest
-   **Linting/Formatting:** ESLint, Prettier
-   **Configuration:** YAML, JSON
-   **Dev Dependencies:** `ts-node`, `typescript`

## 3. Project Structure

```
src/
├── config/                 # Configuration loading and validation
│   ├── config-loader.ts    # Loads and parses YAML/JSON config files
│   └── config-validator.ts # Validates the structure of the config object
├── response/               # Response generation
│   └── template-engine.ts  # Processes dynamic templates in responses
├── server/                 # Core Express server logic
│   ├── mock-server.ts      # Main server class, manages lifecycle and middleware
│   └── route-manager.ts    # Registers API routes based on the config
├── types/                  # TypeScript type definitions
│   └── config.ts           # Defines types for the configuration structure
└── index.ts                # Application entry point
```

## 4. Core Logic

1.  **Initialization (`src/index.ts`):** The application starts, and the `ConfigLoader` is used to load a configuration file (e.g., `config.yaml`).
2.  **Configuration Loading (`src/config/config-loader.ts`):** It reads the specified file (YAML or JSON), parses it, and validates it against the schema defined in `src/types/config.ts` using `ConfigValidator`.
3.  **Server Instantiation (`src/server/mock-server.ts`):** A `MockServer` instance is created with the loaded configuration. It sets up an Express application, including middleware for CORS, JSON parsing, and logging.
4.  **Route Registration (`src/server/route-manager.ts`):** The `RouteManager` iterates through the `apis` array in the configuration and registers each endpoint with the Express app. It handles different HTTP methods and path parameters.
5.  **Request Handling:** When a request matches a registered route, the server generates a response.
6.  **Dynamic Response Generation (`src/response/template-engine.ts`):** If the response body in the configuration contains template variables (e.g., `{{params.id}}`), the `TemplateEngine` replaces them with actual values from the request (path parameters, query parameters, request body).
7.  **Server Start:** The Express server starts listening on the configured port and host.

## 5. Key Files

-   **`package.json`**: Defines project metadata, dependencies, and npm scripts.
-   **`src/index.ts`**: The main entry point. Responsible for orchestrating the server startup process.
-   **`src/server/mock-server.ts`**: The core server class. Manages the Express app, lifecycle (start/stop), middleware, and route reloading.
-   **`src/config/config-loader.ts`**: Handles all logic for reading, parsing, and validating configuration files.
-   **`src/types/config.ts`**: Crucial for type safety. Defines the interfaces for `MockConfig`, `ApiEndpoint`, `ServerConfig`, etc.
-   **`jest.config.js`**: Configuration for the Jest testing framework.

## 6. Available NPM Scripts

-   **`npm run build`**: Compiles TypeScript code into JavaScript in the `dist/` directory.
-   **`npm start`**: Runs the compiled server from the `dist/` directory.
-   **`npm run dev`**: Runs the server in development mode using `ts-node` for live reloading. Accepts a config file path as an argument.
-   **`npm test`**: Executes all unit and integration tests using Jest.
-   **`npm run lint`**: Lints the TypeScript source files using ESLint.
-   **`npm run format`**: Formats the code using Prettier.
