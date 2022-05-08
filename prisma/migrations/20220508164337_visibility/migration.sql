/*
  Warnings:

  - You are about to drop the `list_movie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "list_movie" DROP CONSTRAINT "list_movie_user_id_fkey";

-- DropTable
DROP TABLE "list_movie";

-- CreateTable
CREATE TABLE "movies_list" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "list_name" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL,

    CONSTRAINT "movies_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie_in_list" (
    "list_id" INTEGER NOT NULL,
    "tmdb_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_list_user_id_list_name_key" ON "movies_list"("user_id", "list_name");

-- CreateIndex
CREATE UNIQUE INDEX "movie_in_list_list_id_tmdb_id_key" ON "movie_in_list"("list_id", "tmdb_id");

-- AddForeignKey
ALTER TABLE "movies_list" ADD CONSTRAINT "movies_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_in_list" ADD CONSTRAINT "movie_in_list_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "movies_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
