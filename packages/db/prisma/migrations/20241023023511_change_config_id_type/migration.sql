/*
  Warnings:

  - The primary key for the `config` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "config" DROP CONSTRAINT "config_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "config_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "config_id_seq";
