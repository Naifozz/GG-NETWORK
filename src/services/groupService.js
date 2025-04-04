import * as groupRepository from '../repositories/groupRepository.js';
import { validateGroupe } from '../models/groupModels.js';
import * as userGroupRepository from '../repositories/userGroupRepository.js';

export const getGroups = async () => {
  try {
    const groups = await groupRepository.getGroups();
    return groups;
  } catch (error) {
    console.error('Error getting groups', error);
    throw error;
  }
};

export const getGroupById = async (id) => {
  try {
    const group = await groupRepository.getGroupById(id);
    if (!group) {
      throw { status: 404, message: `Groupe avec l'ID ${id} introuvable` };
    }
    return group;
  } catch (error) {
    console.error('Error getting group', error);
    throw error;
  }
};

export const createGroup = async (data) => {
  try {
    const validatedGroupe = await validateGroupe(data);

    const group = await groupRepository.createGroup(validatedGroupe);

    await userGroupRepository.createUserGroup({
      ID_Utilisateur: validatedGroupe.ID_Utilisateur,
      ID_Group: group.ID_Group,
      IsMod: true,
    });

    return group;
  } catch (error) {
    console.error('Error creating group', error);
    throw error;
  }
};

export const updateGroup = async (id, data) => {
  try {
    const existingGroup = await groupRepository.getGroupById(id);
    if (!existingGroup) {
      throw { status: 404, message: `Groupe avec l'ID ${id} introuvable` };
    }

    const validatedGroupe = await validateGroupe(data);

    if (existingGroup.ID_Utilisateur !== validatedGroupe.ID_Utilisateur) {
      // Vérifier si l'ancien utilisateur est un modérateur
      const userGroups = await userGroupRepository.getUserGroupsByUserId(
        existingGroup.ID_Utilisateur,
      );
      const isOldUserMod = userGroups.some(
        (ug) => ug.ID_Group === id && ug.IsMod === true,
      );

      if (isOldUserMod) {
        // Retirer les droits de modérateur à l'ancien utilisateur
        await userGroupRepository.updateUserGroup({
          ID_Utilisateur: existingGroup.ID_Utilisateur,
          ID_Group: id,
          IsMod: false,
        });
      }

      // Ajouter les droits de modérateur au nouvel utilisateur
      await userGroupRepository.createUserGroup({
        ID_Utilisateur: validatedGroupe.ID_Utilisateur,
        ID_Group: id,
        IsMod: true,
      });
    }
    const group = await groupRepository.updateGroup(id, validatedGroupe);
    return group;
  } catch (error) {
    console.error('Error updating group', error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    const existanceGroup = await groupRepository.getGroupById(id);
    if (!existanceGroup) {
      throw { status: 404, message: `Groupe avec l'ID ${id} introuvable` };
    }
    await userGroupRepository.deleteUserGroupByGroupId(id);
    const group = await groupRepository.deleteGroup(id);
    return group;
  } catch (error) {
    console.error('Error deleting group', error);
    throw error;
  }
};
