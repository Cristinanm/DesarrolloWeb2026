import { Router } from 'express';
import { authJWT } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/errores.js';
import {
  validarCurso,
  revisarErrores,
} from '../validators/cursoValidator.js';

export function cursosRoutes(repo) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const cursos = await repo.listar();
      res.json(cursos);
    })
  );

  router.post(
    '/',
    authJWT,
    validarCurso,
    revisarErrores,
    asyncHandler(async (req, res) => {
      const curso = await repo.crear(req.body);
      res.status(201).json(curso);
    })
  );

  return router;
}
