import { randomUUID } from 'node:crypto';
import { ICursosRepository } from './ICursosRepository.js';

export class MockCursosRepository extends ICursosRepository {
  constructor(cursos = []) {
    super();
    this.cursos = [...cursos];
  }

  async listar() {
    return [...this.cursos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }

  async crear(datos) {
    const repetido = this.cursos.some(
      (curso) => curso.codigo.toLowerCase() === datos.codigo.toLowerCase()
    );

    if (repetido) {
      const error = new Error('Ese código ya existe');
      error.name = 'SequelizeUniqueConstraintError';
      throw error;
    }

    const curso = {
      id: randomUUID(),
      ...datos,
    };

    this.cursos.push(curso);
    return curso;
  }
}
