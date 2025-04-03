import { PrismaClient } from '@prisma/client';
import * as userGroupRepository from './userGroupRepository.js';

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

    await userGroupRepository.createUserGroup({
      ID_Utilisateur: data.ID_Utilisateur,
      ID_Group: group.ID_Group,
      IsMod: true, // L'utilisateur est modérateur
    });
    return group;
  } catch (error) {
    console.error('Error creating group', error);
    throw error;
  }
};

export const updateGroup = async (id, data) => {
  try {
    const existingGroup = await getGroupById(id);
    if (!existingGroup) {
      throw { status: 404, message: `Groupe avec l'ID ${id} introuvable` };
    }
    const group = await prisma.groupe.update({
      where: { ID_Group: id },
      data,
    });

    if (existingGroup.ID_Utilisateur !== data.ID_Utilisateur) {
      // Met à jour l'ancien utilisateur pour qu'il ne soit plus modérateur
      const oldUserGroup = await userGroupRepository.getUserGroupsByUserId(
        existingGroup.ID_Utilisateur,
      );
      if (oldUserGroup) {
        await userGroupRepository.updateUserGroup({
          ID_Utilisateur: existingGroup.ID_Utilisateur,
          ID_Group: id,
          IsMod: false,
        });
      }

      // Vérifie si une entrée pour le nouvel utilisateur existe déjà
      const newUserGroup = await userGroupRepository.getUserGroupsByUserId(
        data.ID_Utilisateur,
      );
      if (newUserGroup) {
        // Met à jour l'entrée existante pour le nouvel utilisateur
        await userGroupRepository.updateUserGroup({
          ID_Utilisateur: data.ID_Utilisateur,
          ID_Group: id,
          IsMod: true,
        });
      }
    }

    return group;
  } catch (error) {
    console.error('Error updating group', error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    await userGroupRepository.deleteUserGroupByGroupId(id);

    const group = await prisma.groupe.delete({
      where: { ID_Group: id },
    });
    return group;
  } catch (error) {
    console.error('Error deleting group', error);
    throw error;
  }
};
