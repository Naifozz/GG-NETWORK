import * as profilRepository from '../repositories/profilRepository.js';
import { validateProfil } from '../models/profilModels.js';

export const getAllProfils = async () => {
  try {
    return await profilRepository.getAllProfils();
  } catch (error) {
    throw new Error('Erreur lors de la récupération des profils' + error);
  }
};
export const createProfil = async (data) => {
  try {
    const validatedData = await validateProfil(data);

    return await profilRepository.createProfil(validatedData);
  } catch (error) {
    throw new Error('Erreur lors de la création du profil' + error);
  }
};

export const getProfilById = async (id) => {
  try {
    const profil = await profilRepository.getProfilById(id);
    if (!profil) {
      console.warn('Profil non trouvé' + id);
      return null;
    }
    return profil;
  } catch (error) {
    throw new Error(
      'Erreur lors de la récupération du profil correspondant' + error,
    );
  }
};

export const updateProfil = async (id, data) => {
  try {
    const validatedData = await validateProfil(data);

    return await profilRepository.updateProfil(id, validatedData);
  } catch (error) {
    throw new Error(
      'Erreur lors de la modification du profil correspondant' + error,
    );
  }
};
export const deleteProfil = async (id) => {
  try {
    return await profilRepository.deleteProfil(id);
  } catch (error) {
    console.error(
      'Erreur lors de la suppression du profil correspondant :' + error,
    );
  }
};
