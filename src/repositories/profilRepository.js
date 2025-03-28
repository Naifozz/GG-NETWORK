import { PrismaClient } from '@prisma/client';

const createGenericRepository = (model) => {
  const prisma = new PrismaClient();

  const create = async (data) => {
    try {
      return await prisma[model].create({ data });
    } catch (error) {
      console.error(`Erreur lors de la création dans ${model}:`, error);
      throw error;
    }
  };

  // Fermer la connexion Prisma
  const disconnect = async () => {
    await prisma.$disconnect();
  };
  return {
    create,
    disconnect,
  };
};
export const createProfilRepository = () => {
  const profilRepository = createGenericRepository('Profil');

  return {
    ...profilRepository,
  };
};
