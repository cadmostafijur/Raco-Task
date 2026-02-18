# Demo Credentials & How to Use

Use these credentials to test the Marketplace Project Workflow system.

---

## Default Admin Account

| Field | Value |
|-------|-------|
| **Email** | `admin@marketplace.com` |
| **Password** | `Admin123!` |

**Role:** ADMIN  
**Use for:** Assigning roles to users, viewing all projects, user management

---

## How to Get Started

### 1. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- **Frontend:** http://localhost:3000  
- **Backend:** http://localhost:4000  

---

### 2. Login as Admin

1. Go to http://localhost:3000/login  
2. Email: `admin@marketplace.com`  
3. Password: `Admin123!`  
4. Click **Sign in**

---

### 3. Create Test Users (Buyer & Solver)

1. **Register Buyer**
   - Go to http://localhost:3000/register  
   - Name: `Test Buyer`  
   - Email: `buyer@test.com`  
   - Password: `Buyer123!`  
   - Click **Create account**

2. **Register Solver**
   - Open incognito/private window or logout  
   - Go to http://localhost:3000/register  
   - Name: `Test Solver`  
   - Email: `solver@test.com`  
   - Password: `Solver123!`  
   - Click **Create account**

---

### 4. Assign Roles & Verify (as Admin)

1. Login as admin (`admin@marketplace.com` / `Admin123!`)  
2. Go to **Dashboard** → **Admin Dashboard**  
3. Find `buyer@test.com` → Click **BUYER**  
4. Find `solver@test.com` → Click **PROBLEM_SOLVER**  
5. (Optional) Click **Verify** next to a solver to mark them as verified — buyers will see this when assigning

---

### 5. Test the Full Flow

| Step | User | Action |
|------|------|--------|
| 1 | Buyer | Login as `buyer@test.com` / `Buyer123!` → Create project |
| 2 | Solver | Login as `solver@test.com` / `Solver123!` → Request to work |
| 3 | Buyer | View requester profile (name, email, verified, projects/tasks completed) → Assign solver |
| 4 | Solver | Add tasks, upload ZIP file |
| 5 | Buyer | Accept or reject submission |

---

## Quick Reference — All Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@marketplace.com` | `Admin123!` |
| Buyer | `buyer@test.com` | `Buyer123!` |
| Solver | `solver@test.com` | `Solver123!` |

> **Note:** Buyer and Solver accounts must be created via Register, then assigned roles by Admin.

---

## Seed Admin (First-Time Setup)

If the admin user does not exist, run:

```bash
cd backend
npm run db:seed
```

Default admin: `admin@marketplace.com` / `Admin123!`

To use custom credentials:

```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=YourPass123! npm run db:seed
```
