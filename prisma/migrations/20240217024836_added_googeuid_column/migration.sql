/*
  Warnings:

  - Added the required column `googleuid` to the `googleexpensetrackuser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "googleexpensetrackuser" ADD COLUMN     "googleuid" TEXT NOT NULL;
