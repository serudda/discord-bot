/*
  Warnings:

  - You are about to drop the `Config` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Config";

-- CreateTable
CREATE TABLE "config" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "config_key_key" ON "config"("key");
