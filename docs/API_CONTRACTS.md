# API Contracts

Base URL: `http://localhost:4000/api` (or your deployed backend URL)

All authenticated requests require: `Authorization: Bearer <accessToken>`

---

## Auth

### POST /auth/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PROBLEM_SOLVER"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Email already registered",
  "code": "BAD_REQUEST"
}
```

---

### POST /auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "BUYER"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 900
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "UNAUTHORIZED"
}
```

---

### POST /auth/refresh

**Request:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response (200):** Same as login

---

## Users (Admin only)

### GET /users

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "BUYER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### PUT /users/:id/role

**Request:**
```json
{
  "role": "BUYER"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "BUYER"
  }
}
```

---

## Projects

### POST /projects (Buyer only)

**Request:**
```json
{
  "title": "Project Title",
  "description": "Optional description"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "Project Title",
    "description": "Optional description",
    "status": "OPEN",
    "buyerId": "clx...",
    "solverId": null,
    "buyer": { "id": "...", "email": "...", "name": "..." }
  }
}
```

---

### GET /projects

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "Project Title",
      "status": "OPEN",
      "buyer": { "id": "...", "email": "...", "name": "..." },
      "solver": null,
      "_count": { "requests": 2, "tasks": 0 }
    }
  ]
}
```

---

### GET /projects/:id

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "Project Title",
    "description": "...",
    "status": "REQUESTED",
    "buyer": { "id": "...", "email": "...", "name": "..." },
    "solver": null,
    "requests": [
      {
        "id": "clx...",
        "userId": "clx...",
        "status": "PENDING",
        "user": { "id": "...", "email": "...", "name": "..." }
      }
    ],
    "tasks": []
  }
}
```

---

### PUT /projects/:id/assign (Buyer only)

**Request:**
```json
{
  "solverId": "clx..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "status": "ASSIGNED",
    "solverId": "clx...",
    "solver": { "id": "...", "email": "...", "name": "..." }
  }
}
```

---

## Requests

### POST /projects/:id/requests (Problem Solver only)

**Request:**
```json
{
  "message": "Optional message"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "projectId": "clx...",
    "userId": "clx...",
    "status": "PENDING",
    "project": { "id": "...", "title": "...", "status": "OPEN" },
    "user": { "id": "...", "email": "...", "name": "..." }
  }
}
```

---

### GET /projects/:id/requests

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "userId": "clx...",
      "status": "PENDING",
      "user": { "id": "...", "email": "...", "name": "..." }
    }
  ]
}
```

---

### GET /requests/my (Problem Solver only)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "projectId": "clx...",
      "status": "PENDING",
      "project": { "id": "...", "title": "...", "status": "OPEN" }
    }
  ]
}
```

---

## Tasks

### POST /projects/:id/tasks (Problem Solver, assigned only)

**Request:**
```json
{
  "title": "Task Title",
  "description": "Optional description"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "projectId": "clx...",
    "title": "Task Title",
    "status": "CREATED",
    "orderIndex": 1
  }
}
```

---

### GET /projects/:id/tasks

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "Task Title",
      "status": "SUBMITTED",
      "submissions": [
        {
          "id": "clx...",
          "fileName": "uuid.zip",
          "status": "PENDING"
        }
      ]
    }
  ]
}
```

---

## Submissions

### POST /projects/:id/tasks/:taskId/submissions (Problem Solver, assigned only)

**Request:** `multipart/form-data` with `file` (ZIP only, max 10MB)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "taskId": "clx...",
    "fileName": "uuid.zip",
    "fileSize": 1024,
    "status": "PENDING"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Only .zip files are allowed",
  "code": "BAD_REQUEST"
}
```

---

### PUT /projects/:id/tasks/:taskId/submissions/:submissionId/review (Buyer only)

**Request:**
```json
{
  "status": "ACCEPTED",
  "feedback": "Optional feedback"
}
```

Or for reject:
```json
{
  "status": "REJECTED",
  "feedback": "Please fix the implementation"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "status": "ACCEPTED",
    "feedback": null,
    "reviewedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Error Format

All errors follow:
```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "ERROR_CODE"
}
```

Validation errors include:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    { "path": "body.email", "message": "Invalid email format" }
  ]
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error
