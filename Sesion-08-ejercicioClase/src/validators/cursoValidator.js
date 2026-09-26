import { body, validationResult } from 'express-validator';

export const validarCurso = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  body('codigo')
    .trim()
    .notEmpty()
    .withMessage('El código es obligatorio'),

  body('creditos')
    .notEmpty()
    .withMessage('Los créditos son obligatorios')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Los créditos deben ser un número entero mayor a 0')
    .toInt(),
];

export function revisarErrores(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      errores: errores.array(),
    });
  }

  next();
}
