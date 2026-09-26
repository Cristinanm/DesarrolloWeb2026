import 'dotenv/config';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error('Falta JWT_SECRET en el archivo .env');
  process.exit(1);
}

const token = jwt.sign(
  {
    sub: 'usuario-demo',
    rol: 'admin',
  },
  secret,
  {
    expiresIn: '1h',
  }
);

console.log('\nToken JWT para pruebas:\n');
console.log(token);
console.log('\nÚsalo así: Authorization: Bearer <token>\n');
