import { z } from 'zod';
import prisma from './prisma';
import bcrypt from 'bcrypt';

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

  password: z
    .string()
    .min(8, {
      message: 'Le mot de passe doit contenir au moins 8 caractères',
    })
    .regex(/[A-Z]/, {
      message: 'Le mot de passe doit contenir au moins une lettre majuscule',
    })
    .regex(/\d/, {
      message: 'Le mot de passe doit contenir au moins un chiffre',
    })
    .regex(/[!@#$%^&*]/, {
      message:
        'Le mot de passe doit contenir au moins un caractère spécial (ex: !@#$%^&*)',
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

  const utilisateurExistant = await prisma.Utilisateur.findUnique({
    where: { email: Utilisateur.email },
  });

  if (utilisateurExistant) {
    erreur.push('Cet email est déjà utilisé');

    // ✅ Vérification du mot de passe hashé avec bcrypt
    if (
      await bcrypt.compare(Utilisateur.password, utilisateurExistant.password)
    ) {
      erreur.push('Vous avez déjà utilisé ce mot de passe auparavant !');
    }
  }

  return erreur;
};
