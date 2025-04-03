import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserGroups = async () => {
  try {
    const userGroups = await prisma.userGroupe.findMany();
    return userGroups;
  } catch (error) {
    console.error('Error getting user groups', error);
    throw error;
  }
};

export const getUserGroupsByUserId = async (userId) => {
  try {
    const userGroups = await prisma.userGroupe.findMany({
      where: { ID_Utilisateur: userId },
    });
    return userGroups;
  } catch (error) {
    console.error('Error getting user groups', error);
    throw error;
  }
};

export const getUserGroupsByGroupId = async (groupId) => {
  try {
    const userGroups = await prisma.userGroupe.findMany({
      where: { ID_Groupe: groupId },
    });
    return userGroups;
  } catch (error) {
    console.error('Error getting user groups', error);
    throw error;
  }
};

export const updateUserGroup = async (data) => {
  try {
    const userGroup = await prisma.userGroupe.update({
      where: {
        ID_Utilisateur_ID_Group: {
          ID_Utilisateur: data.ID_Utilisateur,
          ID_Group: data.ID_Group,
        },
      },
      data: {
        IsMod: data.IsMod, // Fournissez les données à mettre à jour
      },
    });
    return userGroup;
  } catch (error) {
    console.error('Error updating user group', error);
    throw error;
  }
};
export const createUserGroup = async (data) => {
  try {
    const userGroup = await prisma.userGroupe.create({
      data,
    });
    return userGroup;
  } catch (error) {
    console.error('Error creating user group', error);
    throw error;
  }
};

export const deleteUserGroupById = async (id) => {
  try {
    const userGroup = await prisma.userGroupe.delete({
      where: { ID_UserGroupe: id },
    });
    return userGroup;
  } catch (error) {
    console.error('Error deleting user group', error);
    throw error;
  }
};

export const deleteUserGroupByGroupId = async (groupId) => {
  try {
    const userGroups = await prisma.userGroupe.deleteMany({
      where: { ID_Group: groupId },
    });
    return userGroups;
  } catch (error) {
    console.error('Error deleting user groups', error);
    throw error;
  }
};
