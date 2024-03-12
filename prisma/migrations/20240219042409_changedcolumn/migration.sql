/*
  Warnings:

  - You are about to drop the column `userId` on the `income` table. All the data in the column will be lost.
  - Added the required column `uid` to the `income` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "income" DROP CONSTRAINT "income_userId_fkey";

-- AlterTable
ALTER TABLE "income" DROP COLUMN "userId",
ADD COLUMN     "uid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_uid_fkey" FOREIGN KEY ("uid") REFERENCES "expensetrackeruser"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
