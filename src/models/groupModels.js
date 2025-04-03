import { z } from 'zod';

// Schéma de validation  d'un groupe
const groupeSchema = z.object({
  // Nom du groupe
  Nom: z
    .string()
    .min(2, { message: 'Le nom du groupe doit contenir au moins 2 caractères' })
    .max(100, {
      message: 'Le nom du groupe ne peut pas dépasser 100 caractères',
    })
    .trim(),

  // Description optionnelle
  Description: z
    .string()
    .max(1000, {
      message: 'La description ne peut pas dépasser 1000 caractères',
    })
    .optional(),

  // Etat du groupe: true (Public) ou false (Privé)
  Etat: z
    .boolean({
      errorMap: () => ({
        message:
          "L'état du groupe doit être un boolean (true pour Public, false pour Privé)",
      }),
    })
    .default(true), // Par défaut, l'état est "Public" (true)

  // ID de l'utilisateur qui a créé le groupe
  ID_Utilisateur: z
    .number({
      required_error: "L'ID de l'utilisateur est requis",
      invalid_type_error: "L'ID de l'utilisateur doit être un nombre",
    })
    .int({ message: "L'ID de l'utilisateur doit être un entier" })
    .positive({ message: "L'ID de l'utilisateur doit être un entier positif" }),
});

export const validateGroupe = async (data) => {
  const result = groupeSchema.safeParse(data);
  if (!result.success) {
    console.error('Validation errors:', result.error.issues);
    // Concaténer les messages d'erreur (ou choisir le premier) pour être retourné
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join(', ');

    throw new Error(errorMessage);
  }
  return result.data;
};
