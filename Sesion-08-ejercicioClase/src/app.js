import express from 'express';
import { cursosRoutes } from './routes/cursos.routes.js';
import { manejadorErrores } from './middlewares/errores.js';

export function crearApp({ repo }) {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      mensaje: 'API de Cursos funcionando',
    });
  });

  app.use('/cursos', cursosRoutes(repo));

  app.use(manejadorErrores);

  return app;
}
