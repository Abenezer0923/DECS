# Swagger Quick Start - 5 Minutes

Get started testing the DECS API in 5 minutes!

## Step 1: Start the Server (30 seconds)

```bash
cd backend
docker-compose up
```

Wait for: `Server is running on port 3000`

## Step 2: Open Swagger (10 seconds)

Open your browser and go to:
```
http://localhost:3000/api-docs
```

You'll see a page with all API endpoints listed.

## Step 3: Login (1 minute)

### 3.1 Find the Login Endpoint
- Scroll down to find **"Auth"** section
- Click on **`POST /api/v1/auth/login`**
- Click the **"Try it out"** button (top right)

### 3.2 Enter Credentials
Replace the example with:
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

### 3.3 Execute
- Click the blue **"Execute"** button
- Scroll down to see the response

### 3.4 Copy Your Token
In the response, you'll see:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI...",
  "user": { ... }
}
```

**Copy the entire token** (the long string after "token":)

## Step 4: Authorize Swagger (30 seconds)

### 4.1 Click Authorize Button
- Look at the top right of the page
- Click the **"Authorize"** button (🔒 lock icon)

### 4.2 Enter Token
- A popup will appear
- In the "Value" field, type: `Bearer ` (with a space after)
- Paste your token after "Bearer "
- Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4.3 Authorize
- Click the **"Authorize"** button in the popup
- Click **"Close"**

✅ You're now authenticated! All requests will include your token.

## Step 5: Test Your First Endpoint (2 minutes)

### 5.1 Create an Election Cycle

**Find the endpoint:**
- Scroll to **"Elections"** section
- Click **`POST /api/v1/elections`**
- Click **"Try it out"**

**Enter data:**
```json
{
  "name": "2026 General Election",
  "type": "National",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z"
}
```

**Execute:**
- Click **"Execute"**
- Check the response - you should see status `201` and your election data with an `id`

### 5.2 Get All Elections

**Find the endpoint:**
- Click **`GET /api/v1/elections`**
- Click **"Try it out"**
- Click **"Execute"**

You should see an array with your election!

### 5.3 Create a Milestone

**Find the endpoint:**
- Scroll to **"Milestones"** section
- Click **`POST /api/v1/milestones`**
- Click **"Try it out"**

**Enter data** (use the election ID from step 5.1):
```json
{
  "electionCycleId": 1,
  "title": "Voter Registration",
  "description": "Registration period for eligible voters",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z",
  "isStatutory": true,
  "legalBasis": "Electoral Law Article 45",
  "responsibleDepartment": "Operations"
}
```

**Execute:**
- Click **"Execute"**
- Check response - status `201` with milestone data

---

## 🎉 Congratulations!

You've successfully:
- ✅ Started the server
- ✅ Accessed Swagger UI
- ✅ Logged in and got a token
- ✅ Authorized Swagger
- ✅ Created an election cycle
- ✅ Retrieved elections
- ✅ Created a milestone

---

## What to Try Next

### Test More Endpoints

1. **Get Milestones**
   ```
   GET /api/v1/milestones?electionCycleId=1
   ```

2. **Create Communication**
   ```
   POST /api/v1/communications
   ```
   ```json
   {
     "milestoneId": 1,
     "type": "PressRelease",
     "contentDraft": "Voter registration begins March 1st",
     "targetAudience": "General Public"
   }
   ```

3. **Generate Report**
   ```
   GET /api/v1/reports/progress?format=pdf
   ```

4. **Check Public Calendar**
   ```
   GET /api/v1/public/calendar
   ```
   (No authentication needed!)

### Test Workflows

1. **Approve Communication**
   ```
   POST /api/v1/workflow/approve-communication/1
   ```
   ```json
   {
     "approved": true,
     "comments": "Looks good!"
   }
   ```

2. **Check Circular Dependency**
   ```
   POST /api/v1/workflow/check-circular-dependency
   ```
   ```json
   {
     "predecessorId": 1,
     "successorId": 2
   }
   ```

3. **Send Notification**
   ```
   POST /api/v1/notifications/send-to-role
   ```
   ```json
   {
     "roleId": 2,
     "subject": "Test Notification",
     "message": "This is a test",
     "priority": "Medium"
   }
   ```

---

## Common Issues & Solutions

### ❌ "Failed to fetch"
**Problem:** Server not running  
**Solution:** Run `docker-compose up` in backend folder

### ❌ "401 Unauthorized"
**Problem:** Not authenticated or token expired  
**Solution:** 
1. Login again to get new token
2. Click "Authorize" and enter token with "Bearer " prefix

### ❌ "400 Bad Request"
**Problem:** Invalid data format  
**Solution:** 
- Check date format: `2026-01-01T00:00:00Z`
- Ensure all required fields are present
- Check the Schema tab for correct format

### ❌ "403 Forbidden"
**Problem:** Insufficient permissions  
**Solution:** Login with admin account or correct role

### ❌ "404 Not Found"
**Problem:** Resource doesn't exist  
**Solution:** Check the ID you're using exists

---

## Tips for Success

### 💡 Tip 1: Use the Schema Tab
Each endpoint has a "Schema" tab showing the exact format needed.

### 💡 Tip 2: Check Response Status
- `200` = Success
- `201` = Created
- `400` = Bad request (check your data)
- `401` = Not authenticated
- `403` = Not authorized
- `404` = Not found
- `500` = Server error

### 💡 Tip 3: Save Your Test Data
Keep a text file with your test data for quick copy-paste.

### 💡 Tip 4: Test in Order
1. Create election cycle first
2. Then create milestones
3. Then create communications
4. Then test workflows

### 💡 Tip 5: Use Browser DevTools
Press F12 to see actual HTTP requests and responses.

---

## Quick Reference Card

### Authentication
```
POST /api/v1/auth/login
Body: { "username": "admin", "password": "Admin@123" }
```

### Election Types
- `National`
- `ByElection`
- `Referendum`

### Milestone Statuses
- `Planned`
- `Ongoing`
- `Completed`
- `Delayed`
- `Cancelled`

### Communication Types
- `PressRelease`
- `SocialMedia`
- `SMS`
- `WebsiteUpdate`

### Priority Levels
- `Low`
- `Medium`
- `High`
- `Critical`

### Date Format
Always use ISO 8601:
```
2026-01-01T00:00:00Z
```

---

## Need More Help?

📖 **Full Testing Guide:** `docs/SWAGGER_TESTING_GUIDE.md`  
📖 **API Reference:** `docs/API_QUICK_REFERENCE.md`  
📖 **README:** `backend/README.md`  
🌐 **Swagger UI:** http://localhost:3000/api-docs  
❤️ **Health Check:** http://localhost:3000/health

---

**Time to Complete:** 5 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Docker installed, server running

Happy Testing! 🚀
