import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error getting users', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des utilisateurs.' });
  }
});

export default router;
