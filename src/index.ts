import { MockServer } from './server/mock-server';
import { ConfigLoader } from './config/config-loader';
import * as path from 'path';

/**
 * Main entry point for the Mock API Server
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 Starting Mock API Server...');

    // Load configuration
    const configLoader = new ConfigLoader();
    const configPath = process.argv[2] || path.join(__dirname, '../examples/basic-config.yaml');
    
    console.log(`📋 Loading configuration from: ${configPath}`);
    const config = await configLoader.loadFromFile(configPath);

    // Create and start server
    const server = new MockServer(config);
    await server.start();

    console.log('✅ Mock API Server started successfully!');
    console.log(`📡 Server running on http://${config.server.host}:${config.server.port}`);
    console.log(`📚 Serving ${config.apis.length} API endpoint(s)`);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down Mock API Server...');
      await server.stop();
      console.log('👋 Server stopped. Goodbye!');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start Mock API Server:', (error as Error).message);
    process.exit(1);
  }
}

// Run the server if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { MockServer, ConfigLoader };
export * from './types/config';