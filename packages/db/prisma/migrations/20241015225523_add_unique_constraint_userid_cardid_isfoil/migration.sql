/*
  Warnings:

  - A unique constraint covering the columns `[user_id,card_id,is_foil]` on the table `user_cards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_cards_user_id_card_id_is_foil_key" ON "user_cards"("user_id", "card_id", "is_foil");
