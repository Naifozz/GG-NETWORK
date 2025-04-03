/*
  Warnings:

  - You are about to drop the `Moderateur` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `IsMod` to the `UserGroupe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Concours" DROP CONSTRAINT "Concours_ID_Modo_fkey";

-- DropForeignKey
ALTER TABLE "MarketPlace" DROP CONSTRAINT "MarketPlace_ID_Modo_fkey";

-- AlterTable
ALTER TABLE "UserGroupe" ADD COLUMN     "IsMod" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Moderateur";
