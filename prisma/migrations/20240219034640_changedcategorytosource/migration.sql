/*
  Warnings:

  - You are about to drop the column `category` on the `expense` table. All the data in the column will be lost.
  - Added the required column `source` to the `expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expense" DROP COLUMN "category",
ADD COLUMN     "source" TEXT NOT NULL;
