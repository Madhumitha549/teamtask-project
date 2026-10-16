 TeamTask

Multi-user task management SaaS (Capstone - Full-Stack SaaS).
 Run backend
1. `cd server`
2. `cp .env.example .env` and fill in `DATABASE_URL` (Neon or local Postgres) and `JWT_SECRET`
3. `npm install`
4. `npm run dev`

Check: http://localhost:5000/api/health
 API
- POST `/api/auth/register`  `{ name, email, password }`
- POST `/api/auth/login`     `{ email, password }`
- GET  `/api/auth/me`        (header `Authorization: Bearer <token>`)
  
