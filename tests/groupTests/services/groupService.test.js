import { test, expect, vi, afterEach, describe } from 'vitest';
import * as groupRepository from '../../../src/repositories/groupRepository.js';
import * as groupService from '../../../src/services/groupService.js';
import * as userGroupRepository from '../../../src/repositories/userGroupRepository.js';

// Mock des fonctions du repository
vi.mock('../../../src/repositories/groupRepository.js', () => ({
  getGroups: vi.fn(),
  getGroupById: vi.fn(),
  createGroup: vi.fn(),
  updateGroup: vi.fn(),
  deleteGroup: vi.fn(),
}));

// Mock userGroupRepository
vi.mock('../../../src/repositories/userGroupRepository.js', () => ({
  createUserGroup: vi.fn(),
  updateUserGroup: vi.fn(),
  deleteUserGroupByGroupId: vi.fn(),
  getUserGroupsByUserId: vi.fn(),
}));

describe('Service Group', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getGroups', () => {
    test('✅ Récupération de tous les groupes avec succès', async () => {
      const mockGroups = [
        { ID_Group: 1, Nom: 'Groupe 1', Etat: true, ID_Utilisateur: 1 },
        { ID_Group: 2, Nom: 'Groupe 2', Etat: false, ID_Utilisateur: 2 },
      ];
      groupRepository.getGroups.mockResolvedValue(mockGroups);

      const result = await groupService.getGroups();

      expect(groupRepository.getGroups).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGroups);
    });

    test('❌ Échec de la récupération des groupes', async () => {
      const error = new Error('Erreur lors de la récupération des groupes');
      groupRepository.getGroups.mockRejectedValue(error);

      await expect(groupService.getGroups()).rejects.toThrow(error);
      expect(groupRepository.getGroups).toHaveBeenCalledTimes(1);
    });
  });

  describe('getGroupById', () => {
    test("✅ Récupération d'un groupe par ID avec succès", async () => {
      const mockGroup = {
        ID_Group: 1,
        Nom: 'Groupe 1',
        Description: 'Description test',
        Etat: true,
        ID_Utilisateur: 1,
      };
      groupRepository.getGroupById.mockResolvedValue(mockGroup);

      const result = await groupService.getGroupById(1);

      expect(groupRepository.getGroupById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGroup);
    });

    test("❌ Échec de la récupération d'un groupe par ID (groupe inexistant)", async () => {
      groupRepository.getGroupById.mockResolvedValue(null);

      await expect(groupService.getGroupById(1)).rejects.toEqual({
        status: 404,
        message: "Groupe avec l'ID 1 introuvable",
      });
    });
  });

  describe('createGroup', () => {
    test("✅ Création d'un nouveau groupe avec succès", async () => {
      const groupData = {
        Nom: 'Nouveau Groupe',
        Description: 'Description valide',
        Etat: true,
        ID_Utilisateur: 1,
      };
      const mockGroup = {
        ID_Group: 1,
        ...groupData,
      };
      groupRepository.createGroup.mockResolvedValue(mockGroup);
      userGroupRepository.createUserGroup.mockResolvedValue({
        ID_Utilisateur: 1,
        ID_Group: 1,
        IsMod: true,
      });

      const result = await groupService.createGroup(groupData);

      expect(groupRepository.createGroup).toHaveBeenCalledWith(groupData);
      expect(userGroupRepository.createUserGroup).toHaveBeenCalledWith({
        ID_Utilisateur: 1,
        ID_Group: 1,
        IsMod: true,
      });
      expect(result).toEqual(mockGroup);
    });

    test("❌ Échec de la création d'un groupe sans ID_Utilisateur", async () => {
      const groupData = {
        Nom: 'Nouveau Groupe',
        Description: 'Description valide',
        Etat: true,
      };

      // La validation devrait échouer avant d'appeler le repository
      await expect(groupService.createGroup(groupData)).rejects.toThrow();

      expect(groupRepository.createGroup).not.toHaveBeenCalled();
      expect(userGroupRepository.createUserGroup).not.toHaveBeenCalled();
    });
  });

  describe('updateGroup', () => {
    test("✅ Mise à jour d'un groupe avec changement de modérateur", async () => {
      const existingGroup = {
        ID_Group: 1,
        Nom: 'Ancien Groupe',
        Etat: true,
        ID_Utilisateur: 1, // Ancien modérateur
      };

      const updateData = {
        Nom: 'Groupe Modifié',
        Etat: false,
        ID_Utilisateur: 2, // Nouveau modérateur
      };

      const mockUpdatedGroup = {
        ID_Group: 1,
        ...updateData,
      };

      // Mock pour récupérer le groupe existant
      groupRepository.getGroupById.mockResolvedValue(existingGroup);

      // Mock pour mettre à jour le groupe
      groupRepository.updateGroup.mockResolvedValue(mockUpdatedGroup);

      // Mock pour vérifier l'ancien utilisateur
      userGroupRepository.getUserGroupsByUserId.mockImplementation((userId) => {
        if (userId === 1) {
          return [{ ID_Utilisateur: 1, ID_Group: 1, IsMod: true }];
        }
        return [];
      });

      // Mock pour mettre à jour l'ancien utilisateur
      userGroupRepository.updateUserGroup.mockResolvedValue({
        ID_Utilisateur: 1,
        ID_Group: 1,
        IsMod: false,
      });

      // Mock pour créer une nouvelle entrée pour le nouvel utilisateur
      userGroupRepository.createUserGroup.mockResolvedValue({
        ID_Utilisateur: 2,
        ID_Group: 1,
        IsMod: true,
      });

      const result = await groupService.updateGroup(1, updateData);

      // Vérifie que le groupe a été mis à jour
      expect(groupRepository.updateGroup).toHaveBeenCalledWith(1, updateData);

      // Vérifie que l'ancien utilisateur a été mis à jour pour ne plus être modérateur
      expect(userGroupRepository.updateUserGroup).toHaveBeenCalledWith({
        ID_Utilisateur: 1,
        ID_Group: 1,
        IsMod: false,
      });

      // Vérifie que le nouvel utilisateur a été ajouté comme modérateur
      expect(userGroupRepository.createUserGroup).toHaveBeenCalledWith({
        ID_Utilisateur: 2,
        ID_Group: 1,
        IsMod: true,
      });

      // Vérifie le résultat final
      expect(result).toEqual(mockUpdatedGroup);
    });

    test("✅ Mise à jour d'un groupe sans changement de modérateur", async () => {
      const existingGroup = {
        ID_Group: 1,
        Nom: 'Ancien Groupe',
        Etat: true,
        ID_Utilisateur: 1,
      };

      const updateData = {
        Nom: 'Groupe Modifié',
        Etat: false,
        ID_Utilisateur: 1, // Même modérateur
      };

      const mockUpdatedGroup = {
        ID_Group: 1,
        ...updateData,
      };

      // Mock pour récupérer le groupe existant
      groupRepository.getGroupById.mockResolvedValue(existingGroup);

      // Mock pour mettre à jour le groupe
      groupRepository.updateGroup.mockResolvedValue(mockUpdatedGroup);

      const result = await groupService.updateGroup(1, updateData);

      // Vérifie que le groupe a été mis à jour
      expect(groupRepository.updateGroup).toHaveBeenCalledWith(1, updateData);

      // Pas d'appel à updateUserGroup ou createUserGroup car le modérateur n'a pas changé
      expect(userGroupRepository.updateUserGroup).not.toHaveBeenCalled();
      expect(userGroupRepository.createUserGroup).not.toHaveBeenCalled();

      // Vérifie le résultat final
      expect(result).toEqual(mockUpdatedGroup);
    });

    test("❌ Échec de la mise à jour d'un groupe inexistant", async () => {
      // Le groupe recherché n'existe pas
      groupRepository.getGroupById.mockResolvedValue(null);

      const updateData = {
        Nom: 'Groupe Modifié',
        Etat: false,
        ID_Utilisateur: 2,
      };

      await expect(groupService.updateGroup(999, updateData)).rejects.toEqual({
        status: 404,
        message: `Groupe avec l'ID 999 introuvable`,
      });

      expect(groupRepository.updateGroup).not.toHaveBeenCalled();
      expect(userGroupRepository.updateUserGroup).not.toHaveBeenCalled();
      expect(userGroupRepository.createUserGroup).not.toHaveBeenCalled();
    });
  });

  describe('deleteGroup', () => {
    test("✅ Suppression d'un groupe avec succès", async () => {
      const existingGroup = {
        ID_Group: 1,
        Nom: 'Groupe à Supprimer',
        Etat: true,
        ID_Utilisateur: 1,
      };

      const mockDeletedGroup = {
        ID_Group: 1,
        Nom: 'Groupe Supprimé',
        Etat: true,
        ID_Utilisateur: 1,
      };

      // Mock pour vérifier l'existence du groupe
      groupRepository.getGroupById.mockResolvedValue(existingGroup);

      // Mocks pour les opérations de suppression
      userGroupRepository.deleteUserGroupByGroupId.mockResolvedValue({
        count: 1,
      });
      groupRepository.deleteGroup.mockResolvedValue(mockDeletedGroup);

      const result = await groupService.deleteGroup(1);

      // Vérifications des appels
      expect(groupRepository.getGroupById).toHaveBeenCalledWith(1);
      expect(userGroupRepository.deleteUserGroupByGroupId).toHaveBeenCalledWith(
        1,
      );
      expect(groupRepository.deleteGroup).toHaveBeenCalledWith(1);

      // Vérification du résultat
      expect(result).toEqual(mockDeletedGroup);
    });

    test("❌ Échec de la suppression d'un groupe inexistant", async () => {
      // Le groupe recherché n'existe pas
      groupRepository.getGroupById.mockResolvedValue(null);

      await expect(groupService.deleteGroup(999)).rejects.toEqual({
        status: 404,
        message: `Groupe avec l'ID 999 introuvable`,
      });

      expect(
        userGroupRepository.deleteUserGroupByGroupId,
      ).not.toHaveBeenCalled();
      expect(groupRepository.deleteGroup).not.toHaveBeenCalled();
    });
  });
});
