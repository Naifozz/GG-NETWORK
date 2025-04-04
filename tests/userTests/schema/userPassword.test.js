import { describe, it, expect, beforeEach, vi } from 'vitest';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

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

// Schéma de test spécifique pour la validation du mot de passe
const passwordTestSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/[A-Z]/, {
      message: 'Le mot de passe doit contenir au moins une lettre majuscule',
    })
    .regex(/[0-9]/, {
      message: 'Le mot de passe doit contenir au moins un chiffre',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message:
        'Le mot de passe doit contenir au moins un caractère spécial (ex: !@#$%^&*)',
    }),
});

// Fonction de test pour la validation d'unicité (mock)
const mockValidatePassword = async (Utilisateur) => {
  const prisma = await import('./prisma').then((module) => module.default);
  const erreurs = [];

  // Valider le format du mot de passe
  try {
    passwordTestSchema.parse({ password: Utilisateur.password });
  } catch (error) {
    if (error instanceof z.ZodError) {
      erreurs.push(...error.errors.map((err) => err.message));
    }
  }

  // Vérifier si le mot de passe a déjà été utilisé
  const utilisateurExistant = await prisma.Utilisateur.findUnique({
    where: { email: Utilisateur.email },
  });

  if (utilisateurExistant) {
    const match = await bcrypt.compare(
      Utilisateur.password,
      utilisateurExistant.password,
    );
    if (match) {
      erreurs.push('Vous avez déjà utilisé ce mot de passe auparavant !');
    }
  }

  return erreurs;
};

describe('Validation du mot de passe', () => {
  // Tests de validation Zod
  describe('Validation du schéma', () => {
    it('devrait accepter un mot de passe valide', () => {
      expect(() =>
        passwordTestSchema.parse({ password: 'Password123!' }),
      ).not.toThrow();
    });

    it('devrait rejeter un mot de passe trop court', () => {
      expect(() => passwordTestSchema.parse({ password: 'short' })).toThrow(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    });

    it('devrait rejeter un mot de passe sans majuscules', () => {
      expect(() =>
        passwordTestSchema.parse({ password: 'password123!' }),
      ).toThrow('Le mot de passe doit contenir au moins une lettre majuscule');
    });

    it('devrait rejeter un mot de passe sans chiffres', () => {
      expect(() => passwordTestSchema.parse({ password: 'Password!' })).toThrow(
        'Le mot de passe doit contenir au moins un chiffre',
      );
    });

    it('devrait rejeter un mot de passe sans caractères spéciaux', () => {
      expect(() =>
        passwordTestSchema.parse({ password: 'Password123' }),
      ).toThrow(
        'Le mot de passe doit contenir au moins un caractère spécial (ex: !@#$%^&*)',
      );
    });
  });

  // Tests d'unicité
  describe("Vérification d'unicité", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('devrait signaler un mot de passe déjà utilisé', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue({
        email: 'test@example.com',
        password: hashedPassword,
      });

      const Utilisateur = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const erreurs = await mockValidatePassword(Utilisateur);

      expect(erreurs).toContain(
        'Vous avez déjà utilisé ce mot de passe auparavant !',
      );
    });

    it('devrait permettre la création si le mot de passe est unique', async () => {
      const prisma = await import('./prisma').then((module) => module.default);
      prisma.Utilisateur.findUnique.mockResolvedValue(null);

      const Utilisateur = { password: 'UniquePass123!' };
      const erreurs = await mockValidatePassword(Utilisateur);

      expect(erreurs.length).toBe(0);
    });
  });
});
