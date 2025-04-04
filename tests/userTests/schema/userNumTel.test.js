import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

// Configuration des préfixes téléphoniques par pays
const countryPhonePrefixes = {
  France: '+33',
  Belgique: '+32',
  Suisse: '+41',
  Corse: '+33',
};

// Schéma de test autonome sans dépendance externe
const phoneTestSchema = z
  .object({
    country: z.enum(['France', 'Belgique', 'Suisse', 'Corse'], {
      message: 'Votre Pays ne fait pas encore partie de notre liste',
    }),
    numTel: z
      .string()
      .regex(/^\+\d{10,15}$/, { message: 'Numéro de téléphone invalide' }),
  })
  .refine(
    (data) => {
      const expectedPrefix = countryPhonePrefixes[data.country];
      return data.numTel.startsWith(expectedPrefix);
    },
    {
      message: 'Numéro de téléphone invalide',
      path: ['numTel'],
    },
  );

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

describe('Validation du numéro de téléphone en fonction du pays', () => {
  const validNumbers = [
    { country: 'France', numTel: '+33612345678' },
    { country: 'Belgique', numTel: '+32476123456' },
    { country: 'Suisse', numTel: '+41791234567' },
    { country: 'Corse', numTel: '+33698765432' }, // Corse utilise le +33 comme la France
  ];

  validNumbers.forEach(({ country, numTel }) => {
    it(`devrait accepter un numéro valide pour ${country}`, () => {
      expect(() => phoneTestSchema.parse({ country, numTel })).not.toThrow();
    });
  });

  const invalidNumbers = [
    {
      country: 'France',
      numTel: '+32476123456',
      message: 'Numéro de téléphone invalide',
    },
    {
      country: 'Belgique',
      numTel: '+33612345678',
      message: 'Numéro de téléphone invalide',
    },
    {
      country: 'Suisse',
      numTel: '+33698765432',
      message: 'Numéro de téléphone invalide',
    },
    {
      country: 'Corse',
      numTel: '+32476123456',
      message: 'Numéro de téléphone invalide',
    },
    {
      country: 'France',
      numTel: '0612345678',
      message: 'Numéro de téléphone invalide',
    }, // Manque le +33
    {
      country: 'Belgique',
      numTel: '0476123456',
      message: 'Numéro de téléphone invalide',
    }, // Manque le +32
    {
      country: 'Suisse',
      numTel: '+411234567',
      message: 'Numéro de téléphone invalide',
    }, // Mauvais format
  ];

  invalidNumbers.forEach(({ country, numTel, message }) => {
    it(`devrait rejeter un numéro invalide pour ${country}`, () => {
      expect(() => phoneTestSchema.parse({ country, numTel })).toThrow(message);
    });
  });
});
