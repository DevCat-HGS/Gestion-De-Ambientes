import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../db';

const dispositivoSchema = z.object({
  nombre: z.string(),
  id_ambiente: z.number(),
  estado: z.enum(['Funcional', 'En Reparación', 'Dañado']),
  mouse: z.enum(['Sí', 'No']),
  teclado: z.enum(['Sí', 'No']),
  almohadilla: z.enum(['Sí', 'No']),
});

export async function dispositivosRoutes(fastify: FastifyInstance) {
  // Get all dispositivos
  fastify.get('/', async (request, reply) => {
    try {
      const [rows] = await pool.query(`
        SELECT d.*, a.nombre as ambiente_nombre 
        FROM Dispositivos d 
        JOIN Ambientes a ON d.id_ambiente = a.id_ambiente
      `);
      reply.send(rows);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching dispositivos' });
    }
  });

  // Get dispositivos by ambiente
  fastify.get('/ambiente/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const [rows] = await pool.query(
        'SELECT * FROM Dispositivos WHERE id_ambiente = ?',
        [id]
      );
      reply.send(rows);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching dispositivos' });
    }
  });

  // Create multiple dispositivos
  fastify.post('/batch', async (request, reply) => {
    const { id_ambiente, cantidad } = request.body as { id_ambiente: number; cantidad: number };
    try {
      const values = Array.from({ length: cantidad }, (_, i) => [
        `PC ${i + 1}`,
        id_ambiente,
        'Funcional',
        'Sí',
        'Sí',
        'Sí'
      ]);

      await pool.query(
        'INSERT INTO Dispositivos (nombre, id_ambiente, estado, mouse, teclado, almohadilla) VALUES ?',
        [values]
      );

      reply.code(201).send({ message: `${cantidad} dispositivos created successfully` });
    } catch (error) {
      reply.code(500).send({ error: 'Error creating dispositivos' });
    }
  });

  // Update dispositivo
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updateData = dispositivoSchema.parse(request.body);
    try {
      await pool.execute(
        `UPDATE Dispositivos SET 
         estado = ?, mouse = ?, teclado = ?, almohadilla = ? 
         WHERE id_dispositivo = ?`,
        [updateData.estado, updateData.mouse, updateData.teclado, updateData.almohadilla, id]
      );
      reply.send({ message: 'Dispositivo updated successfully' });
    } catch (error) {
      reply.code(500).send({ error: 'Error updating dispositivo' });
    }
  });
}