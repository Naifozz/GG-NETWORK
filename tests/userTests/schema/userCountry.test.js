import { describe, it, expect, vi } from 'vitest';
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

// Schéma de test spécifique pour la validation du pays
const validCountries = ['France', 'Belgique', 'Suisse', 'Corse'];
const countryTestSchema = z.object({
  country: z.enum(validCountries, {
    errorMap: () => ({
      message: 'Votre Pays ne fait pas encore partie de notre liste',
    }),
  }),
});

describe('Validation du pays', () => {
  validCountries.forEach((country) => {
    it(`devrait accepter ${country} comme pays valide`, () => {
      expect(() => countryTestSchema.parse({ country })).not.toThrow();
    });
  });

  const invalidCountries = ['USA', 'Espagne', 'Italie', 'Allemagne', 'Japon'];

  invalidCountries.forEach((country) => {
    it(`devrait rejeter ${country} comme pays invalide`, () => {
      expect(() => countryTestSchema.parse({ country })).toThrow(
        'Votre Pays ne fait pas encore partie de notre liste',
      );
    });
  });
});
