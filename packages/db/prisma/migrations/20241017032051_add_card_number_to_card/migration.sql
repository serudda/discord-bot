/*
  Warnings:

  - A unique constraint covering the columns `[card_number]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "card_number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cards_card_number_key" ON "cards"("card_number");
