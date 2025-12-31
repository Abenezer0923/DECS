-- CreateEnum
CREATE TYPE "ElectionType" AS ENUM ('National', 'ByElection', 'Referendum');

-- CreateEnum
CREATE TYPE "ElectionStatus" AS ENUM ('Planning', 'Active', 'Archived');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('Planned', 'Ongoing', 'Completed', 'Delayed', 'Cancelled');

-- CreateEnum
CREATE TYPE "DependencyType" AS ENUM ('FinishToStart', 'StartToStart');

-- CreateEnum
CREATE TYPE "CommunicationType" AS ENUM ('PressRelease', 'SocialMedia', 'SMS', 'WebsiteUpdate');

-- CreateEnum
CREATE TYPE "CommunicationStatus" AS ENUM ('Draft', 'PendingApproval', 'Published');

-- CreateEnum
CREATE TYPE "AlertPriority" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "department" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "election_cycles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ElectionType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "ElectionStatus" NOT NULL DEFAULT 'Planning',

    CONSTRAINT "election_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" SERIAL NOT NULL,
    "election_cycle_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "legal_basis" TEXT,
    "responsible_department" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_statutory" BOOLEAN NOT NULL DEFAULT false,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'Planned',
    "parent_milestone_id" INTEGER,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_dependencies" (
    "id" SERIAL NOT NULL,
    "predecessor_milestone_id" INTEGER NOT NULL,
    "successor_milestone_id" INTEGER NOT NULL,
    "lag_days" INTEGER NOT NULL DEFAULT 0,
    "dependency_type" "DependencyType" NOT NULL DEFAULT 'FinishToStart',

    CONSTRAINT "milestone_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_actions" (
    "id" SERIAL NOT NULL,
    "milestone_id" INTEGER NOT NULL,
    "type" "CommunicationType" NOT NULL,
    "content_draft" TEXT,
    "target_audience" TEXT,
    "language" TEXT,
    "status" "CommunicationStatus" NOT NULL DEFAULT 'Draft',
    "is_risk_response" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "communication_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_calendar_entries" (
    "id" SERIAL NOT NULL,
    "milestone_id" INTEGER NOT NULL,
    "public_title" TEXT NOT NULL,
    "public_description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "public_calendar_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "milestone_id" INTEGER NOT NULL,
    "trigger_condition" TEXT NOT NULL,
    "recipient_role_id" INTEGER NOT NULL,
    "priority" "AlertPriority" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity_table" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "action" "AuditAction" NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "milestone_id" INTEGER NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_election_cycle_id_fkey" FOREIGN KEY ("election_cycle_id") REFERENCES "election_cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_parent_milestone_id_fkey" FOREIGN KEY ("parent_milestone_id") REFERENCES "milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_dependencies" ADD CONSTRAINT "milestone_dependencies_predecessor_milestone_id_fkey" FOREIGN KEY ("predecessor_milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_dependencies" ADD CONSTRAINT "milestone_dependencies_successor_milestone_id_fkey" FOREIGN KEY ("successor_milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_actions" ADD CONSTRAINT "communication_actions_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_calendar_entries" ADD CONSTRAINT "public_calendar_entries_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_recipient_role_id_fkey" FOREIGN KEY ("recipient_role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
