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

// Schéma de test spécifique pour la validation de l'email
const emailTestSchema = z.object({
  email: z.string().email({ message: "L'email n'est pas valide" }),
});

// Fonction de test pour la validation d'unicité (mock)
const mockValidateEmail = async (Utilisateur) => {
  const prisma = await import('./prisma').then((module) => module.default);
  const erreurs = [];

  // Valider le format de l'email
  try {
    emailTestSchema.parse({ email: Utilisateur.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      erreurs.push(...error.errors.map((err) => err.message));
    }
  }

  // Vérifier si l'email existe déjà
  const utilisateurExistant = await prisma.Utilisateur.findUnique({
    where: { email: Utilisateur.email },
  });

  if (utilisateurExistant) {
    erreurs.push('Cet email est déjà utilisé');
  }

  return erreurs;
};

describe("Validation de l'email", () => {
  // Tests de validation Zod
  describe('Validation du schéma', () => {
    it('devrait accepter un email valide', () => {
      expect(() =>
        emailTestSchema.parse({ email: 'test@example.com' }),
      ).not.toThrow();
    });

    it("devrait rejeter un email sans '@'", () => {
      expect(() => emailTestSchema.parse({ email: 'testexample.com' })).toThrow(
        "L'email n'est pas valide",
      );
    });

    it('devrait rejeter un email sans domaine', () => {
      expect(() => emailTestSchema.parse({ email: 'test@.com' })).toThrow(
        "L'email n'est pas valide",
      );
    });

    it('devrait rejeter un email avec des caractères invalides', () => {
      expect(() =>
        emailTestSchema.parse({ email: 'test@@example.com' }),
      ).toThrow("L'email n'est pas valide");
    });
  });

  // Tests d'unicité
  describe("Vérification d'unicité", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('devrait signaler un email déjà existant', async () => {
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue({
        email: 'test@example.com',
      });

      const Utilisateur = { email: 'test@example.com' };
      const erreurs = await mockValidateEmail(Utilisateur);

      expect(erreurs).toContain('Cet email est déjà utilisé');
    });

    it("devrait permettre la création si l'email est unique", async () => {
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue(null);

      const Utilisateur = { email: 'unique@example.com' };
      const erreurs = await mockValidateEmail(Utilisateur);

      expect(erreurs.length).toBe(0);
    });
  });
});
