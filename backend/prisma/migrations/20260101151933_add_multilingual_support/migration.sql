-- CreateTable
CREATE TABLE "milestone_translations" (
    "id" SERIAL NOT NULL,
    "milestone_id" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "milestone_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "milestone_translations_milestone_id_language_key" ON "milestone_translations"("milestone_id", "language");

-- AddForeignKey
ALTER TABLE "milestone_translations" ADD CONSTRAINT "milestone_translations_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
