/*
  Warnings:

  - Added the required column `ID_Utilisateur` to the `Groupe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Groupe" ADD COLUMN     "ID_Utilisateur" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Groupe" ADD CONSTRAINT "Groupe_ID_Utilisateur_fkey" FOREIGN KEY ("ID_Utilisateur") REFERENCES "Utilisateur"("ID_Utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;
