import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../../../src/repositories/groupRepository.js';
import * as userGroupRepository from '../../../src/repositories/userGroupRepository.js';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
vi.mock('@prisma/client', () => {
  const mockPrisma = {
    groupe: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  return {
    PrismaClient: vi.fn(() => mockPrisma),
  };
});

// Mock userGroupRepository
vi.mock('../../../src/repositories/userGroupRepository.js', () => ({
  createUserGroup: vi.fn(),
  updateUserGroup: vi.fn(),
  deleteUserGroupByGroupId: vi.fn(),
  getUserGroupsByUserId: vi.fn(),
}));

const prisma = new PrismaClient();

describe('Repository Group', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getGroups', () => {
    test('✅ Récupération de tous les groupes avec succès', async () => {
      const mockGroups = [
        { ID_Group: 1, Nom: 'Groupe 1', Etat: true, ID_Utilisateur: 1 },
        { ID_Group: 2, Nom: 'Groupe 2', Etat: false, ID_Utilisateur: 2 },
      ];
      prisma.groupe.findMany.mockResolvedValue(mockGroups);

      const result = await getGroups();

      expect(prisma.groupe.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGroups);
    });

    test('❌ Échec de la récupération des groupes', async () => {
      const error = new Error('Erreur de base de données');
      prisma.groupe.findMany.mockRejectedValue(error);

      await expect(getGroups()).rejects.toThrow(error);
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
      prisma.groupe.findUnique.mockResolvedValue(mockGroup);

      const result = await getGroupById(1);

      expect(prisma.groupe.findUnique).toHaveBeenCalledWith({
        where: { ID_Group: 1 },
      });
      expect(result).toEqual(mockGroup);
    });

    test("✅ Recherche d'un groupe inexistant (retourne null)", async () => {
      prisma.groupe.findUnique.mockResolvedValue(null);

      const result = await getGroupById(999);

      expect(result).toBeNull();
    });
  });

  describe('createGroup', () => {
    test("✅ Création d'un nouveau groupe avec succès", async () => {
      const groupData = {
        Nom: 'Nouveau Groupe',
        Description: 'Description valide',
        Etat: true,
        ID_Utilisateur: 1, // ID de l'utilisateur requis
      };
      const mockGroup = {
        ID_Group: 1,
        ...groupData,
        Utilisateurs: [],
        Concours: [],
        MarketPlace: [],
      };
      prisma.groupe.create.mockResolvedValue(mockGroup);
      userGroupRepository.createUserGroup.mockResolvedValue({
        ID_Utilisateur: 1,
        ID_Group: 1,
        IsMod: true,
      });

      const result = await createGroup(groupData);

      expect(prisma.groupe.create).toHaveBeenCalledWith({
        data: groupData,
      });
      expect(userGroupRepository.createUserGroup).toHaveBeenCalledWith({
        ID_Utilisateur: 1,
        ID_Group: 1,
        IsMod: true,
      });
      expect(result).toEqual(mockGroup);
    });

    test('❌ Échec de la création sans ID_Utilisateur', async () => {
      const groupData = {
        Nom: 'Nouveau Groupe',
        Description: 'Description valide',
        Etat: true,
      };
      prisma.groupe.create.mockRejectedValue(
        new Error("L'ID de l'utilisateur est requis"),
      );

      await expect(createGroup(groupData)).rejects.toThrow(
        "L'ID de l'utilisateur est requis",
      );
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
      prisma.groupe.findUnique.mockResolvedValue(existingGroup);

      // Mock pour mettre à jour le groupe
      prisma.groupe.update.mockResolvedValue(mockUpdatedGroup);

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

      const result = await updateGroup(1, updateData);

      // Vérifie que le groupe a été mis à jour
      expect(prisma.groupe.update).toHaveBeenCalledWith({
        where: { ID_Group: 1 },
        data: updateData,
      });

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

    test("❌ Échec de la mise à jour d'un groupe inexistant", async () => {
      prisma.groupe.findUnique.mockResolvedValue(null);

      const updateData = {
        Nom: 'Groupe Modifié',
        Etat: false,
        ID_Utilisateur: 2,
      };

      await expect(updateGroup(999, updateData)).rejects.toEqual({
        status: 404,
        message: `Groupe avec l'ID 999 introuvable`,
      });

      expect(prisma.groupe.update).not.toHaveBeenCalled();
      expect(userGroupRepository.updateUserGroup).not.toHaveBeenCalled();
      expect(userGroupRepository.createUserGroup).not.toHaveBeenCalled();
    });
  });

  describe('deleteGroup', () => {
    test("✅ Suppression d'un groupe avec succès", async () => {
      const mockDeletedGroup = {
        ID_Group: 1,
        Nom: 'Groupe Supprimé',
        Etat: true,
        ID_Utilisateur: 1,
      };
      prisma.groupe.delete.mockResolvedValue(mockDeletedGroup);
      userGroupRepository.deleteUserGroupByGroupId.mockResolvedValue({
        count: 1,
      });

      const result = await deleteGroup(1);

      expect(userGroupRepository.deleteUserGroupByGroupId).toHaveBeenCalledWith(
        1,
      );
      expect(prisma.groupe.delete).toHaveBeenCalledWith({
        where: { ID_Group: 1 },
      });
      expect(result).toEqual(mockDeletedGroup);
    });

    test('❌ Échec de la suppression - groupe utilisé dans des relations', async () => {
      const error = new Error('Violation de contrainte de clé étrangère');
      prisma.groupe.delete.mockRejectedValue(error);

      await expect(deleteGroup(1)).rejects.toThrow(error);
    });
  });
});
