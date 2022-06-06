-- CreateTable
CREATE TABLE "user_stats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "movies_count" INTEGER NOT NULL DEFAULT 0,
    "hours_count" INTEGER NOT NULL DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_genres_stats" (
    "user_id" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "movies_count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "movie_stats" (
    "tmdb_id" INTEGER NOT NULL,
    "vote_sum" INTEGER NOT NULL DEFAULT 0,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "watched" INTEGER NOT NULL,

    CONSTRAINT "movie_stats_pkey" PRIMARY KEY ("tmdb_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_stats_user_id_key" ON "user_stats"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_genres_stats_id_key" ON "user_genres_stats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "movie_stats_tmdb_id_key" ON "movie_stats"("tmdb_id");

-- AddForeignKey
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genres_stats" ADD CONSTRAINT "user_genres_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
