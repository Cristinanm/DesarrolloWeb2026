# Curso - Express + PostgreSQL + Sequelize

Ejercicio basado en la Sesión 7.

## Requisitos que cumple

- Modelo `Curso`
  - `nombre`
  - `codigo` único
  - `creditos`
- Repositorio Sequelize.
- `GET /cursos`.
- `POST /cursos`.
- Validación con `express-validator`.
- `POST /cursos` protegido con `authJWT`.
- Manejo centralizado de errores.
- Pruebas unitarias e integración.

## 1. Instalar dependencias

```bash
npm install
```

## 2. Crear el archivo `.env`

Copia `.env.example` y renómbralo a `.env`.

Ejemplo:

```env
DATABASE_URL=postgres://postgres:secreto@localhost:5432/web
JWT_SECRET=secreto-de-desarrollo
PORT=3000
```

## 3. Crear PostgreSQL con Docker (opcional)

```bash
docker run --name pg-web \
  -e POSTGRES_PASSWORD=secreto \
  -e POSTGRES_DB=web \
  -p 5432:5432 \
  -d postgres:16
```

## 4. Ejecutar

```bash
npm start
```

La aplicación crea/ajusta la tabla `cursos` en desarrollo usando Sequelize.

## 5. Obtener un token para probar POST

```bash
npm run token
```

Copia el token mostrado.

## 6. GET /cursos

```http
GET http://localhost:3000/cursos
```

No necesita token.

## 7. POST /cursos

```http
POST http://localhost:3000/cursos
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "nombre": "Desarrollo Web",
  "codigo": "DW101",
  "creditos": 5
}
```

## 8. Ejecutar pruebas

```bash
npm test
```
