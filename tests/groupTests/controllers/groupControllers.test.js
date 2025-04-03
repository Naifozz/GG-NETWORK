import { test, expect, vi, afterEach } from 'vitest';
import * as groupController from '../../../src/controllers/groupController.js';
import * as groupService from '../../../src/services/groupService.js';

// Mock des fonctions du controller
vi.mock('../../../src/services/groupService.js', () => ({
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
  groupService.getGroups.mockResolvedValue(mockGroups);

  const req = {}; // Pas de paramètres nécessaires pour cette requête
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.getGroups(req, res);

  expect(groupService.getGroups).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockGroups);
});

test('❌ Échec de la récupération des groupes (erreur serveur)', async () => {
  groupService.getGroups.mockRejectedValue(new Error('Erreur serveur'));

  const req = {};
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.getGroups(req, res);

  expect(groupService.getGroups).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Erreur lors de la récupération des groupes',
  });
});

test("✅ Récupération d'un groupe par ID avec succès", async () => {
  const mockGroup = {
    ID_Group: 1,
    Nom: 'Groupe 1',
    Description: 'Description test',
    Etat: true,
    ID_Utilisateur: 1,
  };
  groupService.getGroupById.mockResolvedValue(mockGroup);

  const req = { params: { id: 1 } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.getGroupById(req, res);

  expect(groupService.getGroupById).toHaveBeenCalledWith(1);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockGroup);
});

test("❌ Échec de la récupération d'un groupe par ID", async () => {
  const error = new Error('Erreur lors de la récupération du groupe');
  groupService.getGroupById.mockRejectedValue(error);

  const req = { params: { id: 1 } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.getGroupById(req, res);

  expect(groupService.getGroupById).toHaveBeenCalledWith(1);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Erreur lors de la récupération du groupe',
  });
});

test("❌ Échec de la récupération d'un groupe inexistant (404)", async () => {
  groupService.getGroupById.mockRejectedValue({
    status: 404,
    message: "Groupe avec l'ID 4 introuvable",
  });

  const req = { params: { id: 4 } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.getGroupById(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    message: "Groupe avec l'ID 4 introuvable",
  });
});

test("✅ Création d'un groupe avec succès", async () => {
  const mockGroup = {
    ID_Group: 1,
    Nom: 'Groupe 1',
    Description: 'Description test',
    Etat: true,
    ID_Utilisateur: 1,
  };
  groupService.createGroup.mockResolvedValue(mockGroup);

  const req = {
    body: {
      Nom: 'Groupe 1',
      Description: 'Description test',
      Etat: true,
      ID_Utilisateur: 1,
    },
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.createGroup(req, res);

  expect(groupService.createGroup).toHaveBeenCalledWith({
    Nom: 'Groupe 1',
    Description: 'Description test',
    Etat: true,
    ID_Utilisateur: 1,
  });
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(mockGroup);
});

test("❌ Échec de la création d'un groupe (erreur serveur)", async () => {
  groupService.createGroup.mockRejectedValue(new Error('Erreur serveur'));

  const req = {
    body: {
      Nom: 'Groupe 1',
      Description: 'Description test',
      Etat: true,
      ID_Utilisateur: 1,
    },
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.createGroup(req, res);

  expect(groupService.createGroup).toHaveBeenCalledWith({
    Nom: 'Groupe 1',
    Description: 'Description test',
    Etat: true,
    ID_Utilisateur: 1,
  });
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Erreur lors de la création du groupe',
  });
});

test("✅ Mise à jour d'un groupe avec succès", async () => {
  const mockGroup = {
    ID_Group: 1,
    Nom: 'Groupe 1',
    Description: 'Description test',
    Etat: true,
    ID_Utilisateur: 1,
  };
  groupService.updateGroup.mockResolvedValue(mockGroup);

  const req = { params: { id: 1 }, body: { Nom: 'Groupe 1' } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.updateGroup(req, res);

  expect(groupService.updateGroup).toHaveBeenCalledWith(1, { Nom: 'Groupe 1' });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockGroup);
});

test("❌ Échec de la mise à jour d'un groupe (erreur serveur)", async () => {
  groupService.updateGroup.mockRejectedValue(new Error('Erreur serveur'));

  const req = { params: { id: 1 }, body: { Nom: 'Groupe 1' } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.updateGroup(req, res);

  expect(groupService.updateGroup).toHaveBeenCalledWith(1, { Nom: 'Groupe 1' });
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Erreur lors de la mise à jour du groupe',
  });
});

test("❌ Échec de la mise à jour d'un groupe inexistante (404)", async () => {
  groupService.updateGroup.mockRejectedValue({
    status: 404,
    message: "Groupe avec l'ID 4 introuvable",
  });

  const req = { params: { id: 4 }, body: { Nom: 'Groupe 1' } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.updateGroup(req, res);

  expect(groupService.updateGroup).toHaveBeenCalledWith(4, { Nom: 'Groupe 1' });
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    message: "Groupe avec l'ID 4 introuvable",
  });
});

test("✅ Suppression d'un groupe avec succès", async () => {
  const mockDeletedGroup = {
    ID_Group: 1,
    Nom: 'Groupe 1',
    Description: 'Description test',
    Etat: true,
    ID_Utilisateur: 1,
  };
  groupService.deleteGroup.mockResolvedValue(mockDeletedGroup);

  const req = { params: { id: 1 } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.deleteGroup(req, res);

  expect(groupService.deleteGroup).toHaveBeenCalledWith(1);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockDeletedGroup);
});

test("❌ Échec de la suppression d'un groupe (erreur serveur)", async () => {
  groupService.deleteGroup.mockRejectedValue(new Error('Erreur serveur'));

  const req = { params: { id: 1 } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.deleteGroup(req, res);

  expect(groupService.deleteGroup).toHaveBeenCalledWith(1);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Erreur lors de la suppression du groupe',
  });
});

test("❌ Échec de la suppression d'un groupe inexistante (404)", async () => {
  groupService.deleteGroup.mockRejectedValue({
    status: 404,
    message: "Groupe avec l'ID 4 introuvable",
  });

  const req = { params: { id: 4 } };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  await groupController.deleteGroup(req, res);

  expect(groupService.deleteGroup).toHaveBeenCalledWith(4);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    message: "Groupe avec l'ID 4 introuvable",
  });
});
