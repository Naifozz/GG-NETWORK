import { z } from 'zod';
import prisma from './prisma';

export const utilisateurSchema = z.object({
  nom: z
    .string()
    .min(3, {
      message: "Le nom d'utilisateur doit avoir au moins 3 caractères",
    })
    .max(50, {
      message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
    })
    .toLowerCase()
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Le nom d'utilisateur ne peut contenir que des lettres minuscules, des chiffres et des underscores",
    }),
});

export const validateUtilisateur = async (utilisateur) => {
  const erreur = [];
  try {
    utilisateurSchema.parse(utilisateur);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // N'extraire que les messages
      erreur.push(...error.errors.map((err) => err.message));
    }
  }

  const utilisateurExistant = await prisma.utilisateur.findUnique({
    where: { nom: utilisateur.nom.toLowerCase() },
  });
  if (utilisateurExistant) {
    erreur.push("Ce nom d'utilisateur est déjà utilisé");
  }
  return erreur;
};
