-- DropIndex
DROP INDEX "review_user_id_tmdb_id_key";

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");
