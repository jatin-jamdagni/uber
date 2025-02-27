-- AlterTable
ALTER TABLE "BlacklistedToken" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '24 hours';

-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "duration" DROP NOT NULL,
ALTER COLUMN "distance" DROP NOT NULL;
