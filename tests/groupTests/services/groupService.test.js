import { test, expect, vi, afterEach } from 'vitest';
import * as groupRepository from '../../../src/repositories/groupRepository.js';
import * as groupService from '../../../src/services/groupService.js';

// Mock des fonctions du repository
vi.mock('../../../src/repositories/groupRepository.js', () => ({
  getGroups: vi.fn(),
  getGroupById: vi.fn(),
  createGroup: vi.fn(),
  updateGroup: vi.fn(),
  deleteGroup: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

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

test("❌ Échec de la récupération d'un groupe par ID", async () => {
  const error = new Error('Erreur lors de la récupération du groupe');
  groupRepository.getGroupById.mockRejectedValue(error);

  await expect(groupService.getGroupById(1)).rejects.toThrow(error);
  expect(groupRepository.getGroupById).toHaveBeenCalledWith(1);
});

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
  };
  groupRepository.createGroup.mockResolvedValue(mockGroup);

  const result = await groupService.createGroup(groupData);

  expect(groupRepository.createGroup).toHaveBeenCalledWith(groupData);
  expect(result).toEqual(mockGroup);
});

test("❌ Échec de la création d'un groupe sans ID_Utilisateur", async () => {
  const groupData = {
    Nom: 'Nouveau Groupe',
    Description: 'Description valide',
    Etat: true,
  };
  await expect(groupService.createGroup(groupData)).rejects.toThrow(
    "L'ID de l'utilisateur est requis",
  );
  expect(groupRepository.createGroup).not.toHaveBeenCalled();
});

test("✅ Mise à jour d'un groupe avec succès", async () => {
  const updateData = { Nom: 'Groupe Modifié', Etat: true, ID_Utilisateur: 1 };
  const mockUpdatedGroup = {
    ID_Group: 1,
    Nom: 'Groupe Modifié',
    Description: 'Ancienne description',
    Etat: true,
    ID_Utilisateur: 1,
  };
  groupRepository.updateGroup.mockResolvedValue(mockUpdatedGroup);

  const result = await groupService.updateGroup(1, updateData);

  expect(groupRepository.updateGroup).toHaveBeenCalledWith(1, updateData);
  expect(result).toEqual(mockUpdatedGroup);
});

test("❌ Échec de la mise à jour d'un groupe sans ID_Utilisateur", async () => {
  const updateData = { Nom: 'Groupe Modifié' };
  await expect(groupService.updateGroup(1, updateData)).rejects.toThrow(
    "L'ID de l'utilisateur est requis",
  );
  expect(groupRepository.updateGroup).not.toHaveBeenCalled();
});

test("✅ Suppression d'un groupe avec succès", async () => {
  const mockDeletedGroup = {
    ID_Group: 1,
    Nom: 'Groupe Supprimé',
    Etat: true,
    ID_Utilisateur: 1,
  };
  groupRepository.deleteGroup.mockResolvedValue(mockDeletedGroup);

  const result = await groupService.deleteGroup(1);

  expect(groupRepository.deleteGroup).toHaveBeenCalledWith(1);
  expect(result).toEqual(mockDeletedGroup);
});

test("❌ Échec de la suppression d'un groupe", async () => {
  const error = new Error('Erreur lors de la suppression du groupe');
  groupRepository.deleteGroup.mockRejectedValue(error);

  await expect(groupService.deleteGroup(1)).rejects.toThrow(error);
  expect(groupRepository.deleteGroup).toHaveBeenCalledWith(1);
});
