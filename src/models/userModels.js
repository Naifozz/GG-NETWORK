import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const today = new Date();
const minDate = new Date();
minDate.setFullYear(today.getFullYear() - 120);

const countryPhonePrefixes = {
  France: '+33',
  Belgique: '+32',
  Suisse: '+41',
  Corse: '+33',
};

export const utilisateurSchema = z
  .object({
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

    country: z.enum(['France', 'Belgique', 'Suisse', 'Corse'], {
      message: 'Votre Pays ne fait pas encore partie de notre liste',
    }),

    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'La date de naissance doit être au format YYYY-MM-DD',
      })
      .refine((dateStr) => new Date(dateStr) <= today, {
        message: 'La date de naissance ne peut pas être dans le futur.',
      })
      .refine((dateStr) => new Date(dateStr) >= minDate, {
        message:
          'La date de naissance ne peut pas être plus ancienne que 120 ans',
      }),

    numTel: z
      .string()
      .regex(/^\+\d{10,15}$/, { message: 'Numéro de téléphone invalide' }),
  })
  .refine(
    (data) => {
      // Si pas de numéro ou pas de pays, on ignore cette validation
      if (!data.numTel || !data.country) return true;

      const expectedPrefix = countryPhonePrefixes[data.country];
      return data.numTel.startsWith(expectedPrefix);
    },
    {
      message: 'Numéro de téléphone invalide',
      path: ['numTel'], // Spécifier que l'erreur concerne le champ numTel
    },
  );

// Schéma spécifique pour la validation du téléphone (pour les tests)
export const phoneNumberSchema = z
  .object({
    country: z.enum(['France', 'Belgique', 'Suisse', 'Corse']),
    numTel: z
      .string()
      .regex(/^\+\d{10,15}$/, { message: 'Numéro de téléphone invalide' }),
  })
  .refine(
    (data) => {
      const expectedPrefix = countryPhonePrefixes[data.country];
      return data.numTel.startsWith(expectedPrefix);
    },
    {
      message: 'Numéro de téléphone invalide',
      path: ['numTel'],
    },
  );

export const validateUtilisateur = async (Utilisateur) => {
  const erreur = [];
  try {
    utilisateurSchema.parse(Utilisateur);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // N'extraire que les messages
      erreur.push(...error.errors.map((err) => err.message));
    }
  }

  // Vérifier si l'email existe déjà
  const emailExistant = await prisma.Utilisateur.findUnique({
    where: { email: Utilisateur.email },
  });

  if (emailExistant) {
    erreur.push('Cet email est déjà utilisé');

    // Vérification du mot de passe hashé avec bcrypt
    if (await bcrypt.compare(Utilisateur.password, emailExistant.password)) {
      erreur.push('Vous avez déjà utilisé ce mot de passe auparavant !');
    }
  }

  // Ajouter la vérification d'unicité du nom d'utilisateur
  if (Utilisateur.nom) {
    const nomExistant = await prisma.Utilisateur.findUnique({
      where: { nom: Utilisateur.nom },
    });

    if (nomExistant) {
      erreur.push("Ce nom d'utilisateur est déjà utilisé");
    }
  }

  return erreur;
};
