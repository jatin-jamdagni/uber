-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED', 'ONGOING');

-- AlterTable
ALTER TABLE "BlacklistedToken" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '24 hours';

-- CreateTable
CREATE TABLE "Ride" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "captainId" INTEGER NOT NULL,
    "pickup" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "fare" INTEGER NOT NULL,
    "status" "RideStatus" NOT NULL DEFAULT 'PENDING',
    "duration" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "paymentId" TEXT,
    "orderId" TEXT,
    "signature" TEXT,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "Captain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
