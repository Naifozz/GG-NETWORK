import * as groupRepository from '../repositories/groupRepository.js';
import { validateGroupe } from '../models/groupModels.js';

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
    return group;
  } catch (error) {
    console.error('Error getting group', error);
    throw error;
  }
};

export const createGroup = async (data) => {
  try {
    const validatedGroupe = validateGroupe(data);

    const group = await groupRepository.createGroup(validatedGroupe);
    return group;
  } catch (error) {
    console.error('Error creating group', error);
    throw error;
  }
};

export const updateGroup = async (id, data) => {
  try {
    const validatedGroupe = validateGroupe(data);
    const group = await groupRepository.updateGroup(id, validatedGroupe);
    return group;
  } catch (error) {
    console.error('Error updating group', error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    const group = await groupRepository.deleteGroup(id);
    return group;
  } catch (error) {
    console.error('Error deleting group', error);
    throw error;
  }
};
