export const asyncHandler = (fn) =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function manejadorErrores(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      errores: err.errors.map((error) => error.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Ese código ya existe',
    });
  }

  return res.status(500).json({
    error: 'Error interno',
  });
}
