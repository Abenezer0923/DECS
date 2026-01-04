# Swagger UI Testing Guide for DECS

## Overview

Swagger UI provides an interactive interface to test all API endpoints without writing code. This guide shows you how to test the DECS backend using Swagger.

## Accessing Swagger UI

1. **Start the application:**
   ```bash
   docker-compose up
   # or
   npm run dev
   ```

2. **Open Swagger UI in your browser:**
   ```
   http://localhost:3000/api-docs
   ```

You'll see an interactive API documentation page with all available endpoints.

---

## Step-by-Step Testing Examples

### Example 1: User Login (Authentication)

**Goal:** Get a JWT token to access protected endpoints

1. **Find the endpoint:**
   - Scroll to the **Auth** section
   - Click on `POST /api/v1/auth/login`

2. **Click "Try it out"** button (top right of the endpoint)

3. **Enter request body:**
   ```json
   {
     "username": "admin",
     "password": "Admin@123"
   }
   ```

4. **Click "Execute"** button

5. **Check the response:**
   - Status: `200 OK`
   - Response body:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "uuid-here",
       "username": "admin",
       "role": "Admin"
     }
   }
   ```

6. **Copy the token** (you'll need it for other requests)

---

### Example 2: Authorize Swagger (Set Token)

**Goal:** Configure Swagger to send your token with all requests

1. **Click the "Authorize" button** (top right, with a lock icon)

2. **In the popup:**
   - Find "bearerAuth (http, Bearer)"
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **Click "Authorize"** button

4. **Click "Close"**

Now all your requests will include the authentication token!

---

### Example 3: Create an Election Cycle

**Goal:** Create a new election cycle

1. **Find the endpoint:**
   - Scroll to **Elections** section
   - Click on `POST /api/v1/elections`

2. **Click "Try it out"**

3. **Enter request body:**
   ```json
   {
     "name": "2026 General Election",
     "type": "National",
     "startDate": "2026-01-01T00:00:00Z",
     "endDate": "2026-12-31T23:59:59Z"
   }
   ```

4. **Click "Execute"**

5. **Check the response:**
   - Status: `201 Created`
   - Response body:
   ```json
   {
     "id": 1,
     "name": "2026 General Election",
     "type": "National",
     "startDate": "2026-01-01T00:00:00.000Z",
     "endDate": "2026-12-31T23:59:59.000Z",
     "status": "Planning"
   }
   ```

6. **Note the `id`** (you'll need it for creating milestones)

---

### Example 4: Get All Election Cycles

**Goal:** Retrieve list of all election cycles

1. **Find the endpoint:**
   - `GET /api/v1/elections`

2. **Click "Try it out"**

3. **Click "Execute"** (no parameters needed)

4. **Check the response:**
   - Status: `200 OK`
   - Response body: Array of election cycles
   ```json
   [
     {
       "id": 1,
       "name": "2026 General Election",
       "type": "National",
       "startDate": "2026-01-01T00:00:00.000Z",
       "endDate": "2026-12-31T23:59:59.000Z",
       "status": "Planning"
     }
   ]
   ```

---

### Example 5: Create a Milestone

**Goal:** Create a milestone for an election cycle

1. **Find the endpoint:**
   - Scroll to **Milestones** section
   - Click on `POST /api/v1/milestones`

2. **Click "Try it out"**

3. **Enter request body:**
   ```json
   {
     "electionCycleId": 1,
     "title": "Voter Registration Period",
     "description": "Registration of eligible voters across all regions",
     "legalBasis": "Electoral Law Article 45",
     "responsibleDepartment": "Operations",
     "startDate": "2026-03-01T00:00:00Z",
     "endDate": "2026-03-31T23:59:59Z",
     "isStatutory": true
   }
   ```

4. **Click "Execute"**

5. **Check the response:**
   - Status: `201 Created`
   - Response includes milestone ID and all fields

---

### Example 6: Get Milestones with Filters

**Goal:** Get milestones for a specific election cycle

1. **Find the endpoint:**
   - `GET /api/v1/milestones`

2. **Click "Try it out"**

3. **Enter query parameters:**
   - `electionCycleId`: `1`
   - `lang`: `en` (optional)

4. **Click "Execute"**

5. **Check the response:**
   - Status: `200 OK`
   - Response: Array of milestones filtered by election cycle

---

### Example 7: Update a Milestone

**Goal:** Update milestone status and add translations

1. **Find the endpoint:**
   - `PUT /api/v1/milestones/{id}`

2. **Click "Try it out"**

3. **Enter path parameter:**
   - `id`: `1` (the milestone ID)

4. **Enter request body:**
   ```json
   {
     "status": "Ongoing",
     "riskLevel": "Medium",
     "translations": [
       {
         "language": "am",
         "title": "የመራጮች ምዝገባ ጊዜ",
         "description": "በሁሉም ክልሎች ብቁ መራጮችን ምዝገባ"
       }
     ]
   }
   ```

5. **Click "Execute"**

6. **Check the response:**
   - Status: `200 OK`
   - Updated milestone data

---

### Example 8: Create Communication Action

**Goal:** Create a communication action for a milestone

1. **Find the endpoint:**
   - Scroll to **Communications** section
   - `POST /api/v1/communications`

2. **Click "Try it out"**

3. **Enter request body:**
   ```json
   {
     "milestoneId": 1,
     "type": "PressRelease",
     "contentDraft": "Voter registration begins on March 1st, 2026. All eligible citizens are encouraged to register at their nearest registration center.",
     "targetAudience": "General Public",
     "language": "en"
   }
   ```

4. **Click "Execute"**

5. **Check the response:**
   - Status: `201 Created`
   - Communication action created with status "Draft"

---

### Example 9: Approve Communication (Workflow)

**Goal:** Approve a communication action

1. **Find the endpoint:**
   - Scroll to **Workflow** section
   - `POST /api/v1/workflow/approve-communication/{id}`

2. **Click "Try it out"**

3. **Enter path parameter:**
   - `id`: `1` (communication action ID)

4. **Enter request body:**
   ```json
   {
     "approved": true,
     "comments": "Approved for immediate publication"
   }
   ```

5. **Click "Execute"**

6. **Check the response:**
   - Status: `200 OK`
   - Message: "Communication approved"

---

### Example 10: Check Circular Dependency

**Goal:** Validate if adding a dependency would create a circular reference

1. **Find the endpoint:**
   - `POST /api/v1/workflow/check-circular-dependency`

2. **Click "Try it out"**

3. **Enter request body:**
   ```json
   {
     "predecessorId": 1,
     "successorId": 2
   }
   ```

4. **Click "Execute"**

5. **Check the response:**
   ```json
   {
     "hasCircularDependency": false,
     "message": "No circular dependency detected"
   }
   ```

---

### Example 11: Send Notification to Role

**Goal:** Send a notification to all users in a specific role

1. **Find the endpoint:**
   - Scroll to **Notifications** section
   - `POST /api/v1/notifications/send-to-role`

2. **Click "Try it out"**

3. **Enter request body:**
   ```json
   {
     "roleId": 2,
     "subject": "Urgent: Milestone Deadline Approaching",
     "message": "The voter registration milestone is due in 3 days. Please ensure all tasks are completed.",
     "priority": "High"
   }
   ```

4. **Click "Execute"**

5. **Check the response:**
   - Status: `200 OK`
   - Message: "Notification sent successfully"

---

### Example 12: Generate Progress Report (PDF)

**Goal:** Generate and download a progress report

1. **Find the endpoint:**
   - Scroll to **Reports** section
   - `GET /api/v1/reports/progress`

2. **Click "Try it out"**

3. **Enter query parameter:**
   - `format`: `pdf`

4. **Click "Execute"**

5. **Download the file:**
   - Click "Download file" link in the response
   - PDF report will be downloaded

---

### Example 13: Upload Document

**Goal:** Upload a document for a milestone

1. **Find the endpoint:**
   - Scroll to **Documents** section
   - `POST /api/v1/documents`

2. **Click "Try it out"**

3. **Fill in the form:**
   - `milestoneId`: `1`
   - `file`: Click "Choose File" and select a document

4. **Click "Execute"**

5. **Check the response:**
   - Status: `201 Created`
   - Document metadata returned

---

### Example 14: Get Public Calendar

**Goal:** Get published calendar entries (no authentication needed)

1. **Find the endpoint:**
   - Scroll to **Public** section
   - `GET /api/v1/public/calendar`

2. **Click "Try it out"**

3. **Enter query parameter:**
   - `lang`: `am` (for Amharic)

4. **Click "Execute"**

5. **Check the response:**
   - Status: `200 OK`
   - Array of published calendar entries with translations

---

### Example 15: View Audit Logs

**Goal:** View audit trail of system changes

1. **Find the endpoint:**
   - Scroll to **Audit Logs** section
   - `GET /api/v1/audit-logs`

2. **Click "Try it out"**

3. **Enter query parameters (optional):**
   - `entityTable`: `Milestone`
   - `limit`: `10`

4. **Click "Execute"**

5. **Check the response:**
   - Status: `200 OK`
   - Array of audit log entries with user info and changes

---

## Common Testing Scenarios

### Scenario 1: Complete Election Setup Flow

```
1. Login → Get token
2. Authorize Swagger with token
3. Create Election Cycle
4. Create Milestone 1 (Voter Registration)
5. Create Milestone 2 (Candidate Nomination)
6. Create dependency between milestones
7. Create communication action for Milestone 1
8. Create alert for Milestone 1
9. View audit logs
```

### Scenario 2: Communication Approval Workflow

```
1. Login as Communication Officer
2. Create communication action (status: Draft)
3. Update status to PendingApproval
4. Login as Admin/Board member
5. Approve communication
6. Verify status changed to Published
```

### Scenario 3: Multilingual Content

```
1. Create milestone in English
2. Update milestone with Amharic translation
3. Get milestone with lang=am parameter
4. Verify translation is returned
5. Create public calendar entry
6. Get public calendar with lang=am
```

---

## Testing Error Cases

### Test 1: Invalid Authentication

1. **Don't authorize** or use invalid token
2. Try to create a milestone
3. **Expected:** `401 Unauthorized`

### Test 2: Validation Error

1. Create milestone with invalid dates:
   ```json
   {
     "electionCycleId": 1,
     "title": "Test",
     "startDate": "2026-12-31T00:00:00Z",
     "endDate": "2026-01-01T00:00:00Z"
   }
   ```
2. **Expected:** `400 Bad Request` with validation error

### Test 3: Not Found

1. Try to get milestone with non-existent ID:
   - `GET /api/v1/milestones/99999`
2. **Expected:** `404 Not Found`

### Test 4: Forbidden

1. Login as non-admin user
2. Try to create a new user
3. **Expected:** `403 Forbidden`

### Test 5: Rate Limiting

1. Make 101 requests quickly to any endpoint
2. **Expected:** `429 Too Many Requests`

---

## Tips for Effective Testing

### 1. Use the Schema Tab

Each endpoint has a "Schema" tab showing the expected request/response format. Use it as a reference.

### 2. Save Example Requests

Copy successful request bodies and save them for future testing.

### 3. Test in Order

Follow logical workflows:
- Authentication first
- Create parent entities before children
- Test happy path before error cases

### 4. Check Response Headers

Look at response headers for useful information:
- `X-RateLimit-Remaining`: Requests left
- `Content-Type`: Response format

### 5. Use Browser DevTools

Open browser DevTools (F12) → Network tab to see:
- Actual HTTP requests
- Response times
- Headers

### 6. Test Different Roles

Create users with different roles and test permissions:
```json
{
  "username": "comm_officer",
  "email": "comm@example.com",
  "password": "Comm@123",
  "roleId": 3
}
```

---

## Troubleshooting

### Problem: "Failed to fetch"

**Solution:**
- Check if the server is running
- Verify the URL is correct
- Check browser console for CORS errors

### Problem: "401 Unauthorized"

**Solution:**
- Click "Authorize" button
- Enter token with "Bearer " prefix
- Verify token hasn't expired

### Problem: "400 Bad Request"

**Solution:**
- Check request body format
- Verify all required fields are present
- Check date formats (ISO 8601)

### Problem: "500 Internal Server Error"

**Solution:**
- Check server logs
- Verify database is running
- Check for validation errors

---

## Advanced Testing

### Testing with cURL (from Swagger)

Swagger generates cURL commands for you:

1. Execute any request in Swagger
2. Look for "Curl" tab in the response section
3. Copy the cURL command
4. Run it in terminal:

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/milestones' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "electionCycleId": 1,
  "title": "Voter Registration",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z"
}'
```

### Testing with Postman

1. In Swagger, click on any endpoint
2. Copy the request details
3. Import into Postman
4. Or export Swagger JSON and import into Postman

---

## Quick Reference: Common Test Data

### Valid Election Cycle
```json
{
  "name": "2026 General Election",
  "type": "National",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z"
}
```

### Valid Milestone
```json
{
  "electionCycleId": 1,
  "title": "Voter Registration",
  "description": "Register eligible voters",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z",
  "isStatutory": true,
  "legalBasis": "Article 45",
  "responsibleDepartment": "Operations"
}
```

### Valid Communication
```json
{
  "milestoneId": 1,
  "type": "PressRelease",
  "contentDraft": "Voter registration begins...",
  "targetAudience": "General Public",
  "language": "en"
}
```

### Valid Alert
```json
{
  "milestoneId": 1,
  "triggerCondition": "3_DAYS_BEFORE_START",
  "recipientRoleId": 2,
  "priority": "High"
}
```

---

## Video Tutorial Steps

If creating a video tutorial, follow these steps:

1. **Introduction** (1 min)
   - Show Swagger UI interface
   - Explain what it does

2. **Authentication** (2 min)
   - Login to get token
   - Authorize Swagger

3. **Basic CRUD** (5 min)
   - Create election cycle
   - Create milestone
   - Update milestone
   - Get list

4. **Advanced Features** (5 min)
   - Workflow approval
   - Notifications
   - Reports

5. **Error Handling** (2 min)
   - Show validation errors
   - Show authentication errors

---

**Happy Testing!** 🚀

For more information, see:
- API Documentation: http://localhost:3000/api-docs
- Quick Reference: `docs/API_QUICK_REFERENCE.md`
- Full README: `backend/README.md`
