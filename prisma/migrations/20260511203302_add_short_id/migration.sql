/*
  Warnings:

  - A unique constraint covering the columns `[shortId]` on the table `Scan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Scan" ADD COLUMN     "shortId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Scan_shortId_key" ON "Scan"("shortId");
