-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "scheduledDeactivationAt" TIMESTAMP(3);
