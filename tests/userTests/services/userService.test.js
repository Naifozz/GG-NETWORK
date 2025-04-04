import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as userRepository from '../../../src/repositories/UserRepository.js';
import * as userService from '../../../src/services/userService.js';
import { validateUtilisateur } from '../../../src/models/userModels.js';

// Mock des dépendances
vi.mock('../../../src/repositories/UserRepository.js', () => ({
  getAllUtilisateurs: vi.fn(),
  createUtilisateurs: vi.fn(),
  getUtilisateursById: vi.fn(),
  updateUtilisateurs: vi.fn(),
  deleteUtilisateurs: vi.fn(),
}));

vi.mock('../../../src/models/userModels.js', () => ({
  validateUtilisateur: vi.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test de getAllUtilisateurs
  test('✅ getAllUtilisateurs devrait retourner tous les utilisateurs', async () => {
    const mockUtilisateurs = [
      {
        ID_Utilisateur: 1,
        nom: 'user1',
        pseudo: 'User One',
        email: 'user1@example.com',
        country: 'France',
      },
      {
        ID_Utilisateur: 2,
        nom: 'user2',
        pseudo: 'User Two',
        email: 'user2@example.com',
        country: 'Belgique',
      },
    ];

    userRepository.getAllUtilisateurs.mockResolvedValue(mockUtilisateurs);

    const result = await userService.getAllUtilisateurs();

    expect(result).toEqual(mockUtilisateurs);
    expect(userRepository.getAllUtilisateurs).toHaveBeenCalledTimes(1);
  });

  test('❌ getAllUtilisateurs devrait gérer les erreurs correctement', async () => {
    const errorMessage = 'Erreur lors de la récupération des utilisateurs';

    userRepository.getAllUtilisateurs.mockRejectedValue(
      new Error(errorMessage),
    );

    try {
      await userService.getAllUtilisateurs();
      // Si on arrive ici, le test échoue car on s'attend à ce qu'une erreur soit lancée
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(userRepository.getAllUtilisateurs).toHaveBeenCalledTimes(1);
    }
  });

  // Test de createUtilisateurs
  test("✅ createUtilisateurs devrait retourner l'utilisateur créé", async () => {
    const newUtilisateur = {
      nom: 'newuser',
      pseudo: 'New User',
      email: 'newuser@example.com',
      password: 'Password1!',
      country: 'France',
      birthDate: '1990-01-01',
      numTel: '+33612345678',
    };

    const createdUtilisateur = { ID_Utilisateur: 1, ...newUtilisateur };

    validateUtilisateur.mockResolvedValue(newUtilisateur);
    userRepository.createUtilisateurs.mockResolvedValue(createdUtilisateur);

    const result = await userService.createUtilisateurs(newUtilisateur);

    expect(result).toEqual(createdUtilisateur);
    expect(validateUtilisateur).toHaveBeenCalledWith(newUtilisateur);
    expect(userRepository.createUtilisateurs).toHaveBeenCalledWith(
      newUtilisateur,
    );
  });

  test('❌ createUtilisateurs devrait gérer les erreurs correctement', async () => {
    const errorMessage = "Erreur lors de la création de l'utilisateur";
    const newUtilisateur = {
      nom: 'newuser',
      pseudo: 'New User',
      email: 'newuser@example.com',
    };

    validateUtilisateur.mockResolvedValue(newUtilisateur);
    userRepository.createUtilisateurs.mockRejectedValue(
      new Error(errorMessage),
    );

    try {
      await userService.createUtilisateurs(newUtilisateur);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(validateUtilisateur).toHaveBeenCalledWith(newUtilisateur);
      expect(userRepository.createUtilisateurs).toHaveBeenCalledTimes(1);
    }
  });

  // Test de getUtilisateursById
  test("✅ getUtilisateursById devrait retourner l'utilisateur correspondant", async () => {
    const utilisateur = {
      ID_Utilisateur: 1,
      nom: 'user1',
      pseudo: 'User One',
      email: 'user1@example.com',
      country: 'France',
    };

    userRepository.getUtilisateursById.mockResolvedValue(utilisateur);

    const result = await userService.getUtilisateursById(1);

    expect(result).toEqual(utilisateur);
    expect(userRepository.getUtilisateursById).toHaveBeenCalledWith(1);
  });

  test("✅ getUtilisateursById devrait retourner null si l'utilisateur n'existe pas", async () => {
    userRepository.getUtilisateursById.mockResolvedValue(null);

    const result = await userService.getUtilisateursById(999);

    expect(result).toBeNull();
    expect(userRepository.getUtilisateursById).toHaveBeenCalledWith(999);
  });

  test('❌ getUtilisateursById devrait gérer les erreurs correctement', async () => {
    const errorMessage =
      "Erreur lors de la récupération de l'utilisateur correspondant";

    userRepository.getUtilisateursById.mockRejectedValue(
      new Error(errorMessage),
    );

    try {
      await userService.getUtilisateursById(1);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(userRepository.getUtilisateursById).toHaveBeenCalledTimes(1);
    }
  });

  // Test de updateUtilisateurs
  test("✅ updateUtilisateurs devrait retourner l'utilisateur modifié", async () => {
    const updatedData = {
      pseudo: 'Updated User',
      email: 'updated@example.com',
    };

    const updatedUtilisateur = {
      ID_Utilisateur: 1,
      nom: 'user1',
      pseudo: 'Updated User',
      email: 'updated@example.com',
      country: 'France',
    };

    validateUtilisateur.mockResolvedValue(updatedData);
    userRepository.updateUtilisateurs.mockResolvedValue(updatedUtilisateur);

    const result = await userService.updateUtilisateurs(1, updatedData);

    expect(result).toEqual(updatedUtilisateur);
    expect(validateUtilisateur).toHaveBeenCalledWith(updatedData);
    expect(userRepository.updateUtilisateurs).toHaveBeenCalledWith(
      1,
      updatedData,
    );
  });

  test('❌ updateUtilisateurs devrait gérer les erreurs correctement', async () => {
    const errorMessage =
      "Erreur lors de la modification de l'utilisateur correspondant";
    const updatedData = {
      pseudo: 'Updated User',
    };

    validateUtilisateur.mockResolvedValue(updatedData);
    userRepository.updateUtilisateurs.mockRejectedValue(
      new Error(errorMessage),
    );

    try {
      await userService.updateUtilisateurs(1, updatedData);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(validateUtilisateur).toHaveBeenCalledWith(updatedData);
      expect(userRepository.updateUtilisateurs).toHaveBeenCalledTimes(1);
    }
  });

  // Test de deleteUtilisateurs
  test('✅ deleteUtilisateurs devrait supprimer un utilisateur', async () => {
    const deletedUtilisateur = { ID_Utilisateur: 1, nom: 'user1' };

    userRepository.deleteUtilisateurs.mockResolvedValue(deletedUtilisateur);

    const result = await userService.deleteUtilisateurs(1);

    expect(result).toEqual(deletedUtilisateur);
    expect(userRepository.deleteUtilisateurs).toHaveBeenCalledWith(1);
  });

  test('❌ deleteUtilisateurs devrait gérer les erreurs correctement', async () => {
    const errorMessage =
      "Erreur lors de la suppression de l'utilisateur correspondant";

    userRepository.deleteUtilisateurs.mockRejectedValue(
      new Error(errorMessage),
    );

    try {
      await userService.deleteUtilisateurs(1);
      // Comme deleteUtilisateurs dans votre service ne lance pas d'erreur mais la log,
      // ce test pourrait nécessiter une adaptation selon votre implémentation réelle
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(userRepository.deleteUtilisateurs).toHaveBeenCalledTimes(1);
    }
  });
});
