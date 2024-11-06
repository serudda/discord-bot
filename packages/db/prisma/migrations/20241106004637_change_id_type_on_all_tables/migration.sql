/*
  Warnings:

  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `cards` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `pack_cards` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `pack_cards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `packs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `packs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `seasons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `seasons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `subscription_plans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `subscription_plans` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_cards` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_cards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cards" DROP CONSTRAINT "cards_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "cards_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pack_cards" DROP CONSTRAINT "pack_cards_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "pack_cards_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "packs" DROP CONSTRAINT "packs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "packs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "seasons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subscription_plans" DROP CONSTRAINT "subscription_plans_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_cards" DROP CONSTRAINT "user_cards_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "user_cards_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
