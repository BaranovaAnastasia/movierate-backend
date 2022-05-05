/*
  Warnings:

  - You are about to drop the column `name` on the `user_genres_stats` table. All the data in the column will be lost.
  - Added the required column `genre_id` to the `user_genres_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre_name` to the `user_genres_stats` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_genres_stats_id_key";

-- AlterTable
CREATE SEQUENCE "user_genres_stats_id_seq";
ALTER TABLE "user_genres_stats" DROP COLUMN "name",
ADD COLUMN     "genre_id" INTEGER NOT NULL,
ADD COLUMN     "genre_name" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('user_genres_stats_id_seq'),
ADD CONSTRAINT "user_genres_stats_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE "user_genres_stats_id_seq" OWNED BY "user_genres_stats"."id";

-- CreateTable
CREATE TABLE "user_ratings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "user_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_watched" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tmdb_id" INTEGER NOT NULL,

    CONSTRAINT "user_watched_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_watched" ADD CONSTRAINT "user_watched_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
