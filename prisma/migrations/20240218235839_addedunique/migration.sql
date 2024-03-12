/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `expensetrackeruser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "expensetrackeruser_email_key" ON "expensetrackeruser"("email");
