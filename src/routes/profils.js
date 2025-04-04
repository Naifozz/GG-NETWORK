import express from 'express';
import {
  createProfil,
  deleteProfil,
  getAllProfils,
  getProfilById,
  updateProfil,
} from '../controllers/profilController.js';

const router = express.Router();

router.get('/', getAllProfils);

router.get('/:id', getProfilById);

router.post('/', createProfil);

router.put('/:id', updateProfil);

router.delete('/:id', deleteProfil);

export default router;
