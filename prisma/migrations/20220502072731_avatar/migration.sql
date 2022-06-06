/*
  Warnings:

  - Added the required column `avatar_path` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_path" TEXT NOT NULL;
