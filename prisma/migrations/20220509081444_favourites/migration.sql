-- CreateTable
CREATE TABLE "favourites" (
    "user_id" INTEGER NOT NULL,
    "tmdb_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "favourites_user_id_tmdb_id_key" ON "favourites"("user_id", "tmdb_id");

-- AddForeignKey
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
