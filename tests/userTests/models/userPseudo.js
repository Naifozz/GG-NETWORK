import { describe, it, expect, vi } from 'vitest';
import { utilisateurSchema } from './src/models/userModels';

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

describe('Validation du pseudo', () => {
  // Tests de validation Zod
  describe('Validation du schéma', () => {
    it('devrait accepter un pseudo valide', () => {
      expect(() =>
        utilisateurSchema.parse({
          nom: 'jean123',
          pseudo: 'Pseudo123',
          email: 'unique@example.com',
        }),
      ).not.toThrow();
    });

    it('devrait rejeter un pseudo trop court', () => {
      expect(() => utilisateurSchema.parse({ pseudo: 'ab' })).toThrow(
        'Le pseudo doit avoir au moins 3 caractères',
      );
    });

    it('devrait rejeter un pseudo trop long', () => {
      expect(() => utilisateurSchema.parse({ pseudo: 'a'.repeat(26) })).toThrow(
        'Le pseudo ne peut pas dépasser 25 caractères',
      );
    });

    it('devrait rejeter un pseudo avec des caractères non autorisés', () => {
      expect(() => utilisateurSchema.parse({ pseudo: 'Pseudo$%!' })).toThrow(
        'Le pseudo ne peut contenir que des lettres, chiffres et certains caractères spéciaux (@, !, _, ., -)',
      );
    });
  });
});
