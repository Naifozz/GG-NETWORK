import express from 'express';
import {
  createProfil,
  deleteProfil,
  getAllProfils,
  getProfilById,
  updateProfil,
} from '../repositories/profilRepository.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const profile = await getAllProfils();
    res.json(profile);
  } catch (error) {
    console.error('Error getting users', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des profiles.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID manquant.' });
  }

  try {
    const profile = await getProfilById(parseInt(id, 10));
    res.json(profile);
  } catch (error) {
    console.error('Error getting users', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des profiles.' });
  }
});

router.post('/', async (req, res) => {
  const data = req.body;

  if (
    !data.Description ||
    !data.Img ||
    !data.ID_Utilisateur ||
    !data.ID_Connexion ||
    !data.Statut
  ) {
    return res
      .status(400)
      .json({ error: 'Données manquantes dans la requête.' });
  }
  try {
    const profile = await createProfil(data);
    res.json(profile);
  } catch (error) {
    console.error('Error creating profil', error);
    res.status(500).json({ error: 'Erreur lors de la création des profiles.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID manquant.' });
  }
  const data = req.body;

  try {
    const profile = await updateProfil(id, data);
    res.json(profile);
  } catch (error) {
    console.error('Error modification profil', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la modification des profiles.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID manquant.' });
  }
  try {
    const profile = await deleteProfil(id);
    res.json(profile);
  } catch (error) {
    console.error('Error modification profil', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la suppression des profiles.' });
  }
});

export default router;
