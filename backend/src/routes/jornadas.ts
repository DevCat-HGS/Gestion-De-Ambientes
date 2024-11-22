import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../db';

const jornadaSchema = z.object({
  fecha: z.string(),
  horario: z.string(),
  id_ambiente: z.number(),
  id_instructor: z.number(),
  ficha_programa: z.string(),
});

const chequeoSchema = z.object({
  id_dispositivo: z.number(),
  estado_inicial: z.enum(['Funcional', 'En Reparación', 'Dañado']),
  estado_final: z.enum(['Funcional', 'En Reparación', 'Dañado']).optional(),
  observaciones: z.string().optional(),
});

export async function jornadasRoutes(fastify: FastifyInstance) {
  // Get all jornadas
  fastify.get('/', async (request, reply) => {
    try {
      const [rows] = await pool.query(`
        SELECT j.*, a.nombre as ambiente_nombre, i.nombre as instructor_nombre
        FROM Jornadas j
        JOIN Ambientes a ON j.id_ambiente = a.id_ambiente
        JOIN Instructores i ON j.id_instructor = i.id_instructor
      `);
      reply.send(rows);
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching jornadas' });
    }
  });

  // Create jornada
  fastify.post('/', async (request, reply) => {
    const jornadaData = jornadaSchema.parse(request.body);
    try {
      const [result] = await pool.execute(
        `INSERT INTO Jornadas 
         (fecha, horario, id_ambiente, id_instructor, ficha_programa) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          jornadaData.fecha,
          jornadaData.horario,
          jornadaData.id_ambiente,
          jornadaData.id_instructor,
          jornadaData.ficha_programa,
        ]
      );
      reply.code(201).send({ id: result.insertId, ...jornadaData });
    } catch (error) {
      reply.code(500).send({ error: 'Error creating jornada' });
    }
  });

  // Register chequeo inicial
  fastify.post('/:id/chequeo-inicial', async (request, reply) => {
    const { id } = request.params as { id: string };
    const chequeos = z.array(chequeoSchema).parse(request.body);
    
    try {
      for (const chequeo of chequeos) {
        await pool.execute(
          `INSERT INTO Chequeos 
           (id_jornada, id_dispositivo, estado_inicial, observaciones) 
           VALUES (?, ?, ?, ?)`,
          [id, chequeo.id_dispositivo, chequeo.estado_inicial, chequeo.observaciones || '']
        );
      }
      reply.code(201).send({ message: 'Chequeo inicial registered successfully' });
    } catch (error) {
      reply.code(500).send({ error: 'Error registering chequeo inicial' });
    }
  });

  // Register chequeo final
  fastify.put('/:id/chequeo-final', async (request, reply) => {
    const { id } = request.params as { id: string };
    const chequeos = z.array(chequeoSchema).parse(request.body);
    
    try {
      for (const chequeo of chequeos) {
        await pool.execute(
          `UPDATE Chequeos 
           SET estado_final = ?, observaciones = ?
           WHERE id_jornada = ? AND id_dispositivo = ?`,
          [chequeo.estado_final, chequeo.observaciones, id, chequeo.id_dispositivo]
        );
      }
      reply.send({ message: 'Chequeo final registered successfully' });
    } catch (error) {
      reply.code(500).send({ error: 'Error registering chequeo final' });
    }
  });

  // Get jornada details with chequeos
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const [jornada]: any = await pool.query(
        `SELECT j.*, a.nombre as ambiente_nombre, i.nombre as instructor_nombre
         FROM Jornadas j
         JOIN Ambientes a ON j.id_ambiente = a.id_ambiente
         JOIN Instructores i ON j.id_instructor = i.id_instructor
         WHERE j.id_jornada = ?`,
        [id]
      );

      const [chequeos] = await pool.query(
        `SELECT c.*, d.nombre as dispositivo_nombre
         FROM Chequeos c
         JOIN Dispositivos d ON c.id_dispositivo = d.id_dispositivo
         WHERE c.id_jornada = ?`,
        [id]
      );

      reply.send({ ...jornada[0], chequeos });
    } catch (error) {
      reply.code(500).send({ error: 'Error fetching jornada details' });
    }
  });
}