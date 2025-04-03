import * as userService from '../services/userService.js';

export const getAllUtilisateurs = async (req, res) => {
  try {
    const profils = await userService.getAllUtilisateurs();
    res.status(200).json(profils);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des Utilisateurs',
      error: error.message,
    });
  }
};
export const createUtilisateurs = async (req, res) => {
  try {
    const { data } = req.body;
    const newProfil = await userService.createUtilisateurs(data);
    res.status(201).json(newProfil);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'Utilisateur",
      error: error.message,
    });
  }
};

export const updateUtilisateurs = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const updatedUtilisateurs = await userService.updateUtilisateurs(id, data);

    if (!updatedUtilisateurs) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(updatedUtilisateurs);
  } catch (error) {
    res.status(500).json({
      message: `Erreur lors de la mise à jour de l'Utilisateur avec l'ID`,
      error: error.message,
    });
  }
};

export const getUtilisateursById = async (req, res) => {
  try {
    const { id } = req.params;
    const Utilisateur = await userService.getUtilisateursById(id);

    if (!Utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(Utilisateur);
  } catch (error) {
    res.status(500).json({
      message: `Erreur lors de la récupération de l'Utilisateur avec l'ID`,
      error: error.message,
    });
  }
};

export const deleteUtilisateurs = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUtilisateurs = await userService.deleteUtilisateurs(id);

    if (!deleteUtilisateurs) {
      return res.status(404).join({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'Utilisateur avec l'ID",
      error: error.message,
    });
  }
};
