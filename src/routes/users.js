import express from 'express';

import {
  createUtilisateurs,
  deleteUtilisateurs,
  getAllUtilisateurs,
  updateUtilisateurs,
  getUtilisateursById,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUtilisateurs);

router.get('/:id', getUtilisateursById);

router.post('/', createUtilisateurs);

router.put('/:id', updateUtilisateurs);

router.delete('/:id', deleteUtilisateurs);

export default router;
