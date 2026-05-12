-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "emailContent" TEXT NOT NULL,
    "sender" TEXT,
    "subject" TEXT,
    "threatScore" INTEGER NOT NULL DEFAULT 0,
    "aiAnalysis" TEXT,
    "urlReputation" JSONB,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);
