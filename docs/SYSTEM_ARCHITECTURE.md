# Full-Stack Marketplace Project Workflow System - System Architecture

## 1. Role Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ROLE HIERARCHY                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   ADMIN (Superuser)                                                             │
│   ├── Assigns BUYER role to users                                               │
│   ├── Full system access                                                        │
│   └── User management                                                           │
│                                                                                 │
│   BUYER (Project Owner)                                                         │
│   ├── Creates projects (OPEN state)                                             │
│   ├── Receives work requests from Problem Solvers                               │
│   ├── Assigns ONE Problem Solver per project                                    │
│   ├── Accepts/Rejects task submissions                                          │
│   └── Manages project lifecycle                                                 │
│                                                                                 │
│   PROBLEM_SOLVER (Contractor)                                                   │
│   ├── Requests to work on OPEN projects                                         │
│   ├── Gets assigned by Buyer (one per project)                                  │
│   ├── Creates tasks/sub-modules                                                 │
│   ├── Uploads ZIP per task                                                      │
│   └── Submits work for review                                                    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

WORKFLOW SEQUENCE:
1. Admin → assigns Buyer role to User A
2. User A (Buyer) → creates Project (state: OPEN)
3. User B (Problem Solver) → requests to work on Project
4. User A (Buyer) → assigns User B as the solver (state: ASSIGNED)
5. User B (Problem Solver) → creates tasks, uploads ZIPs
6. User A (Buyer) → accepts/rejects each submission
7. On full acceptance → Project COMPLETED
```

## 2. State Transition Diagram

### Project Lifecycle States

```
                    ┌──────────┐
                    │   OPEN   │ ◄── Buyer creates project
                    └────┬─────┘
                         │
                         │ Problem Solver requests
                         ▼
                    ┌───────────┐
                    │ REQUESTED │
                    └─────┬─────┘
                          │
                          │ Buyer assigns ONE solver
                          ▼
                    ┌───────────┐
                    │ ASSIGNED  │
                    └─────┬─────┘
                          │
                          │ Solver starts work
                          ▼
                    ┌──────────────┐
                    │ IN_PROGRESS  │
                    └──────┬───────┘
                           │
                           │ Solver submits all tasks
                           ▼
                    ┌────────────┐
                    │ SUBMITTED  │
                    └─────┬──────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
        ┌───────────┐           ┌───────────┐
        │ COMPLETED │           │ REJECTED  │
        └───────────┘           └─────┬─────┘
              │                       │
              │                       │ Solver resubmits
              │                       ▼
              │                 ┌────────────┐
              │                 │ IN_PROGRESS │
              │                 └────────────┘
              │
              └──► Final state
```

### Valid Project State Transitions (Backend Enforced)

| From       | To          | Triggered By   |
|------------|-------------|----------------|
| OPEN       | REQUESTED   | First work request |
| REQUESTED  | ASSIGNED    | Buyer assigns solver |
| ASSIGNED   | IN_PROGRESS | Solver creates first task |
| IN_PROGRESS| SUBMITTED   | All tasks submitted |
| SUBMITTED  | COMPLETED   | Buyer accepts all |
| SUBMITTED  | REJECTED    | Buyer rejects any |
| REJECTED   | IN_PROGRESS | Solver resubmits |

### Task States

```
┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌───────────┐
│ CREATED │ ──► │ IN_PROGRESS  │ ──► │ SUBMITTED │ ──► │ COMPLETED │
└─────────┘     └──────────────┘     └───────────┘     └───────────┘
     │                  │                   │
     │                  │                   └──► Buyer rejects → IN_PROGRESS
     │                  │
     │                  └── Solver uploads ZIP
     │
     └── Solver creates task
```

### Valid Task State Transitions

| From       | To          | Triggered By   |
|------------|-------------|----------------|
| CREATED    | IN_PROGRESS | Solver starts task |
| IN_PROGRESS| SUBMITTED   | Solver uploads ZIP |
| SUBMITTED  | COMPLETED   | Buyer accepts |
| SUBMITTED  | IN_PROGRESS | Buyer rejects |

## 3. Data Relationships

```
User (1) ──────────────┬────────────── (*) Project (Buyer)
    │                  │
    │                  └────────────── (*) ProjectRequest (Problem Solver)
    │
    └── Role: ADMIN | BUYER | PROBLEM_SOLVER

Project (1) ──────────┬────────────── (*) ProjectRequest
    │                 │
    │                 └────────────── (1) assignedSolver (User)
    │
    └───────────────── (*) Task

Task (1) ───────────── (*) TaskSubmission

ProjectRequest: Links Problem Solver to Project (pending/approved/rejected)
TaskSubmission: ZIP file + metadata per task
```

### Entity Relationship Summary

- **User**: id, email, password (hashed), role, name, createdAt, updatedAt
- **Project**: id, title, description, status, buyerId, assignedSolverId, createdAt, updatedAt
- **ProjectRequest**: id, projectId, solverId, status, message, createdAt, updatedAt
- **Task**: id, projectId, title, description, status, order, createdAt, updatedAt
- **TaskSubmission**: id, taskId, filePath, fileName, status, feedback, submittedAt, reviewedAt

## 4. Security Model

### Authentication
- JWT tokens (access + refresh pattern)
- HTTP-only cookies for refresh token (optional)
- Access token in Authorization header: `Bearer <token>`
- Token expiry: Access 15m, Refresh 7d

### Authorization (RBAC)
- **ADMIN**: All routes, user role assignment
- **BUYER**: Own projects, assign solver, accept/reject submissions
- **BUYER-only routes**: POST /projects, PATCH /projects/:id/assign, PATCH /submissions/:id/review
- **PROBLEM_SOLVER**: Request work, create tasks, upload submissions
- **PROBLEM_SOLVER-only routes**: POST /requests, POST /tasks, POST /submissions/upload

### Middleware Chain
1. `authenticate` - Validates JWT, attaches user to req
2. `authorize([roles])` - Checks user.role in allowed roles
3. `resourceOwnership` - Ensures user owns/can access resource (e.g., project buyer)

### File Upload Security
- Multer: ZIP only (MIME: application/zip, application/x-zip-compressed)
- Extension whitelist: .zip
- File size limit: 10MB
- Sanitized filenames
- Stored outside web root

### Input Validation
- Zod schemas on all request bodies
- Sanitization of strings
- SQL injection prevented by Prisma parameterized queries
