import { z } from 'zod';

// Schéma de validation  d'un groupe
const groupeSchema = z.object({
  // Nom du groupe
  nom: z
    .string()
    .min(2, { message: 'Le nom du groupe doit contenir au moins 2 caractères' })
    .max(100, {
      message: 'Le nom du groupe ne peut pas dépasser 100 caractères',
    })
    .trim(),

  // Description optionnelle
  description: z
    .string()
    .max(1000, {
      message: 'La description ne peut pas dépasser 1000 caractères',
    })
    .optional(),

  // Etat du groupe: Public ou Prive
  etat: z
    .enum(['Public', 'Prive'], {
      errorMap: () => ({
        message: 'L\'état du groupe doit être "Public" ou "Prive"',
      }),
    })
    .default('Public'),
});

export const validateGroupe = (data) => {
  const result = groupeSchema.safeParse(data);
  if (!result.success) {
    // Concaténer les messages d'erreur (ou choisir le premier) pour être retourné
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join(', ');
    throw new Error(errorMessage);
  }
  return result.data;
};
