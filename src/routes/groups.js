import express from 'express';
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../repositories/groupRepository.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groups = await getGroups();
    res.json(groups);
  } catch (error) {
    console.error('Error getting users', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des utilisateurs.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID manquant dans la requête.' });
  }
  try {
    const group = await getGroupById(req.params.id);
    res.json(group);
  } catch (error) {
    console.error('Error getting group', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération du groupe.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { Nom, Description, Etat, Utilisateurs, Concours, Marketplace } =
      req.body;

    if (!Nom || !Etat) {
      return res.status(400).json({ error: 'Nom et Etat sont obligatoires.' });
    }
    const data = {
      Nom,
      Description,
      Etat,
      Utilisateurs,
      Concours,
      Marketplace,
    };
    const group = await createGroup(data);
    res.json(group);
  } catch (error) {
    console.error('Error creating group', error);
    res.status(500).json({ error: 'Erreur lors de la création du groupe.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const groupId = parseInt(id, 10);

  const data = req.body;
  if (!id) {
    return res.status(400).json({ error: 'ID manquant dans la requête.' });
  }
  try {
    const group = await updateGroup(groupId, data);
    res.json(group);
  } catch (error) {
    console.error('Error updating group', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du groupe.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const groupId = parseInt(id, 10);
  if (!id) {
    return res.status(400).json({ error: 'ID manquant dans la requête.' });
  }
  try {
    const group = await deleteGroup(groupId);
    res.json(group);
  } catch (error) {
    console.error('Error deleting group', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du groupe.' });
  }
});

export default router;
