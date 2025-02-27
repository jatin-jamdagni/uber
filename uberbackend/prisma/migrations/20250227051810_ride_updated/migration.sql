-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_captainId_fkey";

-- AlterTable
ALTER TABLE "BlacklistedToken" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '24 hours';

-- AlterTable
ALTER TABLE "Ride" ALTER COLUMN "captainId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "Captain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
