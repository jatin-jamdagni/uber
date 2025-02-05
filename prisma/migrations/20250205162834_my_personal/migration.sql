-- AlterTable
ALTER TABLE "BlacklistedToken" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '24 hours';
