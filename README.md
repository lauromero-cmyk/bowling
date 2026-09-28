# BowlingPro

Aplicación para el aprendizaje del juego de bolos (Software I).

- **Backend:** Node.js + Express 5 + MongoDB (Mongoose), autenticación con JWT y contraseñas cifradas con bcrypt.
- **Frontend:** React 19 + Vite + React Router, diseño adaptable a celular.

## Cómo ejecutar

1. Backend (en la carpeta raíz):
   ```
   npm install
   npm run dev
   ```
   Necesita un archivo `.env` con `JWT_SECRET` y `MONGODB_URI` (ver `.env.example`).
   Al iniciar carga automáticamente las lecciones base si la base de datos está vacía.
2. Frontend (en `frontend/`):
   ```
   npm install
   npm run dev
   ```
   Abrir http://localhost:5173

## Pruebas

```
npm test
```
Ejecuta 31 pruebas: 13 unitarias del cálculo de puntaje (`tests/bowling.test.js`) y 18 de integración de la API (`tests/api.test.js`) con una base MongoDB temporal en memoria.

## Módulos

| Módulo | Ruta en la app | API |
| --- | --- | --- |
| Registro e inicio de sesión | /registro, /login | POST /api/register, POST /api/login, GET/PUT /api/profile |
| Lecciones y evaluaciones | /lecciones | GET /api/lessons, GET /api/lessons/:id, POST /api/lessons/:id/quiz (admin: POST/PUT/DELETE /api/lessons) |
| Partidas y estadísticas | /partidas | POST/GET /api/games, GET /api/games/stats, DELETE /api/games/:id |
| Entrenamiento | /entrenamiento, /practica/:tipo, /progreso | /api/training/... |
| Retos, insignias y ranking | /retos | GET /api/challenges, GET /api/leaderboard |
| Retroalimentación | /mensajes (jugador), /entrenador | GET/POST /api/feedback, GET /api/coach/players |
| Glosario y reglamento | /glosario | GET /api/glossary |
| Notificaciones | Inicio | GET /api/notifications |

## Crear un administrador

Los usuarios solo pueden registrarse como jugador o entrenador. Para el administrador, cambia el campo `role` a `admin` del usuario en MongoDB Atlas.
