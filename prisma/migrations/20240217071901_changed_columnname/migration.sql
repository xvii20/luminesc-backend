/*
  Warnings:

  - You are about to drop the column `category` on the `googleexpense` table. All the data in the column will be lost.
  - Added the required column `source` to the `googleexpense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "googleexpense" DROP COLUMN "category",
ADD COLUMN     "source" TEXT NOT NULL;
