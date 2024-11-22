import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { pool } from '../db';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register user
  fastify.post('/register', async (request, reply) => {
    const { email, password } = userSchema.parse(request.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [result] = await pool.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
      reply.code(201).send({ message: 'User registered successfully' });
    } catch (error) {
      reply.code(500).send({ error: 'Error registering user' });
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = userSchema.parse(request.body);

    try {
      const [rows]: any = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign({ id: user.id, email: user.email });
      reply.send({ token });
    } catch (error) {
      reply.code(500).send({ error: 'Error during login' });
    }
  });

  // Get current user
  fastify.get('/me', async (request, reply) => {
    try {
      const user = request.user;
      reply.send(user);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching user data' });
    }
  });
}