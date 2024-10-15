-- AlterTable
ALTER TABLE "user_cards" ADD COLUMN     "is_foil" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
