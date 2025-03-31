import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGroups = async () => {
  try {
    const groups = await prisma.groupe.findMany();
    return groups;
  } catch (error) {
    console.error('Error getting groups', error);
    throw error;
  }
};

export const getGroupById = async (id) => {
  try {
    const group = await prisma.groupe.findUnique({
      where: { ID_Group: id },
    });
    return group;
  } catch (error) {
    console.error('Error getting group', error);
    throw error;
  }
};

export const createGroup = async (data) => {
  try {
    const group = await prisma.groupe.create({
      data,
    });
    return group;
  } catch (error) {
    console.error('Error creating group', error);
    throw error;
  }
};

export const updateGroup = async (id, data) => {
  try {
    const group = await prisma.groupe.update({
      where: { ID_Group: id },
      data,
    });
    return group;
  } catch (error) {
    console.error('Error updating group', error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    const group = await prisma.groupe.delete({
      where: { ID_Group: id },
    });
    return group;
  } catch (error) {
    console.error('Error deleting group', error);
    throw error;
  }
};
