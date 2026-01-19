import app from './app';
import { config } from './config/environment';
import prisma from './config/database';

const PORT = config.port;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API Base URL: ${config.apiBaseUrl}`);
      console.log(`🌐 CORS Origin: ${config.cors.origin}`);
      console.log(`\n📚 API Documentation:`);
      console.log(`   - Health: GET ${config.apiBaseUrl}/api/health`);
      console.log(`   - Auth: POST ${config.apiBaseUrl}/api/auth/register`);
      console.log(`   - Auth: POST ${config.apiBaseUrl}/api/auth/login`);
      console.log(`   - Stories: GET ${config.apiBaseUrl}/api/stories`);
      console.log(`   - AI Generate: POST ${config.apiBaseUrl}/api/ai/generate`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
