import { describe, test, expect, vi, afterEach } from 'vitest';
import * as userGroupRepository from '../../../src/repositories/userGroupRepository.js';
import { PrismaClient } from '@prisma/client';

// Mock du client Prisma
vi.mock('@prisma/client', () => {
  const mockPrisma = {
    userGroupe: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

afterEach(() => {
  vi.clearAllMocks();
});

describe('Tests unitaires pour userGroupRepository', () => {
  test('✅ Récupération de tous les UserGroupes', async () => {
    const mockUserGroups = [
      { ID_Utilisateur: 1, ID_Group: 1, IsMod: false },
      { ID_Utilisateur: 2, ID_Group: 1, IsMod: true },
    ];
    prisma.userGroupe.findMany.mockResolvedValue(mockUserGroups);

    const result = await userGroupRepository.getUserGroups();
    expect(prisma.userGroupe.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUserGroups);
  });

  test('✅ Récupération des UserGroupes par ID_Utilisateur', async () => {
    const mockUserGroups = [{ ID_Utilisateur: 1, ID_Group: 1, IsMod: false }];
    prisma.userGroupe.findMany.mockResolvedValue(mockUserGroups);

    const result = await userGroupRepository.getUserGroupsByUserId(1);
    expect(prisma.userGroupe.findMany).toHaveBeenCalledWith({
      where: { ID_Utilisateur: 1 },
    });
    expect(result).toEqual(mockUserGroups);
  });

  test('✅ Récupération des UserGroupes par ID_Groupe', async () => {
    const mockUserGroups = [{ ID_Utilisateur: 1, ID_Group: 1, IsMod: false }];
    prisma.userGroupe.findMany.mockResolvedValue(mockUserGroups);

    const result = await userGroupRepository.getUserGroupsByGroupId(1);
    expect(prisma.userGroupe.findMany).toHaveBeenCalledWith({
      where: { ID_Groupe: 1 },
    });
    expect(result).toEqual(mockUserGroups);
  });

  test("✅ Création d'un UserGroupe", async () => {
    const mockUserGroup = {
      ID_Utilisateur: 1,
      ID_Group: 1,
      IsMod: false,
    };
    prisma.userGroupe.create.mockResolvedValue(mockUserGroup);

    const data = { ID_Utilisateur: 1, ID_Group: 1, IsMod: false };
    const result = await userGroupRepository.createUserGroup(data);
    expect(prisma.userGroupe.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual(mockUserGroup);
  });

  test("✅ Mise à jour d'un UserGroupe", async () => {
    const mockUpdatedUserGroup = {
      ID_Utilisateur: 1,
      ID_Group: 1,
      IsMod: true,
    };
    prisma.userGroupe.update.mockResolvedValue(mockUpdatedUserGroup);

    const data = { ID_Utilisateur: 1, ID_Group: 1, IsMod: true };
    const result = await userGroupRepository.updateUserGroup(data);
    expect(prisma.userGroupe.update).toHaveBeenCalledWith({
      where: {
        ID_Utilisateur_ID_Group: {
          ID_Utilisateur: 1,
          ID_Group: 1,
        },
      },
      data: {
        IsMod: true,
      },
    });
    expect(result).toEqual(mockUpdatedUserGroup);
  });

  test("✅ Suppression d'un UserGroupe par clé composite", async () => {
    const mockDeletedUserGroup = {
      ID_Utilisateur: 1,
      ID_Group: 1,
      IsMod: false,
    };
    prisma.userGroupe.delete.mockResolvedValue(mockDeletedUserGroup);

    const result = await userGroupRepository.deleteUserGroupById(1);
    expect(prisma.userGroupe.delete).toHaveBeenCalledWith({
      where: { ID_UserGroupe: 1 },
    });
    expect(result).toEqual(mockDeletedUserGroup);
  });

  test('✅ Suppression de plusieurs UserGroupes par ID_Groupe', async () => {
    const mockDeleteResult = { count: 2 }; // Simule la suppression de 2 enregistrements
    prisma.userGroupe.deleteMany.mockResolvedValue(mockDeleteResult);

    const result = await userGroupRepository.deleteUserGroupByGroupId(1);
    expect(prisma.userGroupe.deleteMany).toHaveBeenCalledWith({
      where: { ID_Group: 1 },
    });
    expect(result).toEqual(mockDeleteResult);
  });
});
