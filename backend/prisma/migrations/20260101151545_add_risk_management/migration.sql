-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('Low', 'Medium', 'High');

-- AlterTable
ALTER TABLE "milestones" ADD COLUMN     "risk_level" "RiskLevel" NOT NULL DEFAULT 'Low';

-- CreateTable
CREATE TABLE "risk_responses" (
    "id" SERIAL NOT NULL,
    "milestone_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "risk_responses" ADD CONSTRAINT "risk_responses_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
