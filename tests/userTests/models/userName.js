import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  utilisateurSchema,
  validateUtilisateur,
} from './src/models/userModels'; // Importez votre schéma de validation

import prisma from './prisma'; // Importez votre instance Prisma

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

describe('Validation du nom utilisateur', () => {
  // Tests de validation Zod
  describe('Validation du schéma', () => {
    it('devrait accepter un nom valide', () => {
      expect(() =>
        utilisateurSchema.parse({
          nom: 'jean123',
          pseudo: 'Pseudo123',
          email: 'unique@example.com',
        }),
      ).not.toThrow();
    });

    it('devrait rejeter un nom trop court', () => {
      expect(() => utilisateurSchema.parse({ nom: 'je' })).toThrow(
        "Le nom d'utilisateur doit avoir au moins 3 caractères",
      );
    });

    it('devrait rejeter un nom avec des majuscules', () => {
      // Utilisez .throws() ou .toThrow() selon votre configuration
      expect(() => utilisateurSchema.parse({ nom: 'JeanDupont' })).toThrow();
    });

    it('devrait rejeter un nom avec des caractères spéciaux non autorisés', () => {
      expect(() => utilisateurSchema.parse({ nom: 'jean-dupont' })).toThrow(
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
      prisma.Utilisateur.findUnique.mockResolvedValue({
        nom: 'jeandupont',
      });

      const Utilisateur = { nom: 'jeandupont' };
      const erreurs = await validateUtilisateur(Utilisateur);

      expect(erreurs).toContain("Ce nom d'utilisateur est déjà utilisé");
    });

    it('devrait permettre la création si le nom est unique', async () => {
      // Simule aucun utilisateur existant
      prisma.Utilisateur.findUnique.mockResolvedValue(null);

      const Utilisateur = {
        nom: 'nomunique',
        pseudo: 'Pseudo123',
        email: 'unique@example.com',
      };
      const erreurs = await validateUtilisateur(Utilisateur);

      expect(erreurs.length).toBe(0);
    });
  });
});
