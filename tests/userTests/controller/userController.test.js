import { describe, test, expect, vi } from 'vitest';
import {
  getAllUtilisateurs,
  createUtilisateurs,
  getUtilisateursById,
  updateUtilisateurs,
  deleteUtilisateurs,
} from '../../../src/controllers/userController';
import * as userService from '../../../src/services/userService';

vi.mock('../../../src/services/userService', () => ({
  getAllUtilisateurs: vi.fn(),
  createUtilisateurs: vi.fn(),
  getUtilisateursById: vi.fn(),
  updateUtilisateurs: vi.fn(),
  deleteUtilisateurs: vi.fn(),
}));

describe('User Controller', () => {
  describe('getAllUtilisateurs', () => {
    test("✅ devrait retourner une liste d'Utilisateur", async () => {
      // Arrange
      const mockUtilisateur = [{ id: 1, name: 'John Doe' }];
      userService.getAllUtilisateurs.mockResolvedValue(mockUtilisateur);

      const req = {}; // Requête vide, car on teste juste la logique
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getAllUtilisateurs(req, res);

      expect(userService.getAllUtilisateurs).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUtilisateur);
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      userService.getAllUtilisateurs.mockRejectedValue(
        new Error('Erreur interne'),
      );

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getAllUtilisateurs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la récupération des Utilisateurs',
        error: 'Erreur interne',
      });
    });
  });

  describe('createUtilisateurs', () => {
    test('✅ devrait créer un Utilisateur', async () => {
      const mockUtilisateur = { id: 1, name: 'John Doe' };
      userService.createUtilisateurs.mockResolvedValue(mockUtilisateur); // Mock du service

      const req = { body: { data: mockUtilisateur } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await createUtilisateurs(req, res);

      expect(userService.createUtilisateurs).toHaveBeenCalledWith(
        mockUtilisateur,
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUtilisateur);
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      const mockData = { name: 'John Doe' };
      userService.createUtilisateurs.mockRejectedValue(
        new Error('Erreur lors de la création'),
      );

      const req = { body: { data: mockData } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await createUtilisateurs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la création de l'Utilisateur",
        error: 'Erreur lors de la création',
      });
    });
  });

  describe('getUtilisateursById', () => {
    test('✅ devrait retourner un profil trouvé', async () => {
      const mockUtilisateur = { id: 1, name: 'John Doe' };
      userService.getUtilisateursById.mockResolvedValue(mockUtilisateur);

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getUtilisateursById(req, res);

      expect(userService.getUtilisateursById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUtilisateur);
    });

    test("❌ devrait retourner une erreur 404 si l'Utilisateur n'est pas trouvé", async () => {
      userService.getUtilisateursById.mockResolvedValue(null);

      const req = { params: { id: '999' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getUtilisateursById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur non trouvé',
      });
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      userService.getUtilisateursById.mockRejectedValue(
        new Error('Erreur interne'),
      );

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getUtilisateursById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération de l'Utilisateur avec l'ID",
        error: 'Erreur interne',
      });
    });
  });

  describe('updateUtilisateurs', () => {
    test('✅ devrait mettre à jour un Utilisateur', async () => {
      const mockUtilisateur = { id: 1, name: 'John Doe Updated' };
      userService.updateUtilisateurs.mockResolvedValue(mockUtilisateur);

      const req = { params: { id: '1' }, body: { data: mockUtilisateur } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await updateUtilisateurs(req, res);

      expect(userService.updateUtilisateurs).toHaveBeenCalledWith(
        '1',
        mockUtilisateur,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUtilisateur);
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      const mockData = { name: 'Updated Name' };
      userService.updateUtilisateurs.mockRejectedValue(
        new Error('Erreur lors de la mise à jour'),
      );

      const req = { params: { id: '1' }, body: { data: mockData } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await updateUtilisateurs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour de l'Utilisateur avec l'ID",
        error: 'Erreur lors de la mise à jour',
      });
    });
  });

  describe('deleteUtilisateurs', () => {
    test('✅ devrait supprimer un Utilisateur', async () => {
      const mockUtilisateur = { id: 1, name: 'John Doe' };
      userService.deleteUtilisateurs.mockResolvedValue(mockUtilisateur);

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await deleteUtilisateurs(req, res);

      expect(userService.deleteUtilisateurs).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur supprimé avec succès',
      });
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      userService.deleteUtilisateurs.mockRejectedValue(
        new Error('Erreur lors de la suppression'),
      );

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await deleteUtilisateurs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression de l'Utilisateur avec l'ID",
        error: 'Erreur lors de la suppression',
      });
    });
  });
});
