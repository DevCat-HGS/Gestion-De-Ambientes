import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../db';

const instructorSchema = z.object({
  nombre: z.string(),
  correo: z.string().email(),
  telefono: z.string(),
});

export async function instructoresRoutes(fastify: FastifyInstance) {
  // Get all instructores
  fastify.get('/', async (request, reply) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Instructores');
      reply.send(rows);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching instructores' });
    }
  });

  // Get single instructor
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM Instructores WHERE id_instructor = ?',
        [id]
      );
      if (rows.length === 0) {
        return reply.code(404).send({ error: 'Instructor not found' });
      }
      reply.send(rows[0]);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching instructor' });
    }
  });

  // Create instructor
  fastify.post('/', async (request, reply) => {
    const { nombre, correo, telefono } = instructorSchema.parse(request.body);
    try {
      const [result] = await pool.execute(
        'INSERT INTO Instructores (nombre, correo, telefono) VALUES (?, ?, ?)',
        [nombre, correo, telefono]
      );
      reply.code(201).send({ id: result.insertId, nombre, correo, telefono });
    } catch (error) {
      reply.code(500).send({ error: 'Error creating instructor' });
    }
  });

  // Update instructor
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nombre, correo, telefono } = instructorSchema.parse(request.body);
    try {
      await pool.execute(
        'UPDATE Instructores SET nombre = ?, correo = ?, telefono = ? WHERE id_instructor = ?',
        [nombre, correo, telefono, id]
      );
      reply.send({ id, nombre, correo, telefono });
    } catch (error) {
      reply.code(500).send({ error: 'Error updating instructor' });
    }
  });

  // Delete instructor
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await pool.execute('DELETE FROM Instructores WHERE id_instructor = ?', [id]);
      reply.send({ message: 'Instructor deleted successfully' });
    } catch (error) {
      reply.code(500).send({ error: 'Error deleting instructor' });
    }
  });
}