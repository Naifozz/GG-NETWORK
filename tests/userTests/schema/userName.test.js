import { describe, it, expect, beforeEach, vi } from 'vitest';

import { z } from 'zod';

// Mock de Prisma pour les tests
vi.mock('./prisma', () => {
  return {
    __esModule: true,
    default: {
      Utilisateur: {
        findUnique: vi.fn(),
      },
    },
  };
});

// Schéma de test spécifique pour la validation du nom
const nameTestSchema = z.object({
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
});

// Fonction de test pour la validation d'unicité (mock)
const mockValidateUtilisateur = async (Utilisateur) => {
  const prisma = await import('./prisma').then((module) => module.default);
  const erreur = [];

  // Valider le format du nom
  try {
    nameTestSchema.parse({ nom: Utilisateur.nom });
  } catch (error) {
    if (error instanceof z.ZodError) {
      erreur.push(...error.errors.map((err) => err.message));
    }
  }

  // Vérifier si le nom existe déjà
  const utilisateurExistant = await prisma.Utilisateur.findUnique({
    where: { nom: Utilisateur.nom },
  });

  if (utilisateurExistant) {
    erreur.push("Ce nom d'utilisateur est déjà utilisé");
  }

  return erreur;
};

describe('Validation du nom utilisateur', () => {
  // Tests de validation Zod
  describe('Validation du schéma', () => {
    it('devrait accepter un nom valide', () => {
      expect(() => nameTestSchema.parse({ nom: 'jean123' })).not.toThrow();
    });

    it('devrait rejeter un nom trop court', () => {
      expect(() => nameTestSchema.parse({ nom: 'je' })).toThrow(
        "Le nom d'utilisateur doit avoir au moins 3 caractères",
      );
    });

    it('devrait rejeter un nom avec des majuscules', () => {
      expect(() => nameTestSchema.parse({ nom: 'JeanDupont' })).toThrow(
        "Le nom d'utilisateur ne peut contenir que des lettres minuscules, des chiffres et des underscores",
      );
    });

    it('devrait rejeter un nom avec des caractères spéciaux non autorisés', () => {
      expect(() => nameTestSchema.parse({ nom: 'jean-dupont' })).toThrow(
        "Le nom d'utilisateur ne peut contenir que des lettres minuscules, des chiffres et des underscores",
      );
    });
  });

  // Tests d'unicité
  describe("Vérification d'unicité", () => {
    beforeEach(() => {
      // Réinitialise le mock avant chaque test
      vi.resetAllMocks();
    });

    it('devrait signaler un nom déjà existant', async () => {
      // Simule un utilisateur existant
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue({
        nom: 'jeandupont',
      });

      const Utilisateur = { nom: 'jeandupont' };
      const erreurs = await mockValidateUtilisateur(Utilisateur);

      expect(erreurs).toContain("Ce nom d'utilisateur est déjà utilisé");
    });

    it('devrait permettre la création si le nom est unique', async () => {
      // Simule aucun utilisateur existant
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue(null);

      const Utilisateur = { nom: 'nomunique' };
      const erreurs = await mockValidateUtilisateur(Utilisateur);

      expect(erreurs.length).toBe(0);
    });
  });
});
