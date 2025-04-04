import * as profilService from '../services/profilService.js';

export const getAllProfils = async (req, res) => {
  try {
    const profils = await profilService.getAllProfils();
    res.status(200).json(profils);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des profils',
      error: error.message,
    });
  }
};
export const createProfil = async (req, res) => {
  try {
    const { data } = req.body;
    const newProfil = await profilService.createProfil(data);
    res.status(201).json(newProfil);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création du profil',
      error: error.message,
    });
  }
};

export const updateProfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const updatedProfil = await profilService.updateProfil(id, data);

    if (!updatedProfil) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.status(200).json(updatedProfil);
  } catch (error) {
    res.status(500).json({
      message: `Erreur lors de la mise à jour du profil avec l'ID`,
      error: error.message,
    });
  }
};

export const getProfilById = async (req, res) => {
  try {
    const { id } = req.params;
    const profil = await profilService.getProfilById(parseInt(id, 10));

    if (!profil) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }

    res.status(200).json(profil);
  } catch (error) {
    res.status(500).json({
      message: `Erreur lors de la récupération du profil avec l'ID`,
      error: error.message,
    });
  }
};

export const deleteProfil = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProfil = await profilService.deleteProfil(parseInt(id, 10));

    if (!deleteProfil) {
      return res.status(404).join({ message: 'Profil non trouvé' });
    }

    res.status(200).json({ message: 'Profil supprimé avec succès' });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du profil avec l'ID",
      error: error.message,
    });
  }
};
