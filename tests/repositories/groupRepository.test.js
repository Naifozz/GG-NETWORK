import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../../src/repositories/groupRepository.js';
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

      const result = await createGroup(groupData);

      expect(prisma.groupe.create).toHaveBeenCalledWith({
        data: groupData,
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
    test("✅ Mise à jour partielle d'un groupe", async () => {
      const updateData = { Nom: 'Groupe Modifié', Etat: false };
      const mockUpdatedGroup = {
        ID_Group: 1,
        Nom: 'Groupe Modifié',
        Description: 'Ancienne description',
        Etat: false,
        ID_Utilisateur: 1,
      };
      prisma.groupe.update.mockResolvedValue(mockUpdatedGroup);

      const result = await updateGroup(1, updateData);

      expect(prisma.groupe.update).toHaveBeenCalledWith({
        where: { ID_Group: 1 },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedGroup);
    });

    test('❌ Échec de la mise à jour sans ID_Utilisateur', async () => {
      const updateData = { Nom: 'Groupe Modifié' };
      prisma.groupe.update.mockRejectedValue(
        new Error("L'ID de l'utilisateur est requis"),
      );

      await expect(updateGroup(1, updateData)).rejects.toThrow(
        "L'ID de l'utilisateur est requis",
      );
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

      const result = await deleteGroup(1);

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
