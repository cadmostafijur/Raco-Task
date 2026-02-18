# Full-Stack Marketplace Project Workflow System - Architecture

## 1. Role Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROLE HIERARCHY                                     │
└─────────────────────────────────────────────────────────────────────────────┘

ADMIN (Super User)
    │
    ├── Assigns BUYER role to users
    ├── Assigns PROBLEM_SOLVER role to users
    ├── Full system visibility
    └── User management

BUYER (Project Owner)
    │
    ├── Creates projects (OPEN state)
    ├── Receives work requests from Problem Solvers
    ├── Assigns ONE Problem Solver per project
    ├── Accepts/Rejects task submissions
    └── Manages project lifecycle

PROBLEM_SOLVER (Contractor)
    │
    ├── Requests to work on OPEN projects
    ├── Creates tasks/sub-modules when assigned
    ├── Uploads ZIP per task for submission
    └── Tracks task progress
```

## 2. State Transition Diagram

### Project Lifecycle States

```
OPEN ──────────────────────────────────────────────────────────────────────┐
  │                                                                          │
  │  (Problem Solver requests)                                               │
  ▼                                                                          │
REQUESTED ──────────────────────────────────────────────────────────────────┤
  │                                                                          │
  │  (Buyer assigns ONE solver)                                              │
  ▼                                                                          │
ASSIGNED ───────────────────────────────────────────────────────────────────┤
  │                                                                          │
  │  (Solver starts work)                                                    │
  ▼                                                                          │
IN_PROGRESS ───────────────────────────────────────────────────────────────┤
  │                                                                          │
  │  (Solver submits all tasks)                                              │
  ▼                                                                          │
SUBMITTED ──────────────────────────────────────────────────────────────────┤
  │                                                                          │
  ├── (Buyer accepts) ──► COMPLETED                                          │
  │                                                                          │
  └── (Buyer rejects) ──► REJECTED ──► (Can resubmit) ──► SUBMITTED          │
```

### Task States

```
CREATED ──► IN_PROGRESS ──► SUBMITTED ──► COMPLETED
                │                │
                │                └── (Buyer rejects) ──► IN_PROGRESS
                │
                └── (Solver uploads ZIP)
```

### Valid Transitions (Backend Enforced)

| Current State | Allowed Next State | Triggered By |
|---------------|-------------------|--------------|
| OPEN | REQUESTED | Problem Solver creates request |
| REQUESTED | ASSIGNED | Buyer assigns solver |
| ASSIGNED | IN_PROGRESS | Solver creates first task |
| IN_PROGRESS | SUBMITTED | All tasks submitted |
| SUBMITTED | COMPLETED | Buyer accepts |
| SUBMITTED | REJECTED | Buyer rejects |
| REJECTED | SUBMITTED | Solver resubmits |

## 3. Data Relationships

```
User (1) ──────────────── (*) Project (as Buyer)
  │                              │
  │                              ├── (*) ProjectRequest (from Solvers)
  │                              │
  │                              └── (*) Task
  │                                       │
  │                                       └── (*) TaskSubmission
  │
  └── (*) ProjectRequest (as Solver)
  └── (*) Project (as Assigned Solver - one per project)
```

### Entity Relationships

- **User**: Has one role (ADMIN, BUYER, PROBLEM_SOLVER)
- **Project**: Belongs to one Buyer, optionally one assigned Solver
- **ProjectRequest**: Links User (Solver) to Project, status tracked
- **Task**: Belongs to one Project, has many TaskSubmissions
- **TaskSubmission**: Belongs to one Task, stores ZIP path and status

## 4. Security Model

### Authentication
- JWT tokens (access + refresh)
- HTTP-only cookies for refresh token (optional)
- Token expiry: Access 15min, Refresh 7 days

### Authorization (RBAC)
- Middleware validates JWT on protected routes
- Role extracted from token payload
- Endpoint-level role checks before business logic

### Route Protection Matrix

| Endpoint | ADMIN | BUYER | PROBLEM_SOLVER |
|----------|-------|-------|----------------|
| POST /users/:id/role | ✓ | ✗ | ✗ |
| POST /projects | ✗ | ✓ | ✗ |
| GET /projects | ✓ | Own | All |
| POST /projects/:id/requests | ✗ | ✗ | ✓ |
| PUT /projects/:id/assign | ✗ | ✓ | ✗ |
| POST /tasks | ✗ | ✗ | Assigned only |
| POST /tasks/:id/submit | ✗ | ✗ | Assigned only |
| PUT /submissions/:id/review | ✗ | ✓ | ✗ |

### File Upload Security
- Multer configured for ZIP only
- MIME type validation: application/zip
- Extension validation: .zip
- File size limit: 10MB
- Sanitized filenames (UUID + .zip)
