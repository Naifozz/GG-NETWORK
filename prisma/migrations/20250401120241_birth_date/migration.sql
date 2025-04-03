/*
  Warnings:

  - Changed the type of `Birth_Date` on the `Utilisateur` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "Birth_Date",
ADD COLUMN     "Birth_Date" TIMESTAMP(3) NOT NULL;
