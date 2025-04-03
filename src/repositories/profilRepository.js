import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProfils = async () => {
  try {
    return await prisma.Profil.findMany();
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de tous les profils :',
      error,
    );
    throw error;
  }
};
export const createProfil = async (data) => {
  try {
    return await prisma.Profil.create({ data });
  } catch (error) {
    console.error('Erreur lors de la création du profil :', error);
    throw error;
  }
};

export const getProfilById = async (id) => {
  try {
    return await prisma.Profil.findUnique({
      where: { ID_Profil: id },
    });
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du profil avec l'ID ${id} :`,
      error,
    );
    throw error;
  }
};

export const updateProfil = async (id, data) => {
  try {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new Error('ID invalide');
    }
    return await prisma.Profil.update({
      where: { ID_Profil: parsedId },
      data: data,
    });
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour du profil avec l'ID ${id} :`,
      error,
    );
    throw error;
  }
};

export const deleteProfil = async (id) => {
  try {
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      throw new Error('ID invalide');
    }
    return await prisma.Profil.delete({
      where: { ID_Profil: parsedId },
    });
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du profil avec l'ID ${id} :`,
      error,
    );
    throw error;
  }
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
