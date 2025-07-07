-- CreateTable
CREATE TABLE "public"."Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "joinId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupMembership" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "group_id" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_joinId_key" ON "public"."Group"("joinId");

-- CreateIndex
CREATE INDEX "GroupMembership_user_id_idx" ON "public"."GroupMembership"("user_id");

-- CreateIndex
CREATE INDEX "GroupMembership_group_id_idx" ON "public"."GroupMembership"("group_id");

-- AddForeignKey
ALTER TABLE "public"."GroupMembership" ADD CONSTRAINT "GroupMembership_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
