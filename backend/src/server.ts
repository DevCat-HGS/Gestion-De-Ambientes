import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from 'dotenv';

import { ambientesRoutes } from './routes/ambientes';
import { dispositivosRoutes } from './routes/dispositivos';
import { instructoresRoutes } from './routes/instructores';
import { jornadasRoutes } from './routes/jornadas';
import { authRoutes } from './routes/auth';

config();

const fastify = Fastify({
  logger: true,
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

// Swagger documentation
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Ambiente Manager API',
      description: 'API documentation for Ambiente Manager',
      version: '1.0.0',
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

await fastify.register(swaggerUi, {
  routePrefix: '/documentation',
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(ambientesRoutes, { prefix: '/api/ambientes' });
fastify.register(dispositivosRoutes, { prefix: '/api/dispositivos' });
fastify.register(instructoresRoutes, { prefix: '/api/instructores' });
fastify.register(jornadasRoutes, { prefix: '/api/jornadas' });

// Start server
try {
  await fastify.listen({ port: 3000 });
  console.log('Server is running on http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}