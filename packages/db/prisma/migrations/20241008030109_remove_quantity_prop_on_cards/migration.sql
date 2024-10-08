/*
  Warnings:

  - You are about to drop the column `totalQuantity` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `user_cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "totalQuantity";

-- AlterTable
ALTER TABLE "user_cards" DROP COLUMN "quantity";
