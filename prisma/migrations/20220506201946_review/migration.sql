/*
  Warnings:

  - You are about to drop the `movie_stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "movie_stats";

-- CreateTable
CREATE TABLE "review" (
    "user_id" INTEGER NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "review" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "review_user_id_tmdb_id_key" ON "review"("user_id", "tmdb_id");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
