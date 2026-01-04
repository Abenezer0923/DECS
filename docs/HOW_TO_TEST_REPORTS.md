# How to Test Report Generation in Swagger

## Quick Answer: YES! ✅

The report endpoints **are already implemented** and **will appear in Swagger UI** after you start the server.

---

## Step-by-Step Guide

### 1. Start the Server

```bash
cd backend
docker-compose up
```

Wait for: `Server is running on port 3000`

### 2. Open Swagger UI

Open your browser:
```
http://localhost:3000/api-docs
```

### 3. Find the Reports Section

Scroll down until you see the **"Reports"** section. You'll see:

```
Reports
  GET /api/v1/reports/progress
```

### 4. Login First

Before testing reports, you need to authenticate:

**Click on:** `POST /api/v1/auth/login`

**Enter:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Click:** "Execute"

**Copy the token** from the response

### 5. Authorize Swagger

**Click:** "Authorize" button (🔒 top right)

**Enter:** `Bearer YOUR_TOKEN_HERE`

**Click:** "Authorize" then "Close"

### 6. Test JSON Report

**Click on:** `GET /api/v1/reports/progress`

**Click:** "Try it out"

**Leave format empty** (defaults to JSON)

**Click:** "Execute"

**You'll see:**
```json
{
  "stats": {
    "total": 5,
    "completed": 2,
    "ongoing": 2,
    "delayed": 0,
    "planned": 1
  },
  "milestones": [
    {
      "id": 1,
      "title": "Voter Registration",
      "status": "Ongoing",
      ...
    }
  ]
}
```

### 7. Test PDF Report

**Click on:** `GET /api/v1/reports/progress`

**Click:** "Try it out"

**Enter parameter:**
- Name: `format`
- Value: `pdf`

**Click:** "Execute"

**In the response:**
- You'll see "Download file" link
- Click it to download the PDF

### 8. Test Excel Report

**Click on:** `GET /api/v1/reports/progress`

**Click:** "Try it out"

**Enter parameter:**
- Name: `format`
- Value: `excel`

**Click:** "Execute"

**In the response:**
- Click "Download file" to get the Excel file

---

## What You'll See in Swagger

### The Endpoint Documentation

```
GET /api/v1/reports/progress

Generate progress report

Generate a progress report in JSON, PDF, or Excel format 
showing milestone statistics and details

Parameters:
  format (query) - Report format (json, pdf, or excel)
    Example: pdf

Responses:
  200 - Report generated successfully
  401 - Unauthorized
  403 - Forbidden - Admin or ManagementBoard role required
  500 - Server error
```

### The Try It Out Interface

When you click "Try it out", you'll see:

```
Parameters
┌─────────────────────────────────────┐
│ format                              │
│ [dropdown: json, pdf, excel]        │
│ Report format                       │
└─────────────────────────────────────┘

[Execute Button]
```

### The Response

**For JSON:**
```json
{
  "stats": { ... },
  "milestones": [ ... ]
}
```

**For PDF/Excel:**
```
Download file
progress_report.pdf (or .xlsx)
```

---

## Complete Example Flow

### Scenario: Generate All Report Types

```
1. POST /api/v1/auth/login
   Body: { "username": "admin", "password": "Admin@123" }
   → Copy token

2. Click "Authorize"
   → Enter: Bearer YOUR_TOKEN
   → Click Authorize

3. GET /api/v1/reports/progress
   → No parameters
   → Execute
   → See JSON response

4. GET /api/v1/reports/progress?format=pdf
   → Parameter: format = pdf
   → Execute
   → Download PDF

5. GET /api/v1/reports/progress?format=excel
   → Parameter: format = excel
   → Execute
   → Download Excel
```

---

## What's in the Reports?

### JSON Report
```json
{
  "stats": {
    "total": 10,        // Total milestones
    "completed": 3,     // Completed milestones
    "ongoing": 4,       // Currently ongoing
    "delayed": 1,       // Delayed milestones
    "planned": 2        // Planned milestones
  },
  "milestones": [
    {
      "id": 1,
      "title": "Voter Registration",
      "startDate": "2026-03-01T00:00:00.000Z",
      "endDate": "2026-03-31T23:59:59.000Z",
      "status": "Ongoing",
      "responsibleDepartment": "Operations"
    },
    // ... more milestones
  ]
}
```

### PDF Report

**Contains:**
- Header: "DECS Progress Report"
- Generation date
- Statistics table (Total, Completed, Ongoing, Delayed, Planned)
- Detailed milestone list with:
  - ID
  - Title
  - Start Date
  - End Date
  - Status

### Excel Report

**Contains:**
- Sheet name: "Progress Report"
- Columns:
  - ID
  - Title
  - Start Date
  - End Date
  - Status
  - Department
- All milestones as rows

---

## Testing with Different Users

### Admin User (Full Access)
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```
✅ Can generate all report types

### Board Member (Full Access)
```json
{
  "username": "board_member",
  "password": "Admin@123"
}
```
✅ Can generate all report types

### Communication Officer (No Access)
```json
{
  "username": "comm_officer",
  "password": "Admin@123"
}
```
❌ Will get 403 Forbidden

---

## Troubleshooting

### "403 Forbidden"

**Problem:** User doesn't have permission

**Solution:** Login as `admin` or `board_member`

### "No data in report"

**Problem:** No milestones in database

**Solution:** Create some test data first:
1. Create an election cycle
2. Create some milestones
3. Then generate report

### "Download not working"

**Problem:** Browser blocking download

**Solution:** 
- Check browser's download settings
- Allow downloads from localhost
- Try different browser

### "500 Server Error"

**Problem:** Database connection issue

**Solution:**
- Check if database is running
- Verify DATABASE_URL in .env
- Check server logs

---

## Visual Guide

### Step 1: Find Reports Section
```
┌─────────────────────────────────────┐
│ Swagger UI                          │
├─────────────────────────────────────┤
│ Auth                                │
│   POST /api/v1/auth/login           │
│                                     │
│ Elections                           │
│   GET /api/v1/elections             │
│                                     │
│ Reports  ← LOOK HERE                │
│   GET /api/v1/reports/progress  ✓   │
│                                     │
│ ...                                 │
└─────────────────────────────────────┘
```

### Step 2: Click and Try It Out
```
┌─────────────────────────────────────┐
│ GET /api/v1/reports/progress        │
├─────────────────────────────────────┤
│ Generate progress report            │
│                                     │
│ [Try it out] ← CLICK THIS           │
└─────────────────────────────────────┘
```

### Step 3: Enter Parameters
```
┌─────────────────────────────────────┐
│ Parameters                          │
├─────────────────────────────────────┤
│ format (query)                      │
│ ┌─────────────────────────────────┐ │
│ │ pdf                             │ │ ← TYPE HERE
│ └─────────────────────────────────┘ │
│                                     │
│ [Execute] ← CLICK THIS              │
└─────────────────────────────────────┘
```

### Step 4: Download File
```
┌─────────────────────────────────────┐
│ Responses                           │
├─────────────────────────────────────┤
│ Code: 200                           │
│ Download file                       │
│ progress_report.pdf ← CLICK THIS    │
└─────────────────────────────────────┘
```

---

## Quick Test Checklist

- [ ] Server is running
- [ ] Swagger UI is open (http://localhost:3000/api-docs)
- [ ] Logged in as admin or board_member
- [ ] Authorized Swagger with token
- [ ] Found Reports section
- [ ] Tested JSON report (no format parameter)
- [ ] Tested PDF report (format=pdf)
- [ ] Tested Excel report (format=excel)
- [ ] Downloaded and opened files

---

## Summary

✅ **YES**, the report endpoint is fully implemented and documented in Swagger!

**To test:**
1. Start server: `docker-compose up`
2. Open: http://localhost:3000/api-docs
3. Login as admin
4. Authorize Swagger
5. Find "Reports" section
6. Test with format=pdf or format=excel

**Report formats available:**
- JSON (default)
- PDF (format=pdf)
- Excel (format=excel)

**Who can access:**
- Admin ✅
- ManagementBoard ✅
- Others ❌

---

**Need more help?**
- Full testing guide: `docs/SWAGGER_TESTING_GUIDE.md`
- Test credentials: `docs/TEST_CREDENTIALS.md`
- API reference: `docs/API_QUICK_REFERENCE.md`
