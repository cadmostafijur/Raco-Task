# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

## 1. PostgreSQL Setup

### Local Development

```bash
# Create database
createdb marketplace_workflow

# Or using psql
psql -U postgres -c "CREATE DATABASE marketplace_workflow;"
```

### Production (e.g., Render, Supabase, Neon)

1. Create a PostgreSQL instance
2. Copy the connection string (format: `postgresql://user:password@host:5432/database?sslmode=require`)

---

## 2. Backend Setup

### Environment Variables

Create `backend/.env` from `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace_workflow?schema=public"
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
PORT=4000
NODE_ENV=production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

### Install & Run

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate:prod
npm run db:seed
npm run build
npm start
```

### Prisma Migration Commands

```bash
# Generate Prisma client
npm run db:generate

# Create migration (development)
npm run db:migrate

# Apply migrations (production)
npm run db:migrate:prod

# Push schema without migration (dev only)
npm run db:push

# Seed admin user
npm run db:seed
```

---

## 3. Render Backend Deployment

1. Create new **Web Service**
2. Connect your repository
3. Build settings:
   - **Build Command:** `cd backend && npm install && npm run db:generate && npm run build`
   - **Start Command:** `cd backend && npm run db:migrate:prod && npm start`
   - **Root Directory:** (leave empty or set to repo root)

4. Environment variables: Add all from `backend/.env.example` plus production values

5. Add **PostgreSQL** add-on or use external DB URL

6. Ensure `uploads` directory is writable (Render uses ephemeral filesystem; consider S3 for production file storage)

---

## 4. Frontend Setup

### Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

For local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Install & Run

```bash
cd frontend
npm install
npm run build
npm start
```

---

## 5. Vercel Frontend Deployment

1. Import project from Git
2. Set **Root Directory** to `frontend` (if monorepo)
3. Framework: Next.js (auto-detected)
4. Environment variable: `NEXT_PUBLIC_API_URL` = your backend URL
5. Deploy

---

## 6. Production Security Notes

### Backend

1. **JWT Secrets:** Use cryptographically random 32+ character strings
2. **CORS:** Restrict `origin` to your frontend domain(s)
3. **Rate Limiting:** Add express-rate-limit for auth endpoints
4. **File Uploads:** Consider S3/cloud storage instead of local disk for scalability
5. **HTTPS:** Always use HTTPS in production

### Frontend

1. **Tokens:** Consider httpOnly cookies for refresh tokens (requires backend changes)
2. **API URL:** Never expose internal URLs; use public backend URL only

### Database

1. **Connection Pooling:** Use PgBouncer or Prisma connection pooling for high traffic
2. **Backups:** Enable automated backups on your PostgreSQL provider
3. **SSL:** Use `?sslmode=require` in DATABASE_URL for cloud databases

---

## 7. Quick Start (Local)

```bash
# Terminal 1 - Backend
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev

# Terminal 2 - Frontend
cd frontend
cp .env.example .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" >> .env.local
npm install
npm run dev
```

- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- Default admin: admin@marketplace.com / Admin123! (or from ADMIN_EMAIL/ADMIN_PASSWORD)
