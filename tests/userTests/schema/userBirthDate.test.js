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

// Définition du schéma de test pour la date de naissance
const birthDateTestSchema = z.object({
  birthDate: z.string().refine((date) => {
    const birthDate = new Date(date);
    const now = new Date();
    const minDate = new Date();
    minDate.setFullYear(now.getFullYear() - 120);

    if (birthDate > now) {
      throw new Error('La date de naissance ne peut pas être dans le futur');
    }
    if (birthDate < minDate) {
      throw new Error(
        'La date de naissance ne peut pas être plus ancienne que 120 ans',
      );
    }
    return true;
  }),
});

describe('Validation de la date de naissance', () => {
  describe('Validation du schéma', () => {
    it('devrait accepter une date de naissance valide', () => {
      expect(() =>
        birthDateTestSchema.parse({ birthDate: '2000-01-01' }),
      ).not.toThrow();
    });
  });

  it('devrait rejeter une date de naissance future', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24)
      .toISOString()
      .split('T')[0];
    expect(() => birthDateTestSchema.parse({ birthDate: futureDate })).toThrow(
      'La date de naissance ne peut pas être dans le futur',
    );
  });

  it('devrait rejeter une date de naissance trop ancienne', () => {
    const oldDate = '1900-01-01';
    expect(() => birthDateTestSchema.parse({ birthDate: oldDate })).toThrow(
      'La date de naissance ne peut pas être plus ancienne que 120 ans',
    );
  });
});
