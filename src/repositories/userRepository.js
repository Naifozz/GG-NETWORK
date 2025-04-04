import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUtilisateurs = async () => {
  try {
    return await prisma.Utilisateur.findMany();
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de tous les utilisateurs :',
      error,
    );
    throw error;
  }
};
export const createUtilisateurs = async (data) => {
  try {
    return await prisma.Utilisateur.create({ data });
  } catch (error) {
    console.error("Erreur lors de la création de l'Utilisateur :", error);
    throw error;
  }
};

export const getUtilisateursById = async (id) => {
  try {
    return await prisma.Utilisateur.findUnique({
      where: { ID_Utilisateur: id },
    });
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'Utilisateur avec l'ID ${id} :`,
      error,
    );
    throw error;
  }
};

export const updateUtilisateurs = async (id, data) => {
  try {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new Error('ID invalide');
    }
    return await prisma.Utilisateur.update({
      where: { ID_Utilisateur: parsedId },
      data: data,
    });
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'Utilisateur avec l'ID ${id} :`,
      error,
    );
    throw error;
  }
};

export const deleteUtilisateurs = async (id) => {
  try {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new Error('ID invalide');
    }
    return await prisma.Utilisateur.delete({
      where: { ID_Utilisateur: parsedId },
    });
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'Utilisateur avec l'ID ${id} :`,
      error,
    );
    throw error;
  }
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
