import 'dotenv/config';

export const config = {
  puerto: process.env.PORT ?? 3000,
  db: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

export function validarConfiguracion() {
  if (!config.db) {
    throw new Error('Falta DATABASE_URL');
  }

  if (!config.jwtSecret) {
    throw new Error('Falta JWT_SECRET');
  }
}
