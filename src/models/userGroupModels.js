import { z } from 'zod';

// Schéma de validation pour UserGroupe
const userGroupSchema = z.object({
  // ID de l'utilisateur
  ID_Utilisateur: z
    .number({
      required_error: "L'ID de l'utilisateur est requis",
      invalid_type_error: "L'ID de l'utilisateur doit être un nombre",
    })
    .int({ message: "L'ID de l'utilisateur doit être un entier" })
    .positive({ message: "L'ID de l'utilisateur doit être un entier positif" }),

  // ID du groupe
  ID_Group: z
    .number({
      required_error: "L'ID du groupe est requis",
      invalid_type_error: "L'ID du groupe doit être un nombre",
    })
    .int({ message: "L'ID du groupe doit être un entier" })
    .positive({ message: "L'ID du groupe doit être un entier positif" }),

  // Statut de modérateur (optionnel, par défaut false)
  IsMod: z
    .boolean({
      errorMap: () => ({
        message: 'Le statut de modérateur doit être un boolean (true ou false)',
      }),
    })
    .default(false), // Par défaut, l'utilisateur n'est pas modérateur
});

// Fonction de validation pour UserGroupe
export const validateUserGroup = async (data) => {
  const result = userGroupSchema.safeParse(data);
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
