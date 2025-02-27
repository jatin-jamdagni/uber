/*
  Warnings:

  - Added the required column `otp` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlacklistedToken" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '24 hours';

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "otp" TEXT NOT NULL;
