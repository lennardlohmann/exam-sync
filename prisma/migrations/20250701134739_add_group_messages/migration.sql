-- CreateTable
CREATE TABLE "public"."GroupMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "group_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupMessage_group_id_idx" ON "public"."GroupMessage"("group_id");

-- CreateIndex
CREATE INDEX "GroupMessage_user_id_idx" ON "public"."GroupMessage"("user_id");

-- CreateIndex
CREATE INDEX "GroupMessage_createdAt_idx" ON "public"."GroupMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."GroupMessage" ADD CONSTRAINT "GroupMessage_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
