# Test Credentials for DECS

## Default Users

After running the seed script (`npx prisma db seed`), the following test users are available:

### 1. Admin User
```
Username: admin
Password: Admin@123
Role: Admin
Department: ICT
```
**Permissions:** Full system access, can perform all operations

### 2. Management Board Member
```
Username: board_member
Password: Admin@123
Role: ManagementBoard
Department: Board
```
**Permissions:** 
- View all data
- Approve communications
- Generate reports
- Manage risk responses
- Receive escalation notifications

### 3. Communication Officer
```
Username: comm_officer
Password: Admin@123
Role: Communication
Department: Communication
```
**Permissions:**
- Create and manage communication actions
- Approve communications
- View milestones and elections

### 4. Legal Advisor
```
Username: legal_advisor
Password: Admin@123
Role: Legal
Department: Legal
```
**Permissions:**
- View audit logs
- Modify statutory milestones
- View all data

### 5. Operations Manager
```
Username: ops_manager
Password: Admin@123
Role: Operations
Department: Operations
```
**Permissions:**
- Manage milestones
- Upload documents
- View reports

---

## Testing Different Roles in Swagger

### Test Admin Access

1. **Login as Admin:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

2. **Authorize Swagger** with the token

3. **Test Admin-only endpoints:**
   - Create users
   - Delete any resource
   - Access all endpoints

### Test Board Member Access

1. **Login as Board Member:**
```json
{
  "username": "board_member",
  "password": "Admin@123"
}
```

2. **Authorize Swagger** with the token

3. **Test Board permissions:**
   - Generate reports: `GET /api/v1/reports/progress?format=pdf`
   - Approve communications: `POST /api/v1/workflow/approve-communication/1`
   - View audit logs: `GET /api/v1/audit-logs`

### Test Communication Officer Access

1. **Login as Communication Officer:**
```json
{
  "username": "comm_officer",
  "password": "Admin@123"
}
```

2. **Test Communication permissions:**
   - Create communication: `POST /api/v1/communications`
   - Update communication: `PUT /api/v1/communications/1`
   - Approve communication: `POST /api/v1/workflow/approve-communication/1`

### Test Legal Advisor Access

1. **Login as Legal Advisor:**
```json
{
  "username": "legal_advisor",
  "password": "Admin@123"
}
```

2. **Test Legal permissions:**
   - View audit logs: `GET /api/v1/audit-logs`
   - Modify statutory milestones (should be allowed)

### Test Operations Manager Access

1. **Login as Operations Manager:**
```json
{
  "username": "ops_manager",
  "password": "Admin@123"
}
```

2. **Test Operations permissions:**
   - Create milestones: `POST /api/v1/milestones`
   - Upload documents: `POST /api/v1/documents`
   - View elections: `GET /api/v1/elections`

---

## Testing Report Generation

### Step 1: Login as Admin or Board Member

```
POST /api/v1/auth/login
```
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

### Step 2: Authorize Swagger

Click "Authorize" button and enter: `Bearer YOUR_TOKEN`

### Step 3: Generate JSON Report

```
GET /api/v1/reports/progress
```

**Response:**
```json
{
  "stats": {
    "total": 10,
    "completed": 3,
    "ongoing": 4,
    "delayed": 1,
    "planned": 2
  },
  "milestones": [...]
}
```

### Step 4: Generate PDF Report

```
GET /api/v1/reports/progress?format=pdf
```

**In Swagger:**
1. Find the endpoint
2. Click "Try it out"
3. Enter query parameter: `format` = `pdf`
4. Click "Execute"
5. Click "Download file" in the response

### Step 5: Generate Excel Report

```
GET /api/v1/reports/progress?format=excel
```

**In Swagger:**
1. Find the endpoint
2. Click "Try it out"
3. Enter query parameter: `format` = `excel`
4. Click "Execute"
5. Click "Download file" in the response

---

## Testing Permission Restrictions

### Test 1: Non-Admin Cannot Generate Reports

1. **Login as Communication Officer:**
```json
{
  "username": "comm_officer",
  "password": "Admin@123"
}
```

2. **Try to generate report:**
```
GET /api/v1/reports/progress
```

**Expected Result:** `403 Forbidden`

### Test 2: Non-Admin Cannot Create Users

1. **Login as Operations Manager**

2. **Try to create user:**
```
POST /api/v1/auth/register
```

**Expected Result:** `403 Forbidden`

### Test 3: Only Legal/Admin Can Modify Statutory Dates

1. **Login as Communication Officer**

2. **Try to update statutory milestone:**
```
PUT /api/v1/milestones/1
```
```json
{
  "startDate": "2026-04-01T00:00:00Z"
}
```

**Expected Result:** Should be restricted (if milestone is statutory)

---

## Role Permission Matrix

| Endpoint | Admin | Board | Comm | Legal | Ops |
|----------|-------|-------|------|-------|-----|
| Create Election | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Milestone | ✅ | ✅ | ❌ | ✅ | ✅ |
| Create Communication | ✅ | ✅ | ✅ | ❌ | ❌ |
| Approve Communication | ✅ | ✅ | ✅ | ❌ | ❌ |
| Generate Reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Audit Logs | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage Risk Responses | ✅ | ✅ | ❌ | ❌ | ❌ |
| Upload Documents | ✅ | ✅ | ✅ | ✅ | ✅ |
| Send Notifications | ✅ | ✅ | ❌ | ❌ | ❌ |
| Escalate Milestones | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Creating Additional Test Users

### Via Swagger (Admin only)

```
POST /api/v1/auth/register
```
```json
{
  "username": "test_user",
  "email": "test@example.com",
  "password": "Test@123456",
  "roleId": 3,
  "department": "Communication"
}
```

**Role IDs:**
- 1 = Admin
- 2 = ManagementBoard
- 3 = Communication
- 4 = Legal
- 5 = Operations

---

## Security Notes

⚠️ **Important:**
- Default password `Admin@123` should be changed in production
- These are test credentials for development only
- Never commit real credentials to version control
- Use environment variables for production passwords

---

## Troubleshooting

### "Invalid credentials"
- Check username and password are correct
- Ensure database is seeded: `npx prisma db seed`

### "403 Forbidden"
- Check if your role has permission for that endpoint
- Verify you're using the correct user account

### "401 Unauthorized"
- Token may have expired - login again
- Ensure you clicked "Authorize" in Swagger
- Check token format: `Bearer YOUR_TOKEN`

---

**Last Updated:** January 2, 2026  
**Default Password:** Admin@123 (change in production!)
