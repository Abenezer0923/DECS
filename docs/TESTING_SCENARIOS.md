# Real-World Testing Scenarios for DECS

This guide provides complete, real-world testing scenarios you can follow step-by-step in Swagger UI.

---

## Scenario 1: Setting Up a Complete Election

**Goal:** Create a full election cycle with milestones, dependencies, and communications

**Time:** 10 minutes

### Step 1: Login
```
POST /api/v1/auth/login
```
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```
**Copy the token and authorize Swagger**

### Step 2: Create Election Cycle
```
POST /api/v1/elections
```
```json
{
  "name": "2026 Ethiopian General Election",
  "type": "National",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z"
}
```
**Note the election ID (e.g., 1)**

### Step 3: Create Milestone 1 - Voter Registration
```
POST /api/v1/milestones
```
```json
{
  "electionCycleId": 1,
  "title": "Voter Registration Period",
  "description": "Registration of eligible voters across all regions",
  "legalBasis": "Electoral Law Article 45, Section 2",
  "responsibleDepartment": "Operations",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z",
  "isStatutory": true
}
```
**Note the milestone ID (e.g., 1)**

### Step 4: Add Amharic Translation
```
PUT /api/v1/milestones/1
```
```json
{
  "translations": [
    {
      "language": "am",
      "title": "የመራጮች ምዝገባ ጊዜ",
      "description": "በሁሉም ክልሎች ብቁ መራጮችን ምዝገባ"
    }
  ]
}
```

### Step 5: Create Milestone 2 - Candidate Nomination
```
POST /api/v1/milestones
```
```json
{
  "electionCycleId": 1,
  "title": "Candidate Nomination Period",
  "description": "Political parties and independent candidates submit nominations",
  "legalBasis": "Electoral Law Article 52",
  "responsibleDepartment": "Legal",
  "startDate": "2026-04-05T00:00:00Z",
  "endDate": "2026-04-20T23:59:59Z",
  "isStatutory": true
}
```
**Note the milestone ID (e.g., 2)**

### Step 6: Create Milestone 3 - Campaign Period
```
POST /api/v1/milestones
```
```json
{
  "electionCycleId": 1,
  "title": "Official Campaign Period",
  "description": "Candidates conduct campaigns following electoral guidelines",
  "legalBasis": "Electoral Law Article 67",
  "responsibleDepartment": "Operations",
  "startDate": "2026-05-01T00:00:00Z",
  "endDate": "2026-06-15T23:59:59Z",
  "isStatutory": false
}
```

### Step 7: Create Communication for Voter Registration
```
POST /api/v1/communications
```
```json
{
  "milestoneId": 1,
  "type": "PressRelease",
  "contentDraft": "The National Electoral Board of Ethiopia (NEBE) announces that voter registration will begin on March 1, 2026. All eligible citizens aged 18 and above are encouraged to register at their nearest registration center. Registration will continue until March 31, 2026.",
  "targetAudience": "General Public",
  "language": "en"
}
```

### Step 8: Create Alert for Voter Registration
```
POST /api/v1/alerts
```
```json
{
  "milestoneId": 1,
  "triggerCondition": "7_DAYS_BEFORE_START",
  "recipientRoleId": 2,
  "priority": "High"
}
```

### Step 9: Verify Everything
```
GET /api/v1/elections/1
```
Should show election with all milestones

```
GET /api/v1/milestones?electionCycleId=1
```
Should show all 3 milestones

✅ **Success!** You've created a complete election setup.

---

## Scenario 2: Communication Approval Workflow

**Goal:** Create, review, and approve a press release

**Time:** 5 minutes

### Step 1: Communication Officer Creates Draft
```
POST /api/v1/communications
```
```json
{
  "milestoneId": 1,
  "type": "PressRelease",
  "contentDraft": "NEBE announces voter registration centers are now open in all 11 regions. Citizens can register Monday-Friday, 8AM-5PM.",
  "targetAudience": "Media, General Public",
  "language": "en"
}
```
**Note the communication ID (e.g., 1)**

### Step 2: Update to Pending Approval
```
PUT /api/v1/communications/1
```
```json
{
  "status": "PendingApproval"
}
```

### Step 3: Board Member Reviews and Approves
```
POST /api/v1/workflow/approve-communication/1
```
```json
{
  "approved": true,
  "comments": "Content is accurate and appropriate for publication. Approved."
}
```

### Step 4: Verify Status Changed
```
GET /api/v1/communications?milestoneId=1
```
Should show status as "Published"

### Step 5: Check Audit Trail
```
GET /api/v1/audit-logs?entityTable=CommunicationAction&entityId=1
```
Should show the approval action

✅ **Success!** Communication approved and published.

---

## Scenario 3: Risk Management for High-Risk Milestone

**Goal:** Flag a milestone as high-risk and prepare response materials

**Time:** 5 minutes

### Step 1: Update Milestone Risk Level
```
PUT /api/v1/milestones/1
```
```json
{
  "riskLevel": "High"
}
```

### Step 2: Create FAQ for Common Questions
```
POST /api/v1/risk-responses
```
```json
{
  "milestoneId": 1,
  "content": "Q: Who is eligible to register?\nA: All Ethiopian citizens aged 18 and above with valid identification.\n\nQ: What documents are required?\nA: National ID card or passport.\n\nQ: Can I register online?\nA: No, registration must be done in person at designated centers.",
  "type": "FAQ"
}
```

### Step 3: Create Holding Statement
```
POST /api/v1/risk-responses
```
```json
{
  "milestoneId": 1,
  "content": "NEBE is aware of reports regarding [issue]. We are investigating and will provide an official statement within 24 hours. For accurate information, please refer to our official channels.",
  "type": "HoldingStatement"
}
```

### Step 4: Create Key Messages
```
POST /api/v1/risk-responses
```
```json
{
  "milestoneId": 1,
  "content": "1. Voter registration is free and accessible to all eligible citizens.\n2. Registration centers are located in all kebeles.\n3. NEBE staff are trained to assist voters.\n4. Your vote is confidential and secure.",
  "type": "KeyMessage"
}
```

### Step 5: Create Risk Communication
```
POST /api/v1/communications
```
```json
{
  "milestoneId": 1,
  "type": "SocialMedia",
  "contentDraft": "Reminder: Voter registration is FREE. Beware of anyone asking for payment. Report suspicious activity to NEBE hotline: 8080.",
  "targetAudience": "Social Media Followers",
  "language": "en",
  "isRiskResponse": true
}
```

### Step 6: Verify Risk Materials
```
GET /api/v1/risk-responses/1
```
Should show all risk response materials

✅ **Success!** Risk management materials prepared.

---

## Scenario 4: Escalation to Management

**Goal:** Escalate a delayed milestone to management board

**Time:** 3 minutes

### Step 1: Update Milestone Status to Delayed
```
PUT /api/v1/milestones/1
```
```json
{
  "status": "Delayed"
}
```

### Step 2: Escalate to Management
```
POST /api/v1/notifications/escalate/1
```
```json
{
  "reason": "Voter registration is behind schedule due to insufficient registration centers in remote areas. Immediate action required to deploy mobile registration units."
}
```

### Step 3: Verify Notification Sent
Check server logs or email for notification to Board members

### Step 4: Check Audit Log
```
GET /api/v1/audit-logs?entityTable=Milestone&entityId=1
```
Should show status change to Delayed

✅ **Success!** Management has been notified.

---

## Scenario 5: Multilingual Public Calendar

**Goal:** Create public-facing calendar entries in multiple languages

**Time:** 5 minutes

### Step 1: Create Public Entry for Voter Registration
```
POST /api/v1/public/calendar
```
```json
{
  "milestoneId": 1,
  "publicTitle": "Voter Registration",
  "publicDescription": "Register to vote at your nearest registration center",
  "isPublished": false
}
```
**Note the entry ID (e.g., 1)**

### Step 2: Add Translation to Milestone
```
PUT /api/v1/milestones/1
```
```json
{
  "translations": [
    {
      "language": "am",
      "title": "የመራጮች ምዝገባ",
      "description": "በአቅራቢያዎ ባለው የምዝገባ ማዕከል ድምጽ ለመስጠት ይመዝገቡ"
    },
    {
      "language": "om",
      "title": "Galmee Filannoo",
      "description": "Bakka galmee filannoo dhiyoo keessanitti filachuuf galmaa'aa"
    }
  ]
}
```

### Step 3: Publish the Entry
```
PUT /api/v1/public/calendar/1
```
```json
{
  "isPublished": true
}
```

### Step 4: Test Public API (No Auth Needed!)
```
GET /api/v1/public/calendar?lang=en
```
Should show English version

```
GET /api/v1/public/calendar?lang=am
```
Should show Amharic version

```
GET /api/v1/public/calendar?lang=om
```
Should show Oromo version

✅ **Success!** Multilingual public calendar is live.

---

## Scenario 6: Generating Reports

**Goal:** Generate progress reports in different formats

**Time:** 3 minutes

### Step 1: View Progress (JSON)
```
GET /api/v1/reports/progress
```
Returns JSON with statistics and milestone list

### Step 2: Download PDF Report
```
GET /api/v1/reports/progress?format=pdf
```
Click "Download file" to get PDF

### Step 3: Download Excel Report
```
GET /api/v1/reports/progress?format=excel
```
Click "Download file" to get Excel spreadsheet

### Step 4: Verify Report Contents
Open the downloaded files and verify:
- Election cycle information
- Milestone statistics
- Status breakdown
- Detailed milestone list

✅ **Success!** Reports generated successfully.

---

## Scenario 7: Document Management

**Goal:** Upload and manage documents for a milestone

**Time:** 3 minutes

### Step 1: Upload Legal Document
```
POST /api/v1/documents
```
- milestoneId: `1`
- file: Choose a PDF file (e.g., electoral_law.pdf)

Click Execute

### Step 2: Upload Communication Draft
```
POST /api/v1/documents
```
- milestoneId: `1`
- file: Choose a Word document (e.g., press_release_draft.docx)

### Step 3: List All Documents for Milestone
```
GET /api/v1/documents/milestone/1
```
Should show both uploaded documents

### Step 4: Download a Document
```
GET /api/v1/documents/1/download
```
Click "Download file"

✅ **Success!** Documents uploaded and accessible.

---

## Scenario 8: Circular Dependency Prevention

**Goal:** Test the system's ability to prevent circular dependencies

**Time:** 3 minutes

### Step 1: Create Milestone A
```
POST /api/v1/milestones
```
```json
{
  "electionCycleId": 1,
  "title": "Milestone A",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-31T23:59:59Z"
}
```
**Note ID (e.g., 10)**

### Step 2: Create Milestone B
```
POST /api/v1/milestones
```
```json
{
  "electionCycleId": 1,
  "title": "Milestone B",
  "startDate": "2026-02-01T00:00:00Z",
  "endDate": "2026-02-28T23:59:59Z"
}
```
**Note ID (e.g., 11)**

### Step 3: Check Valid Dependency (A → B)
```
POST /api/v1/workflow/check-circular-dependency
```
```json
{
  "predecessorId": 10,
  "successorId": 11
}
```
**Expected:** `hasCircularDependency: false`

### Step 4: Check Invalid Dependency (B → A)
```
POST /api/v1/workflow/check-circular-dependency
```
```json
{
  "predecessorId": 11,
  "successorId": 10
}
```
**Expected:** `hasCircularDependency: true` (if A→B exists)

✅ **Success!** Circular dependency detection working.

---

## Scenario 9: Status Transition Validation

**Goal:** Test valid and invalid status transitions

**Time:** 2 minutes

### Step 1: Test Valid Transition (Planned → Ongoing)
```
POST /api/v1/workflow/validate-transition
```
```json
{
  "currentStatus": "Planned",
  "newStatus": "Ongoing"
}
```
**Expected:** `valid: true`

### Step 2: Test Invalid Transition (Completed → Ongoing)
```
POST /api/v1/workflow/validate-transition
```
```json
{
  "currentStatus": "Completed",
  "newStatus": "Ongoing"
}
```
**Expected:** `valid: false`

### Step 3: Test Valid Transition (Delayed → Ongoing)
```
POST /api/v1/workflow/validate-transition
```
```json
{
  "currentStatus": "Delayed",
  "newStatus": "Ongoing"
}
```
**Expected:** `valid: true`

✅ **Success!** Status validation working correctly.

---

## Scenario 10: Complete Audit Trail

**Goal:** Track all changes to a milestone

**Time:** 5 minutes

### Step 1: Create Milestone
```
POST /api/v1/milestones
```
```json
{
  "electionCycleId": 1,
  "title": "Test Milestone",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-31T23:59:59Z"
}
```
**Note ID (e.g., 20)**

### Step 2: Update Status
```
PUT /api/v1/milestones/20
```
```json
{
  "status": "Ongoing"
}
```

### Step 3: Update Risk Level
```
PUT /api/v1/milestones/20
```
```json
{
  "riskLevel": "High"
}
```

### Step 4: Update Dates
```
PUT /api/v1/milestones/20
```
```json
{
  "endDate": "2026-02-15T23:59:59Z"
}
```

### Step 5: View Complete Audit Trail
```
GET /api/v1/audit-logs?entityTable=Milestone&entityId=20
```

Should show:
- CREATE action with initial values
- UPDATE action for status change
- UPDATE action for risk level change
- UPDATE action for date change

Each entry should include:
- User who made the change
- Timestamp
- Old values
- New values

✅ **Success!** Complete audit trail captured.

---

## Tips for Testing

### 🎯 Best Practices

1. **Test in Order**: Follow the logical flow (create election → milestones → communications)
2. **Note IDs**: Keep track of IDs as you create resources
3. **Check Responses**: Always verify the response status and data
4. **Use Audit Logs**: Check audit logs to verify changes were recorded
5. **Test Error Cases**: Try invalid data to see error handling

### 🐛 Common Mistakes

1. **Forgetting to Authorize**: Always click "Authorize" after login
2. **Wrong Date Format**: Use ISO 8601: `2026-01-01T00:00:00Z`
3. **Invalid IDs**: Make sure referenced IDs exist
4. **Missing Required Fields**: Check the schema for required fields

### 📝 Keep Track

Create a testing checklist:
- [ ] Login successful
- [ ] Election cycle created
- [ ] Milestones created
- [ ] Communications created
- [ ] Workflows tested
- [ ] Reports generated
- [ ] Audit logs verified

---

**Happy Testing!** 🚀

For more information:
- **Quick Start**: `docs/SWAGGER_QUICK_START.md`
- **Full Guide**: `docs/SWAGGER_TESTING_GUIDE.md`
- **API Reference**: `docs/API_QUICK_REFERENCE.md`
