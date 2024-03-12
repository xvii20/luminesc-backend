/*
  Warnings:

  - You are about to drop the column `userId` on the `googleexpense` table. All the data in the column will be lost.
  - The primary key for the `googleexpensetrackuser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `googleexpensetrackuser` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `googleincome` table. All the data in the column will be lost.
  - Added the required column `googleuid` to the `googleexpense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleuid` to the `googleincome` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "googleexpense" DROP CONSTRAINT "googleexpense_userId_fkey";

-- DropForeignKey
ALTER TABLE "googleincome" DROP CONSTRAINT "googleincome_userId_fkey";

-- AlterTable
ALTER TABLE "googleexpense" DROP COLUMN "userId",
ADD COLUMN     "googleuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "googleexpensetrackuser" DROP CONSTRAINT "googleexpensetrackuser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "googleexpensetrackuser_pkey" PRIMARY KEY ("googleuid");

-- AlterTable
ALTER TABLE "googleincome" DROP COLUMN "userId",
ADD COLUMN     "googleuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "googleincome" ADD CONSTRAINT "googleincome_googleuid_fkey" FOREIGN KEY ("googleuid") REFERENCES "googleexpensetrackuser"("googleuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "googleexpense" ADD CONSTRAINT "googleexpense_googleuid_fkey" FOREIGN KEY ("googleuid") REFERENCES "googleexpensetrackuser"("googleuid") ON DELETE RESTRICT ON UPDATE CASCADE;
