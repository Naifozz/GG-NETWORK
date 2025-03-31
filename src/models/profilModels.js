import { z } from 'zod';

const profilSchema = z.object({
  ID_Profil: z.number().int().optional(), // Généré automatiquement
  Description: z.string().min(1, 'La description est requise'),
  Img: z.string().optional(),
  ID_Utilisateur: z.number().int().min(1, 'ID Utilisateur invalide'),
  ID_Connexion: z.string().optional(),
  Profil_Privacy: z.boolean(),
  Statut: z.string().min(1, 'Le statut est requis'),
  Img_Banner: z.string().optional(),
});

function validateProfil(data) {
  try {
    return profilSchema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      //transforme les erreurs en format lisible
      const errorDetails = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      throw new Error(JSON.stringify(errorDetails));
    }
    throw error;
  }
}

// Exportations
export { profilSchema, validateProfil };
