-- CreateTable
CREATE TABLE "list_movie" (
    "user_id" INTEGER NOT NULL,
    "list_name" TEXT NOT NULL,
    "tmdb_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "list_movie_user_id_list_name_tmdb_id_key" ON "list_movie"("user_id", "list_name", "tmdb_id");

-- AddForeignKey
ALTER TABLE "list_movie" ADD CONSTRAINT "list_movie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
