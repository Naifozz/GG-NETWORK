import * as userRepository from '../repositories/UserRepository.js';
import { validateUtilisateur } from '../models/userModels.js';

export const getAllUtilisateurs = async () => {
  try {
    return await userRepository.getAllUtilisateurs();
  } catch (error) {
    throw new Error('Erreur lors de la récupération des Utilisateur' + error);
  }
};
export const createUtilisateurs = async (data) => {
  try {
    const validatedData = await validateUtilisateur(data);

    return await userRepository.createUtilisateurs(validatedData);
  } catch (error) {
    throw new Error("Erreur lors de la création de l'Utilisateur" + error);
  }
};

export const getUtilisateursById = async (id) => {
  try {
    const utilisateur = await userRepository.getUtilisateursById(id);
    if (!utilisateur) {
      console.warn('Utilisateur non trouvé' + id);
      return null;
    }
    return utilisateur;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de l'Utilisateur correspondant" + error,
    );
  }
};

export const updateUtilisateurs = async (id, data) => {
  try {
    const validatedData = await validateUtilisateur(data);

    return await userRepository.updateUtilisateurs(id, validatedData);
  } catch (error) {
    throw new Error(
      "Erreur lors de la modification de l'Utilisateur correspondant" + error,
    );
  }
};
export const deleteUtilisateurs = async (id) => {
  try {
    return await userRepository.deleteUtilisateurs(id);
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'Utilisateur correspondant :" + error,
    );
  }
};
