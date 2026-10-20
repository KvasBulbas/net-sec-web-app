-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('EMPLOYEE', 'CLIENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "status" "UserStatus" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
