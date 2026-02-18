# System Understanding & Flow Decomposition

## 1. Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROLE HIERARCHY                                     │
└─────────────────────────────────────────────────────────────────────────────┘

ADMIN (Super User)
    │
    ├── Assigns BUYER and PROBLEM_SOLVER roles to users
    ├── Verifies Problem Solvers (trust badge for buyers)
    ├── Full system visibility (all projects, all users)
    ├── Can view Buyer and Solver dashboards
    └── User management (roles, verification)

BUYER (Project Owner)
    │
    ├── Creates projects (OPEN state)
    ├── Receives work requests from Problem Solvers
    ├── Views requester profile (verified status, work history)
    ├── Assigns ONE Problem Solver per project
    ├── Downloads submitted ZIP files
    ├── Accepts/Rejects task submissions with comments
    └── Manages project lifecycle

PROBLEM_SOLVER (Contractor)
    │
    ├── Browses OPEN projects
    ├── Requests to work on projects
    ├── Creates tasks/sub-modules when assigned
    ├── Adds task metadata (title, description, deadline, status)
    ├── Uploads ZIP per task for submission
    ├── Re-uploads when buyer rejects (with feedback)
    └── Tracks task progress
```

## 2. Project Lifecycle

```
OPEN
  │  Problem Solver(s) request to work
  ▼
REQUESTED
  │  Buyer assigns ONE solver
  ▼
ASSIGNED
  │  Solver creates first task
  ▼
IN_PROGRESS
  │  Solver creates tasks, uploads ZIPs
  │  All tasks submitted
  ▼
SUBMITTED
  │  Buyer reviews each task
  ├── Accept all → COMPLETED
  └── Reject any → REJECTED
        │  Solver re-uploads with feedback
        ▼
      IN_PROGRESS (cycle continues)
```

## 3. State Transitions

### Project States

| Current   | Next        | Trigger                    |
|-----------|-------------|----------------------------|
| OPEN      | REQUESTED   | Solver creates request     |
| REQUESTED | ASSIGNED    | Buyer assigns solver       |
| ASSIGNED  | IN_PROGRESS | Solver creates first task |
| IN_PROGRESS | SUBMITTED | All tasks submitted        |
| SUBMITTED | COMPLETED   | Buyer accepts all          |
| SUBMITTED | REJECTED    | Buyer rejects any          |
| REJECTED  | SUBMITTED   | Solver resubmits           |

### Task States

| Current   | Next        | Trigger                    |
|-----------|-------------|----------------------------|
| CREATED   | IN_PROGRESS | Solver starts work         |
| IN_PROGRESS | SUBMITTED | Solver uploads ZIP         |
| SUBMITTED | COMPLETED   | Buyer accepts              |
| SUBMITTED | IN_PROGRESS | Buyer rejects              |

### Submission States

| Current | Next     | Trigger      |
|---------|----------|--------------|
| PENDING | ACCEPTED | Buyer accepts|
| PENDING | REJECTED | Buyer rejects|

## 4. Written Flow (End-to-End)

1. **Admin** seeds the system, assigns roles to new users.
2. **Buyer** creates a project (OPEN).
3. **Solver** browses open projects, clicks "Request to Work".
4. **Buyer** sees notification, views requester profile (verified, work history), assigns one solver.
5. **Solver** creates tasks with title, description, deadline; uploads ZIP per task.
6. **Buyer** receives notification when solver submits; downloads ZIP, reviews, accepts or rejects with comment.
7. If rejected: **Solver** sees feedback, re-uploads; **Buyer** reviews again.
8. When all accepted: Project → COMPLETED.
