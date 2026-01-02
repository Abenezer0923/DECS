# Advanced Backend Development Phases

This document outlines the roadmap to elevate the DECS backend from MVP to a fully featured, production-ready system based on the advanced requirements.

## Phase 7: Alerts & Notifications System (Req I.5)

**Goal:** Proactively notify users of deadlines, delays, and statutory changes.

1.  **Infrastructure:**
    *   Install `node-cron` for scheduling background tasks.
    *   Install `nodemailer` for email notifications (and prepare structure for SMS).
2.  **Database:**
    *   Enhance `Alert` model to support dynamic rules (e.g., "Notify 3 days before start").
3.  **Logic (`AlertService`):**
    *   **Deadline Checker:** A cron job running daily (e.g., at 00:00) to find milestones starting/ending soon.
    *   **Escalation Engine:** Check for "High Risk" delayed milestones and notify the Management Board.
4.  **API:**
    *   Endpoints to configure alert preferences per user/role.

## Phase 8: Document Management & Attachments (Req I.2.2, I.9.2)

**Goal:** Allow attaching legal documents, press drafts, and FAQs to milestones.

1.  **Infrastructure:**
    *   Install `multer` for handling `multipart/form-data` file uploads.
2.  **Storage:**
    *   Implement a `StorageService` (Local file system for now, abstract for S3 later).
3.  **API:**
    *   `POST /milestones/:id/documents`: Upload a file.
    *   `GET /documents/:id`: Download a file.
4.  **Security:**
    *   Ensure only authorized roles can upload/delete documents.

## Phase 9: Reporting & Data Export (Req I.7) [COMPLETED]

**Goal:** Generate actionable insights and official reports.

1.  **Infrastructure:**
    *   [x] Install `exceljs` (for Excel) and `pdfmake` (for PDF).
2.  **Logic (`ReportService`):**
    *   [x] **Progress Report:** Calculate % completion of the current election cycle.
    *   [x] **Departmental Report:** Filter milestones by `responsibleDepartment`.
3.  **API:**
    *   [x] `GET /reports/progress?format=pdf`
    *   [x] `GET /reports/export?format=excel`

## Phase 10: Comprehensive Audit Trail (Req I.9) [COMPLETED]

**Goal:** Track every critical change for legal accountability.

1.  **Logic:**
    *   [x] Create a reusable `AuditService`.
    *   [x] Implement "Change Tracking": When a milestone is updated, compare `oldValue` and `newValue`.
2.  **Integration:**
    *   [x] Hook into `updateMilestone`, `updateElectionCycle`, `delete*` controllers.
    *   [x] Specifically track changes to `startDate`, `endDate`, and `isStatutory`.
3.  **API:**
    *   [x] `GET /audit-logs`: View history (Admin/Legal only).

## Phase 11: Misinformation & Risk Management (Req I.8) [COMPLETED]

**Goal:** specialized support for high-risk events.

1.  **Database:**
    *   [x] Add `riskLevel` (Low, Medium, High) to `Milestone`.
    *   [x] Add `RiskResponse` model (FAQs, Holding Statements).
2.  **API:**
    *   [x] Endpoints to manage risk assets linked to milestones.
    *   [x] "Rapid Publish" endpoint for clarifications (handled via `RiskResponse` CRUD).

## Phase 12: Multilingual Support (Req I.6) [COMPLETED]

**Goal:** Support Ethiopia's multiple languages.

1.  **Database:**
    *   [x] Refactor `Milestone` to support translations (Added `MilestoneTranslation` table).
2.  **API:**
    *   [x] Update `GET` endpoints to accept `?lang=am` query parameter.
    *   [x] Update `updateMilestone` to accept translations.
