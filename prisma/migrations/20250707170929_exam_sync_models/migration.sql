/*
  Warnings:

  - You are about to drop the `GroupMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."GroupMessage" DROP CONSTRAINT "GroupMessage_group_id_fkey";

-- DropTable
DROP TABLE "public"."GroupMessage";

-- DropTable
DROP TABLE "public"."user_subscriptions";

-- CreateTable
CREATE TABLE "public"."Exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "user_id" UUID NOT NULL,
    "group_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExamTopic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "exam_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExamProgress" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "topic_id" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exam_user_id_idx" ON "public"."Exam"("user_id");

-- CreateIndex
CREATE INDEX "Exam_group_id_idx" ON "public"."Exam"("group_id");

-- CreateIndex
CREATE INDEX "ExamTopic_exam_id_idx" ON "public"."ExamTopic"("exam_id");

-- CreateIndex
CREATE INDEX "ExamProgress_user_id_idx" ON "public"."ExamProgress"("user_id");

-- CreateIndex
CREATE INDEX "ExamProgress_topic_id_idx" ON "public"."ExamProgress"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExamProgress_user_id_topic_id_key" ON "public"."ExamProgress"("user_id", "topic_id");

-- AddForeignKey
ALTER TABLE "public"."Exam" ADD CONSTRAINT "Exam_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamTopic" ADD CONSTRAINT "ExamTopic_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "public"."Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExamProgress" ADD CONSTRAINT "ExamProgress_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "public"."ExamTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
