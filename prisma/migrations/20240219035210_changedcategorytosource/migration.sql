/*
  Warnings:

  - You are about to drop the column `userId` on the `expense` table. All the data in the column will be lost.
  - The primary key for the `expensetrackeruser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `expensetrackeruser` table. All the data in the column will be lost.
  - Added the required column `uid` to the `expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `expensetrackeruser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "expense" DROP CONSTRAINT "expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "income" DROP CONSTRAINT "income_userId_fkey";

-- AlterTable
ALTER TABLE "expense" DROP COLUMN "userId",
ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "expensetrackeruser" DROP CONSTRAINT "expensetrackeruser_pkey",
DROP COLUMN "id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "expensetrackeruser_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "income" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_uid_fkey" FOREIGN KEY ("uid") REFERENCES "expensetrackeruser"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income" ADD CONSTRAINT "income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "expensetrackeruser"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
