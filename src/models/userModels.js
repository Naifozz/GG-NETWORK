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
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Le nom d'utilisateur ne peut contenir que des lettres minuscules, des chiffres et des underscores",
    }),

  pseudo: z
    .string()
    .min(3, {
      message: 'Le pseudo doit avoir au moins 3 caractères',
    })
    .max(25, {
      message: 'Le pseudo ne peut pas dépasser 25 caractères',
    })
    .regex(/^[a-zA-Z0-9@!_.-]+$/, {
      message:
        'Le pseudo ne peut contenir que des lettres, chiffres et certains caractères spéciaux (@, !, _, ., -)',
    }),

  email: z
    .string()
    .email({ message: "L'email n'est pas valide" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "L'email doit être valide (ex: exemple@gaming.com)",
    }),
});

export const validateUtilisateur = async (Utilisateur) => {
  console.log('Prisma dans validateUtilisateur:', prisma);
  const erreur = [];
  try {
    utilisateurSchema.parse(Utilisateur);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // N'extraire que les messages
      erreur.push(...error.errors.map((err) => err.message));
    }
  }

  const [utilisateurExistant, emailExistant] = await Promise.all([
    prisma.Utilisateur.findUnique({
      where: { nom: Utilisateur.nom },
    }),
    prisma.Utilisateur.findUnique({
      where: { email: Utilisateur.email },
    }),
  ]);
  console.log('Utilisateur existant:', utilisateurExistant);
  console.log('Email existant:', emailExistant);

  if (utilisateurExistant) {
    erreur.push("Ce nom d'utilisateur est déjà utilisé");
  }
  if (emailExistant) {
    erreur.push('Cet email est déjà utilisé');
  }
  return erreur;
};
