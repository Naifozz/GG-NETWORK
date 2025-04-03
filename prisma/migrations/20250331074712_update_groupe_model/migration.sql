/*
  Warnings:

  - Added the required column `etat` to the `Groupe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Groupe" ADD COLUMN     "etat" TEXT NOT NULL;
