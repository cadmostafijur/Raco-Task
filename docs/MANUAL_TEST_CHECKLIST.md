# Manual Testing Checklist

## Servers Running
- **Backend:** http://localhost:4000
- **Frontend:** http://localhost:3000

## Test Credentials
- **Admin:** admin@marketplace.com / Admin123!
- **Buyer/Solver:** Register new users, then Admin assigns roles

---

## Automated API Tests
Run: `node test-api.js` from project root. All 11 steps should PASS.

---

## Manual Frontend Tests

### 1. Admin Flow
- [ ] Login as admin@marketplace.com
- [ ] Go to Admin Dashboard
- [ ] See list of users
- [ ] Assign BUYER role to a user
- [ ] Assign PROBLEM_SOLVER role to another user

### 2. Buyer Flow
- [ ] Register new user → Admin assigns BUYER role → Re-login
- [ ] Create new project (title + description)
- [ ] View project in list
- [ ] Open project → See lifecycle visualization
- [ ] When requests arrive: Assign a solver
- [ ] When tasks submitted: Accept or Reject submission

### 3. Solver Flow
- [ ] Register new user → Admin assigns PROBLEM_SOLVER role → Re-login
- [ ] See open projects
- [ ] Click "Request to Work" on open project
- [ ] When assigned: Add tasks
- [ ] Upload ZIP file per task (max 10MB, .zip only)
- [ ] See upload progress bar

### 4. Full E2E
1. Admin: Assign Buyer to User A, Solver to User B
2. User A (Buyer): Create project "Test Project"
3. User B (Solver): Request to work on project
4. User A: Assign User B as solver
5. User B: Add task "Task 1"
6. User B: Upload ZIP for Task 1
7. User A: Accept submission
8. Verify project status → COMPLETED
