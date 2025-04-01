import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  utilisateurSchema,
  validateUtilisateur,
} from './src/models/userModels';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

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

describe('Validation du mot de passe', () => {
  describe('Validation du schéma', () => {
    it('devrait accepter un mot de passe valide', () => {
      expect(() =>
        utilisateurSchema
          .pick({ password: true })
          .parse({ password: 'Password123!' }),
      ).not.toThrow();
    });
  });

  it('devrait rejeter un mot de passe trop court', () => {
    expect(() =>
      utilisateurSchema.pick({ password: true }).parse({ password: 'short' }),
    ).toThrow('Le mot de passe doit contenir au moins 8 caractères');
  });

  it('devrait rejeter un mot de passe sans majuscules', () => {
    expect(() =>
      utilisateurSchema
        .pick({ password: true })
        .parse({ password: 'password123!' }),
    ).toThrow('Le mot de passe doit contenir au moins une lettre majuscule');
  });

  it('devrait rejeter un mot de passe sans chiffres', () => {
    expect(() =>
      utilisateurSchema
        .pick({ password: true })
        .parse({ password: 'Password!' }),
    ).toThrow('Le mot de passe doit contenir au moins un chiffre');
  });

  it('devrait rejeter un mot de passe sans caractères spéciaux', () => {
    expect(() =>
      utilisateurSchema
        .pick({ password: true })
        .parse({ password: 'Password123' }),
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

    // Simuler un utilisateur en base avec un mot de passe haché
    prisma.Utilisateur.findUnique.mockResolvedValue({
      nom: 'jean123',
      pseudo: 'Pseudo123',
      email: 'test@example.com',
      password: hashedPassword,
    });

    const Utilisateur = { email: 'test@example.com', password: 'Password123!' };
    const erreurs = await validateUtilisateur(Utilisateur);

    expect(erreurs).toContain(
      'Vous avez déjà utilisé ce mot de passe auparavant !',
    );
  });
});
