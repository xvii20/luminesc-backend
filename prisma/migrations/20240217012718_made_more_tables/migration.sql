-- CreateTable
CREATE TABLE "googleexpensetrackuser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "googleexpensetrackuser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "googleincome" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "source" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "googleincome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "googleexpense" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "googleexpense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "googleincome" ADD CONSTRAINT "googleincome_userId_fkey" FOREIGN KEY ("userId") REFERENCES "googleexpensetrackuser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "googleexpense" ADD CONSTRAINT "googleexpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "googleexpensetrackuser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
