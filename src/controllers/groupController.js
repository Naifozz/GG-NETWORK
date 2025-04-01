import * as groupService from '../services/groupService.js';

export const getGroups = async (req, res) => {
  try {
    const groups = await groupService.getGroups();
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error getting groups', error);
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des groupes' });
  }
};

export const getGroupById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const group = await groupService.getGroupById(id);
    res.status(200).json(group);
  } catch (error) {
    console.error('Error getting group', error);
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Erreur lors de la récupération du groupe' });
    }
  }
};

export const createGroup = async (req, res) => {
  try {
    const group = await groupService.createGroup(req.body);
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group', error);
    res.status(500).json({ message: 'Erreur lors de la création du groupe' });
  }
};

export const updateGroup = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const data = req.body;
  try {
    const group = await groupService.updateGroup(id, data);
    res.status(200).json(group);
  } catch (error) {
    console.error('Error updating group', error);
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Erreur lors de la mise à jour du groupe' });
    }
  }
};

export const deleteGroup = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const group = await groupService.deleteGroup(id);
    res.status(200).json(group);
  } catch (error) {
    console.error('Error deleting group', error);
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Erreur lors de la suppression du groupe' });
    }
  }
};
