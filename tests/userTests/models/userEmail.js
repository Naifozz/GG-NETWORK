import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  utilisateurSchema,
  validateUtilisateur,
} from './src/models/userModels';
import prisma from './prisma';

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

describe('Validation de l’email', () => {
  // Tests de validation Zod
  describe('Validation du schéma', () => {
    it('devrait accepter un email valide', () => {
      expect(() =>
        utilisateurSchema.parse({
          nom: 'jean123',
          pseudo: 'Pseudo123',
          email: 'test@example.com',
        }),
      ).not.toThrow();
    });

    it("devrait rejeter un email sans '@'", () => {
      expect(() =>
        utilisateurSchema.parse({ email: 'testexample.com' }),
      ).toThrow("L'email n'est pas valide");
    });

    it('devrait rejeter un email sans domaine', () => {
      expect(() => utilisateurSchema.parse({ email: 'test@.com' })).toThrow(
        "L'email n'est pas valide",
      );
    });

    it('devrait rejeter un email avec des caractères invalides', () => {
      expect(() =>
        utilisateurSchema.parse({ email: 'test@@example.com' }),
      ).toThrow("L'email n'est pas valide");
    });
  });

  // Tests d'unicité
  describe("Vérification d'unicité", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('devrait signaler un email déjà existant', async () => {
      // Simuler qu'un utilisateur avec cet email existe déjà
      prisma.Utilisateur.findUnique.mockResolvedValue({
        nom: 'jean123',
        pseudo: 'Pseudo123',
        email: 'test@example.com',
      });

      const utilisateur = { email: 'test@example.com' };
      const erreurs = await validateUtilisateur(utilisateur);

      expect(erreurs).toContain('Cet email est déjà utilisé');
    });

    it("devrait permettre la création si l'email est unique", async () => {
      prisma.Utilisateur.findUnique.mockResolvedValue(null);

      const utilisateur = {
        nom: 'jean122',
        pseudo: 'Pseudo123',
        email: 'unique@example.com',
      };
      const erreurs = await validateUtilisateur(utilisateur);

      expect(erreurs.length).toBe(0);
    });
  });
});
