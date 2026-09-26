import { validarConfiguracion, config } from './config.js';
import { conectar, sequelize } from './db/sequelize.js';
import { Curso } from './models/Curso.js';
import { SequelizeCursosRepository } from './repositories/SequelizeCursosRepository.js';
import { crearApp } from './app.js';

async function iniciar() {
  validarConfiguracion();

  await conectar();

  await sequelize.sync({ alter: true });

  const repo = new SequelizeCursosRepository(Curso);
  const app = crearApp({ repo });

  app.listen(config.puerto, () => {
    console.log(`Servidor en http://localhost:${config.puerto}`);
  });
}

iniciar().catch((error) => {
  console.error('No se pudo iniciar la aplicación:', error.message);
  process.exit(1);
});
