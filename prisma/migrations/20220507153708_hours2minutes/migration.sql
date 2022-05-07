/*
  Warnings:

  - You are about to drop the column `hours_count` on the `user_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_stats" DROP COLUMN "hours_count",
ADD COLUMN     "minutes_count" INTEGER NOT NULL DEFAULT 0;
