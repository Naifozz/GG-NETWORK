import { describe, test, expect, vi } from 'vitest';
import {
  getAllProfils,
  createProfil,
  getProfilById,
  updateProfil,
  deleteProfil,
} from '../../../src/controllers/profilController';
import * as profilService from '../../../src/services/profilService';

vi.mock('../../../src/services/profilService', () => ({
  getAllProfils: vi.fn(),
  createProfil: vi.fn(),
  getProfilById: vi.fn(),
  updateProfil: vi.fn(),
  deleteProfil: vi.fn(),
}));

describe('Profil Controller', () => {
  describe('getAllProfils', () => {
    test('✅ devrait retourner une liste de profils', async () => {
      // Arrange
      const mockProfils = [{ id: 1, name: 'John Doe' }];
      profilService.getAllProfils.mockResolvedValue(mockProfils);

      const req = {}; // Requête vide, car on teste juste la logique
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getAllProfils(req, res);

      expect(profilService.getAllProfils).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfils);
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      profilService.getAllProfils.mockRejectedValue(
        new Error('Erreur interne'),
      );

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getAllProfils(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la récupération des profils',
        error: 'Erreur interne',
      });
    });
  });

  describe('createProfil', () => {
    test('✅ devrait créer un profil', async () => {
      const mockProfil = { id: 1, name: 'John Doe' };
      profilService.createProfil.mockResolvedValue(mockProfil); // Mock du service

      const req = { body: { data: mockProfil } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await createProfil(req, res);

      expect(profilService.createProfil).toHaveBeenCalledWith(mockProfil);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProfil);
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      const mockData = { name: 'John Doe' };
      profilService.createProfil.mockRejectedValue(
        new Error('Erreur lors de la création'),
      );

      const req = { body: { data: mockData } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await createProfil(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erreur lors de la création du profil',
        error: 'Erreur lors de la création',
      });
    });
  });

  describe('getProfilById', () => {
    test('✅ devrait retourner un profil trouvé', async () => {
      const mockProfil = { id: 1, name: 'John Doe' };
      profilService.getProfilById.mockResolvedValue(mockProfil);

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getProfilById(req, res);

      expect(profilService.getProfilById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfil);
    });

    test("❌ devrait retourner une erreur 404 si le profil n'est pas trouvé", async () => {
      profilService.getProfilById.mockResolvedValue(null);

      const req = { params: { id: '999' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getProfilById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Profil non trouvé' });
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      profilService.getProfilById.mockRejectedValue(
        new Error('Erreur interne'),
      );

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await getProfilById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération du profil avec l'ID",
        error: 'Erreur interne',
      });
    });
  });

  describe('updateProfil', () => {
    test('✅ devrait mettre à jour un profil', async () => {
      const mockProfil = { id: 1, name: 'John Doe Updated' };
      profilService.updateProfil.mockResolvedValue(mockProfil);

      const req = { params: { id: '1' }, body: { data: mockProfil } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await updateProfil(req, res);

      expect(profilService.updateProfil).toHaveBeenCalledWith('1', mockProfil);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProfil);
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      const mockData = { name: 'Updated Name' };
      profilService.updateProfil.mockRejectedValue(
        new Error('Erreur lors de la mise à jour'),
      );

      const req = { params: { id: '1' }, body: { data: mockData } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await updateProfil(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour du profil avec l'ID",
        error: 'Erreur lors de la mise à jour',
      });
    });
  });

  describe('deleteProfil', () => {
    test('✅ devrait supprimer un profil', async () => {
      const mockProfil = { id: 1, name: 'John Doe' };
      profilService.deleteProfil.mockResolvedValue(mockProfil);

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await deleteProfil(req, res);

      expect(profilService.deleteProfil).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profil supprimé avec succès',
      });
    });

    test('❌ devrait retourner une erreur si le service échoue', async () => {
      profilService.deleteProfil.mockRejectedValue(
        new Error('Erreur lors de la suppression'),
      );

      const req = { params: { id: '1' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await deleteProfil(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression du profil avec l'ID",
        error: 'Erreur lors de la suppression',
      });
    });
  });
});
