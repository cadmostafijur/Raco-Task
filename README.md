# Full-Stack Marketplace Project Workflow System

A production-ready marketplace system for project assignment, task management, and submission lifecycle. Buyers create projects, Problem Solvers request to work, and the system manages the full workflow from assignment to completion.

---

## 1. System Overview

This application connects **Buyers** (project owners) with **Problem Solvers** (contractors) to manage project delivery. Buyers create projects, Solvers request to work, and once assigned, Solvers create sub-modules/tasks and submit ZIP files. Buyers review submissions, accept or reject with feedback, and Solvers can re-upload until accepted.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, Axios, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, Multer, JWT |
| **Database** | PostgreSQL (Neon, Supabase, or local) |

---

## 3. System Understanding & Flow Decomposition

### Role Hierarchy

| Role | Description |
|------|-------------|
| **ADMIN** | Assigns roles, verifies users, full system visibility. Can view Buyer and Solver dashboards. |
| **BUYER** | Creates projects, assigns solvers, downloads submissions, reviews with comments. |
| **PROBLEM_SOLVER** | Requests work, creates tasks (title, description, deadline), uploads ZIPs, re-uploads on rejection. |

### Project Lifecycle

```
OPEN ──(solver requests)──► REQUESTED ──(buyer assigns)──► ASSIGNED
                                                                    │
                                                                    ▼
COMPLETED ◄──(accept all)── SUBMITTED ◄──(all tasks done)── IN_PROGRESS
     ▲                              │
     │                              └──(reject)──► REJECTED ──(resubmit)──► IN_PROGRESS
     └──────────────────────────────────────────────────────────────────────────────┘
```

### State Transitions

| Entity | Current | Next | Trigger |
|--------|---------|------|---------|
| Project | OPEN | REQUESTED | Solver creates request |
| Project | REQUESTED | ASSIGNED | Buyer assigns solver |
| Project | ASSIGNED | IN_PROGRESS | Solver creates first task |
| Project | IN_PROGRESS | SUBMITTED | All tasks submitted |
| Project | SUBMITTED | COMPLETED | Buyer accepts all |
| Project | SUBMITTED | REJECTED | Buyer rejects any |
| Project | REJECTED | IN_PROGRESS | Solver resubmits |
| Task | CREATED | IN_PROGRESS | Solver starts work |
| Task | IN_PROGRESS | SUBMITTED | Solver uploads ZIP |
| Task | SUBMITTED | COMPLETED | Buyer accepts |
| Task | SUBMITTED | IN_PROGRESS | Buyer rejects |

### Written Flow (End-to-End)

1. **Admin** seeds system, assigns roles, verifies solvers.
2. **Buyer** creates project (OPEN).
3. **Solver** browses open projects → requests to work.
4. **Buyer** sees notification → views requester profile (verified, work history) → assigns one solver.
5. **Solver** creates tasks (title, description, deadline) → uploads ZIP per task.
6. **Buyer** gets notification → downloads ZIP → accepts or rejects with comment.
7. If rejected: **Solver** sees feedback → re-uploads → cycle repeats.
8. When all accepted: Project → COMPLETED.

Detailed diagrams: [docs/SYSTEM_FLOW.md](docs/SYSTEM_FLOW.md)

---

## 4. Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL (or Neon/Supabase connection string)
- npm

### One Command (Backend + Frontend)

```bash
npm run dev
```

Runs both backend and frontend. **Alternative:** Double-click `start.bat` to open backend and frontend in separate windows.

### First-Time Setup

1. **Root:** `npm install`
2. **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env: DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
   npm run db:push
   npm run db:seed
   ```
3. **Frontend:**
   ```bash
   cd frontend
   cp .env.example .env.local
   # Add: NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

### Local URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Default Admin | `admin@marketplace.com` / `Admin123!` |

---

## API Route Summary

Base URL: `http://localhost:4000/api`  
All protected routes require: `Authorization: Bearer <accessToken>`

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login |
| POST | /auth/refresh | Refresh access token |
| GET | /auth/me | Current user (authenticated) |
| PUT | /auth/profile | Update profile (authenticated) |

### Users (Admin)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /users | List all users |
| GET | /users/:id | Get user by ID |
| PUT | /users/:id/role | Update user role |
| PUT | /users/:id/verify | Set user verified status |

### Projects
| Method | Route | Description |
|--------|-------|-------------|
| POST | /projects | Create project (Buyer) |
| GET | /projects | List projects |
| GET | /projects/:id | Get project by ID |
| PUT | /projects/:id/assign | Assign solver (Buyer) |
| POST | /projects/:id/requests | Request to work (Solver) |
| GET | /projects/:id/requests | List project requests |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET | /projects/:id/tasks | List tasks |
| POST | /projects/:id/tasks | Create task (Solver) |
| PATCH | /projects/:id/tasks/:taskId | Update task (Solver) |

### Submissions
| Method | Route | Description |
|--------|-------|-------------|
| GET | /projects/:id/tasks/:taskId/submissions | List submissions |
| POST | /projects/:id/tasks/:taskId/submissions | Upload ZIP (Solver) |
| GET | /projects/:id/tasks/:taskId/submissions/:id/download | Download ZIP |
| PUT | /projects/:id/tasks/:taskId/submissions/:id/review | Accept/Reject (Buyer) |

### Notifications
| Method | Route | Description |
|--------|-------|-------------|
| GET | /notifications | Get notifications |
| POST | /notifications/seen | Mark as seen |

### Requests
| Method | Route | Description |
|--------|-------|-------------|
| GET | /requests/my | My requests (Solver) |

---

## Key Architectural Decisions

1. **Role-based access control (RBAC)** – Middleware validates JWT and role before each action.
2. **State machine enforcement** – Backend enforces valid project/task state transitions.
3. **ZIP-only uploads** – Multer validates MIME type and extension; 10MB limit.
4. **Notification model** – Task submissions create notifications for buyers.
5. **User verification** – Admins can verify solvers; buyers see verified status in requester list.
6. **Feedback on rejection** – Buyers can add comments; solvers see feedback when re-uploading.

---

## Project Structure

```
├── .gitignore        # Ignores node_modules, .env, build outputs, uploads, etc.
├── backend/          # Express API
│   ├── prisma/       # Schema, seed
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── validators/
│   └── uploads/      # ZIP file storage
├── frontend/         # Next.js 14 app
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
└── docs/             # Documentation files
    ├── SYSTEM_FLOW.md
    ├── ARCHITECTURE.md
    ├── API_CONTRACTS.md
    ├── DEPLOYMENT.md
    └── DEMO_CREDENTIALS.md
```

---

## Documentation (docs/)

| File | Description |
|------|-------------|
| [docs/SYSTEM_FLOW.md](docs/SYSTEM_FLOW.md) | Role hierarchy, lifecycle, state transitions, written flow |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Security model, data relationships, route protection |
| [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) | API request/response formats |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide |
| [docs/DEMO_CREDENTIALS.md](docs/DEMO_CREDENTIALS.md) | Demo accounts and usage |

---

## GitHub Repository

**Public repository:** [Add your GitHub repository link here]

---

## Live Deployment

**Frontend and backend deployed for stable, smooth user experience.**

| Service | URL |
|---------|-----|
| Live Frontend | [Add your deployed frontend URL] |
| Live Backend API | [Add your deployed backend URL] |

### Deployment Steps

1. **Database:** Create PostgreSQL instance (Neon, Supabase, or managed).
2. **Backend:** Deploy to Render, Railway, Fly.io. Set `DATABASE_URL`, JWT secrets, `NODE_ENV=production`.
3. **Frontend:** Deploy to Vercel. Set `NEXT_PUBLIC_API_URL` to your backend URL.
4. **CORS:** Ensure backend allows your frontend origin.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed steps.

---

## License

MIT
