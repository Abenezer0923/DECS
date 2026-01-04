# DECS API Quick Reference

Quick reference guide for the Digital Election Calendar System API.

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.yourdomain.et/api/v1
```

## Authentication

All protected endpoints require JWT token:

```http
Authorization: Bearer <your-jwt-token>
```

### Get Token

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Server Error |

## Endpoints by Category

### 🔐 Authentication

```http
# Login
POST /auth/login
Body: { username, password }

# Register (Admin only)
POST /auth/register
Body: { username, email, password, roleId, department }
Headers: Authorization: Bearer <token>
```

### 📅 Election Cycles

```http
# List all cycles
GET /elections

# Get specific cycle
GET /elections/:id

# Create cycle
POST /elections
Body: { name, type, startDate, endDate }

# Update cycle
PUT /elections/:id
Body: { name?, type?, startDate?, endDate?, status? }

# Delete cycle
DELETE /elections/:id
```

**Election Types:** `National`, `ByElection`, `Referendum`  
**Statuses:** `Planning`, `Active`, `Archived`

### 🎯 Milestones

```http
# List milestones
GET /milestones?electionCycleId=1&lang=en&page=1&limit=10

# Create milestone
POST /milestones
Body: {
  electionCycleId: number,
  title: string,
  description?: string,
  legalBasis?: string,
  responsibleDepartment?: string,
  startDate: string (ISO),
  endDate: string (ISO),
  isStatutory?: boolean,
  parentMilestoneId?: number
}

# Update milestone
PUT /milestones/:id
Body: {
  title?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  riskLevel?: string,
  translations?: [{ language, title, description }]
}

# Delete milestone
DELETE /milestones/:id
```

**Statuses:** `Planned`, `Ongoing`, `Completed`, `Delayed`, `Cancelled`  
**Risk Levels:** `Low`, `Medium`, `High`

### 🔄 Workflow (New)

```http
# Approve/reject communication
POST /workflow/approve-communication/:id
Body: { approved: boolean, comments?: string }
Roles: Admin, Board, Communication

# Validate status transition
POST /workflow/validate-transition
Body: { currentStatus: string, newStatus: string }

# Check circular dependency
POST /workflow/check-circular-dependency
Body: { predecessorId: number, successorId: number }

# Validate statutory change permission
GET /workflow/validate-statutory/:milestoneId
```

### 📢 Communications

```http
# List communication actions
GET /communications?milestoneId=1

# Create communication action
POST /communications
Body: {
  milestoneId: number,
  type: string,
  contentDraft?: string,
  targetAudience?: string,
  language?: string,
  isRiskResponse?: boolean
}

# Update communication
PUT /communications/:id
Body: { contentDraft?, targetAudience?, status?, language? }

# Delete communication
DELETE /communications/:id
```

**Types:** `PressRelease`, `SocialMedia`, `SMS`, `WebsiteUpdate`  
**Statuses:** `Draft`, `PendingApproval`, `Published`

### 🔔 Notifications (New)

```http
# Send notification to role
POST /notifications/send-to-role
Body: {
  roleId: number,
  subject: string,
  message: string,
  priority: string
}
Roles: Admin, Board

# Escalate milestone to management
POST /notifications/escalate/:milestoneId
Body: { reason: string }

# Send deadline notification
POST /notifications/deadline
Body: { milestoneId: number, daysUntil: number }
Roles: Admin
```

**Priorities:** `Low`, `Medium`, `High`, `Critical`

### 🚨 Alerts

```http
# List alerts
GET /alerts

# Create alert
POST /alerts
Body: {
  milestoneId: number,
  triggerCondition: string,
  recipientRoleId: number,
  priority: string
}

# Delete alert
DELETE /alerts/:id
```

**Trigger Condition Format:** `X_DAYS_BEFORE_START` or `X_DAYS_BEFORE_END`  
Example: `3_DAYS_BEFORE_START`

### 🌍 Public API

```http
# Get public calendar
GET /public/calendar?lang=am

# Create public entry (Admin only)
POST /public/calendar
Body: {
  milestoneId: number,
  publicTitle: string,
  publicDescription?: string,
  isPublished?: boolean
}

# Update public entry
PUT /public/calendar/:id
Body: { publicTitle?, publicDescription?, isPublished? }
```

**Languages:** `en`, `am`, `om`, `ti`, `so`, `aa`, `sid`

### 📊 Reports

```http
# Progress report (JSON)
GET /reports/progress

# Progress report (PDF)
GET /reports/progress?format=pdf

# Progress report (Excel)
GET /reports/progress?format=excel
```

### ⚠️ Risk Management

```http
# Create risk response
POST /risk-responses
Body: {
  milestoneId: number,
  content: string,
  type: string
}

# Get risk responses
GET /risk-responses/:milestoneId

# Update risk response
PUT /risk-responses/:id
Body: { content?, type? }

# Delete risk response
DELETE /risk-responses/:id
```

**Types:** `FAQ`, `HoldingStatement`, `Clarification`, `KeyMessage`

### 📄 Documents

```http
# Upload document
POST /documents
Content-Type: multipart/form-data
Body: { milestoneId, file }

# Get documents for milestone
GET /documents/milestone/:milestoneId

# Download document
GET /documents/:id/download

# Delete document
DELETE /documents/:id
```

### 📝 Audit Logs

```http
# Get audit logs
GET /audit-logs?entityTable=Milestone&entityId=1&limit=50
Roles: Admin, Legal
```

### 👥 Roles

```http
# List roles
GET /roles

# Create role (Admin only)
POST /roles
Body: { name: string, description?: string }

# Update role
PUT /roles/:id

# Delete role
DELETE /roles/:id
```

## Pagination

All list endpoints support pagination:

```http
GET /milestones?page=1&limit=10
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering

### Milestones
```http
GET /milestones?electionCycleId=1&status=Ongoing&lang=en
```

### Communications
```http
GET /communications?milestoneId=1&status=Published
```

### Audit Logs
```http
GET /audit-logs?entityTable=Milestone&userId=user-id&limit=50
```

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| General API | 100 requests / 15 minutes |
| Public API | 50 requests / 15 minutes |
| Auth endpoints | 5 requests / 15 minutes |

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Error Response Format

```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "body.startDate",
      "message": "Start date must be before end date"
    }
  ]
}
```

## Example Workflows

### 1. Create Election with Milestones

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}' \
  | jq -r '.token')

# 2. Create election cycle
CYCLE_ID=$(curl -X POST http://localhost:3000/api/v1/elections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2026 General Election",
    "type": "National",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-12-31T23:59:59Z"
  }' | jq -r '.id')

# 3. Create milestone
curl -X POST http://localhost:3000/api/v1/milestones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"electionCycleId\": $CYCLE_ID,
    \"title\": \"Voter Registration\",
    \"startDate\": \"2026-03-01T00:00:00Z\",
    \"endDate\": \"2026-03-31T23:59:59Z\",
    \"isStatutory\": true
  }"
```

### 2. Approve Communication

```bash
# 1. Create communication action
COMM_ID=$(curl -X POST http://localhost:3000/api/v1/communications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "milestoneId": 1,
    "type": "PressRelease",
    "contentDraft": "Voter registration begins...",
    "targetAudience": "General Public"
  }' | jq -r '.id')

# 2. Update to pending approval
curl -X PUT http://localhost:3000/api/v1/communications/$COMM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "PendingApproval"}'

# 3. Approve
curl -X POST http://localhost:3000/api/v1/workflow/approve-communication/$COMM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"approved": true, "comments": "Approved for publication"}'
```

### 3. Generate Report

```bash
# PDF Report
curl -X GET "http://localhost:3000/api/v1/reports/progress?format=pdf" \
  -H "Authorization: Bearer $TOKEN" \
  --output progress_report.pdf

# Excel Report
curl -X GET "http://localhost:3000/api/v1/reports/progress?format=excel" \
  -H "Authorization: Bearer $TOKEN" \
  --output progress_report.xlsx
```

## Testing with Postman

Import this collection URL:
```
http://localhost:3000/api-docs
```

Or use the Swagger UI at:
```
http://localhost:3000/api-docs
```

## Health Check

```http
GET /health

Response:
{
  "status": "UP",
  "timestamp": "2026-01-02T10:30:00.000Z",
  "environment": "production"
}
```

---

**Version:** 2.0.0  
**Last Updated:** January 2, 2026
