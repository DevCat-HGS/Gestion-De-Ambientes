import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../db';

const ambienteSchema = z.object({
  nombre: z.string(),
  ubicacion: z.string(),
});

export async function ambientesRoutes(fastify: FastifyInstance) {
  // Get all ambientes
  fastify.get('/', async (request, reply) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Ambientes');
      reply.send(rows);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching ambientes' });
    }
  });

  // Get single ambiente
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM Ambientes WHERE id_ambiente = ?',
        [id]
      );
      if (rows.length === 0) {
        return reply.code(404).send({ error: 'Ambiente not found' });
      }
      reply.send(rows[0]);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching ambiente' });
    }
  });

  // Create ambiente
  fastify.post('/', async (request, reply) => {
    const { nombre, ubicacion } = ambienteSchema.parse(request.body);
    try {
      const [result] = await pool.execute(
        'INSERT INTO Ambientes (nombre, ubicacion) VALUES (?, ?)',
        [nombre, ubicacion]
      );
      reply.code(201).send({ id: result.insertId, nombre, ubicacion });
    } catch (error) {
      reply.code(500).send({ error: 'Error creating ambiente' });
    }
  });

  // Update ambiente
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nombre, ubicacion } = ambienteSchema.parse(request.body);
    try {
      await pool.execute(
        'UPDATE Ambientes SET nombre = ?, ubicacion = ? WHERE id_ambiente = ?',
        [nombre, ubicacion, id]
      );
      reply.send({ id, nombre, ubicacion });
    } catch (error) {
      reply.code(500).send({ error: 'Error updating ambiente' });
    }
  });

  // Delete ambiente
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await pool.execute('DELETE FROM Ambientes WHERE id_ambiente = ?', [id]);
      reply.send({ message: 'Ambiente deleted successfully' });
    } catch (error) {
      reply.code(500).send({ error: 'Error deleting ambiente' });
    }
  });
}