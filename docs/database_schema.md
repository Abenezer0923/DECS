# DECS Database Schema Design

This document outlines the database schema for the Digital Election Calendar System (DECS), designed for **PostgreSQL**.

## 1. Entity Relationship Overview

The schema is centered around the **ElectionCycle** and **Milestone** entities.
*   **ElectionCycle**: Represents a full election period (e.g., "2025 General Election").
*   **Milestone**: The core unit of work (e.g., "Voter Registration").
*   **MilestoneDependency**: Handles the logic for calculating dates (e.g., Milestone B starts 5 days after Milestone A).
*   **CommunicationPlan**: Links milestones to public messaging.

## 2. Tables Definition

### 2.1 User Management & Access Control (Req I.4)

**`roles`**
*   `id` (PK, Int)
*   `name` (String) - e.g., 'Admin', 'Board', 'Communication', 'Legal'
*   `description` (String)

**`users`**
*   `id` (PK, UUID)
*   `username` (String, Unique)
*   `email` (String, Unique)
*   `password_hash` (String)
*   `role_id` (FK -> roles.id)
*   `department` (String)
*   `is_active` (Boolean)
*   `created_at` (Timestamp)

### 2.2 Election Calendar Core (Req I.1, I.2, I.3)

**`election_cycles`**
*   `id` (PK, Int)
*   `name` (String) - e.g., "6th General Election"
*   `type` (Enum) - 'National', 'By-Election', 'Referendum'
*   `start_date` (Date)
*   `end_date` (Date)
*   `status` (Enum) - 'Planning', 'Active', 'Archived'

**`milestones`**
*   `id` (PK, Int)
*   `election_cycle_id` (FK -> election_cycles.id)
*   `title` (String)
*   `description` (Text)
*   `legal_basis` (String) - Article/Regulation reference
*   `responsible_department` (String)
*   `start_date` (Date)
*   `end_date` (Date)
*   `is_statutory` (Boolean) - True if fixed by law (Req I.1.2)
*   `status` (Enum) - 'Planned', 'Ongoing', 'Completed', 'Delayed', 'Cancelled'
*   `parent_milestone_id` (FK -> milestones.id, Nullable) - For grouping sub-tasks

**`milestone_dependencies`** (Req I.1.3)
*   `id` (PK, Int)
*   `predecessor_milestone_id` (FK -> milestones.id)
*   `successor_milestone_id` (FK -> milestones.id)
*   `lag_days` (Int) - Number of days gap required
*   `dependency_type` (Enum) - 'FinishToStart', 'StartToStart'

### 2.3 Communication & Public Facing (Req I.3, I.6, I.8)

**`communication_actions`**
*   `id` (PK, Int)
*   `milestone_id` (FK -> milestones.id)
*   `type` (Enum) - 'Press Release', 'Social Media', 'SMS', 'Website Update'
*   `content_draft` (Text)
*   `target_audience` (String)
*   `language` (String)
*   `status` (Enum) - 'Draft', 'Pending Approval', 'Published'
*   `is_risk_response` (Boolean) - For misinformation/risk comms (Req I.8)

**`public_calendar_entries`** (Req I.6)
*   `id` (PK, Int)
*   `milestone_id` (FK -> milestones.id)
*   `public_title` (String) - Simplified title for public
*   `public_description` (Text)
*   `is_published` (Boolean)

### 2.4 Alerts & Notifications (Req I.5)

**`alerts`**
*   `id` (PK, Int)
*   `milestone_id` (FK -> milestones.id)
*   `trigger_condition` (String) - e.g., "3 days before deadline"
*   `recipient_role_id` (FK -> roles.id)
*   `priority` (Enum) - 'Low', 'Medium', 'High', 'Critical'
*   `is_active` (Boolean)

### 2.5 Audit & System (Req I.9)

**`audit_logs`**
*   `id` (PK, BigInt)
*   `user_id` (FK -> users.id)
*   `entity_table` (String) - e.g., 'milestones'
*   `entity_id` (Int)
*   `action` (Enum) - 'CREATE', 'UPDATE', 'DELETE'
*   `old_values` (JSONB) - Snapshot before change
*   `new_values` (JSONB) - Snapshot after change
*   `timestamp` (Timestamp)

**`documents`** (Req I.2.2)
*   `id` (PK, Int)
*   `milestone_id` (FK -> milestones.id)
*   `file_path` (String)
*   `file_type` (String)
*   `uploaded_by` (FK -> users.id)
*   `uploaded_at` (Timestamp)

## 3. Key Relationships Summary

1.  **One Election Cycle** has **Many Milestones**.
2.  **One Milestone** can have **Many Dependencies** (both as predecessor and successor).
3.  **One Milestone** can have **Many Communication Actions**.
4.  **One Milestone** can have **Many Documents**.
5.  **Users** belong to **One Role**.

## 4. SQL Implementation Example

```sql
CREATE TABLE election_cycles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Planning'
);

CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    election_cycle_id INT REFERENCES election_cycles(id),
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_statutory BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Planned'
);

CREATE TABLE milestone_dependencies (
    id SERIAL PRIMARY KEY,
    predecessor_id INT REFERENCES milestones(id),
    successor_id INT REFERENCES milestones(id),
    lag_days INT DEFAULT 0
);
```



#this_is 