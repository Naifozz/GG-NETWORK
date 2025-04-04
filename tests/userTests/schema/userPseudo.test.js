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

// Schéma de test spécifique pour la validation du pseudo
const pseudoTestSchema = z.object({
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
});

// Fonction de test pour la validation d'unicité (mock)
const mockValidateUtilisateur = async (Utilisateur) => {
  const prisma = await import('./prisma').then((module) => module.default);
  const erreur = [];

  // Valider le format du pseudo
  try {
    pseudoTestSchema.parse({ pseudo: Utilisateur.pseudo });
  } catch (error) {
    if (error instanceof z.ZodError) {
      erreur.push(...error.errors.map((err) => err.message));
    }
  }

  // Vérifier si le pseudo existe déjà
  const utilisateurExistant = await prisma.Utilisateur.findUnique({
    where: { pseudo: Utilisateur.pseudo },
  });

  if (utilisateurExistant) {
    erreur.push('Ce pseudo est déjà utilisé');
  }

  return erreur;
};

describe('Validation du pseudo', () => {
  // Tests de validation Zod
  describe('Validation du schéma', () => {
    it('devrait accepter un pseudo valide', () => {
      expect(() =>
        pseudoTestSchema.parse({ pseudo: 'Pseudo123' }),
      ).not.toThrow();
    });

    it('devrait rejeter un pseudo trop court', () => {
      expect(() => pseudoTestSchema.parse({ pseudo: 'ab' })).toThrow(
        'Le pseudo doit avoir au moins 3 caractères',
      );
    });

    it('devrait rejeter un pseudo trop long', () => {
      expect(() => pseudoTestSchema.parse({ pseudo: 'a'.repeat(26) })).toThrow(
        'Le pseudo ne peut pas dépasser 25 caractères',
      );
    });

    it('devrait rejeter un pseudo avec des caractères non autorisés', () => {
      expect(() => pseudoTestSchema.parse({ pseudo: 'Pseudo$%!' })).toThrow(
        'Le pseudo ne peut contenir que des lettres, chiffres et certains caractères spéciaux (@, !, _, ., -)',
      );
    });
  });

  // Tests d'unicité
  describe("Vérification d'unicité", () => {
    beforeEach(() => {
      // Réinitialise le mock avant chaque test
      vi.resetAllMocks();
    });

    it('devrait signaler un pseudo déjà existant', async () => {
      // Simule un utilisateur existant
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue({
        pseudo: 'PseudoTest',
      });

      const Utilisateur = { pseudo: 'PseudoTest' };
      const erreurs = await mockValidateUtilisateur(Utilisateur);

      expect(erreurs).toContain('Ce pseudo est déjà utilisé');
    });

    it('devrait permettre la création si le pseudo est unique', async () => {
      // Simule aucun utilisateur existant
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue(null);

      const Utilisateur = { pseudo: 'PseudoUnique' };
      const erreurs = await mockValidateUtilisateur(Utilisateur);

      expect(erreurs.length).toBe(0);
    });
  });
});
