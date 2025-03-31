import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as profilRepository from '../../../src/repositories/profilRepository.js';
import * as profilService from '../../../src/services/ProfilService.js';

vi.mock('../../../src/repositories/profilRepository.js', () => ({
  getAllProfils: vi.fn(),
  createProfil: vi.fn(),
  getProfilById: vi.fn(),
  updateProfil: vi.fn(),
  deleteProfil: vi.fn(),
}));

describe('ProfilService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //Verif de l'execution du repo renvoyée
  test('✅ getAllProfils devrait retourner tous les profils', async () => {
    const mockProfils = [
      {
        ID_Profil: 1,
        Description: 'Profil 1',
        Profil_Privacy: true,
        Statut: 'Actif',
      },
      {
        ID_Profil: 2,
        Description: 'Profil 2',
        Profil_Privacy: false,
        Statut: 'Inactif',
      },
    ];

    profilRepository.getAllProfils.mockResolvedValue(mockProfils);

    const result = await profilService.getAllProfils();

    expect(result).toEqual(mockProfils);
    expect(profilRepository.getAllProfils).toHaveBeenCalledTimes(1);
  });

  //Verif de l'erreur renvoyée
  test('❌ getAllProfils devrait gérer les erreurs correctement', async () => {
    const errorMessage = 'Erreur lors de la récupération des profils';

    profilRepository.getAllProfils.mockRejectedValue(new Error(errorMessage));

    try {
      await profilService.getAllProfils();
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(profilRepository.getAllProfils).toHaveBeenCalledTimes(1);
    }
  });

  test('✅ createProfil devrait retourner le profil créé', async () => {
    const newProfil = {
      ID_Profil: 1,
      ID_Utilisateur: 1,
      Description: 'New Profil',
      ID_Connexion: 'New Profil',
      Profil_Privacy: true,
      Statut: 'Actif',
    };
    const createdProfil = { ID_Profil: 1, ...newProfil };

    profilRepository.createProfil.mockResolvedValue(createdProfil);

    const result = await profilService.createProfil(newProfil);

    expect(result).toEqual(createdProfil);
    expect(profilRepository.createProfil).toHaveBeenCalledWith(newProfil);
  });

  test('❌ createProfil devrait gérer les erreurs correctement', async () => {
    const errorMessage = 'Erreur lors de la création du profil';

    const newProfil = {
      Description: 'Test Profil',
      Profil_Privacy: true,
      Statut: 'Actif',
      ID_Utilisateur: 123,
    };

    profilRepository.createProfil.mockRejectedValue(new Error(errorMessage));

    try {
      await profilService.createProfil(newProfil);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(profilRepository.createProfil).toHaveBeenCalledTimes(1);
    }
  });

  test('✅ getProfilById devrais retourner le profil correspondant', async () => {
    const profil = {
      ID_Profil: 1,
      ID_Utilisateur: 1,
      Description: 'Profil 1',
      Profil_Privacy: true,
      Statut: 'Actif',
    };

    profilRepository.getProfilById.mockResolvedValue(profil);

    const result = await profilService.getProfilById(1);

    expect(result).toEqual(profil);
    expect(profilRepository.getProfilById).toHaveBeenCalledWith(1);
  });

  test('❌ getProfilById devrait gérer les erreurs correctement', async () => {
    const errorMessage =
      'Erreur lors de la récupération du profil correspondant';

    profilRepository.getProfilById.mockRejectedValue(new Error(errorMessage));

    try {
      await profilService.getProfilById();
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(profilRepository.getProfilById).toHaveBeenCalledTimes(1);
    }
  });

  test('✅ updateProfil devrais retourner le profil modifié', async () => {
    const updatedData = {
      Description: 'Updated Profil',
      Profil_Privacy: true,
      Statut: 'Actif',
      ID_Utilisateur: 152,
    };

    const updatedProfil = {
      ID_Profil: 1,
      ...updatedData,
      Profil_Privacy: true,
      Statut: 'Actif',
      ID_Utilisateur: 152,
    };

    profilRepository.updateProfil.mockResolvedValue(updatedProfil);

    const result = await profilService.updateProfil(1, updatedData);

    expect(result).toEqual(updatedProfil);
    expect(profilRepository.updateProfil).toHaveBeenCalledWith(1, updatedData);
  });

  test('❌ updateProfil devrait gérer les erreurs correctement', async () => {
    const errorMessage =
      'Erreur lors de la modification du profil correspondant';

    const updatedData = {
      Description: 'Test',
      Statut: 'Actif',
      ID_Utilisateur: 1,
      Profil_Privacy: true,
    };

    profilRepository.updateProfil.mockRejectedValue(new Error(errorMessage));

    try {
      await profilService.updateProfil(1, updatedData);
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(profilRepository.updateProfil).toHaveBeenCalledTimes(1);
    }
  });

  test('✅ deleteProfil devrait supprimer un profil', async () => {
    profilRepository.deleteProfil.mockResolvedValue({ ID_Profil: 1 });

    const result = await profilService.deleteProfil(1);

    expect(result).toEqual({ ID_Profil: 1 });
    expect(profilRepository.deleteProfil).toHaveBeenCalledWith(1);
  });

  test('❌ deleteProfil devrait gérer les erreurs correctement', async () => {
    const errorMessage =
      'Erreur lors de la suppression du profil correspondant';

    profilRepository.deleteProfil.mockRejectedValue(new Error(errorMessage));

    try {
      await profilService.deleteProfil();
    } catch (error) {
      expect(error.message).toContain(errorMessage);
      expect(profilRepository.deleteProfil).toHaveBeenCalledTimes(1);
    }
  });
});
