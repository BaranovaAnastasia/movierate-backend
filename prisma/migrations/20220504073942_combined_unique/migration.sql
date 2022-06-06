/*
  Warnings:

  - The primary key for the `user_genres_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_genres_stats` table. All the data in the column will be lost.
  - The primary key for the `user_ratings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_ratings` table. All the data in the column will be lost.
  - The primary key for the `user_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_stats` table. All the data in the column will be lost.
  - The primary key for the `user_watched` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_watched` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,genre_id]` on the table `user_genres_stats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,tmdb_id]` on the table `user_ratings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,tmdb_id]` on the table `user_watched` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_genres_stats" DROP CONSTRAINT "user_genres_stats_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "user_ratings" DROP CONSTRAINT "user_ratings_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "user_stats" DROP CONSTRAINT "user_stats_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "user_watched" DROP CONSTRAINT "user_watched_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "user_genres_stats_user_id_genre_id_key" ON "user_genres_stats"("user_id", "genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_ratings_user_id_tmdb_id_key" ON "user_ratings"("user_id", "tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_watched_user_id_tmdb_id_key" ON "user_watched"("user_id", "tmdb_id");
