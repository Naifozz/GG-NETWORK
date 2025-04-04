/*
  Warnings:

  - You are about to drop the column `etat` on the `Groupe` table. All the data in the column will be lost.
  - Added the required column `Etat` to the `Groupe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Groupe" DROP COLUMN "etat",
ADD COLUMN     "Etat" TEXT NOT NULL;
