import { PrismaClient } from '@prisma/client';
import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  getAllUtilisateurs,
  createUtilisateurs,
  getUtilisateursById,
  updateUtilisateurs,
  deleteUtilisateurs,
} from '../../../src/repositories/UserRepository.js';

vi.mock('@prisma/client', () => {
  const mockPrisma = {
    Utilisateur: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $disconnect: vi.fn(),
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('Utilisateur Repository', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('✅ getAllUtilisateurs should return all Utilisateurs', async () => {
    const mockData = [
      {
        ID_Utilisateur: 1,
        nom: 'nom1',
        pseudo: 'pseudo1',
        email: 'email@example.com',
        password: 'password1',
        country: 'France',
        birthDate: new Date('2000-01-01'),
        numTel: '+33123456789',
      },
    ];
    prisma.Utilisateur.findMany.mockResolvedValue(mockData);

    const result = await getAllUtilisateurs();
    expect(result).toEqual(mockData);
    expect(prisma.Utilisateur.findMany).toHaveBeenCalledTimes(1);
  });

  test('✅ createUtilisateur should create a new Utilisateur', async () => {
    const newUtilisateur = {
      nom: 'newnom2',
      pseudo: 'newpseudo2',
      email: 'newemail@email.com',
      password: 'newpassword',
      country: 'Belgique',
      birthDate: new Date('1995-05-05'),
      numTel: '+32123456789',
    };
    const createdUtilisateur = { ID_Profil: 2, ...newUtilisateur };
    prisma.Utilisateur.create.mockResolvedValue(createdUtilisateur);

    const result = await createUtilisateurs(newUtilisateur);
    expect(result).toEqual(createdUtilisateur);
    expect(prisma.Utilisateur.create).toHaveBeenCalledWith({
      data: newUtilisateur,
    });
  });

  test('✅ getUtilisateurById should return a Utilisateur by ID', async () => {
    const mockUtilisateur = {
      ID_User: 1,
      nom: 'nom1',
      pseudo: 'pseudo1',
      email: 'email@example.com',
      password: 'password1',
      country: 'France',
      birthDate: new Date('2000-01-01'),
      numTel: '+33123456789',
    };
    prisma.Utilisateur.findUnique.mockResolvedValue(mockUtilisateur);

    const result = await getUtilisateursById(1);
    expect(result).toEqual(mockUtilisateur);
    expect(prisma.Utilisateur.findUnique).toHaveBeenCalledWith({
      where: { ID_Utilisateur: 1 },
    });
  });

  test('✅ updateUtilisateur should update a Utilisateur', async () => {
    const updatedData = { Password: 'Updated' };
    const updatedUtilisateur = {
      ID_Utilisateur: 1,
      nom: 'nom1',
      pseudo: 'pseudo1',
      email: 'email@example.com',
      Password: 'Updated',
      country: 'France',
      birthDate: new Date('2000-01-01'),
      numTel: '+33123456789',
    };
    prisma.Utilisateur.update.mockResolvedValue(updatedUtilisateur);

    const result = await updateUtilisateurs(1, updatedData);
    expect(result).toEqual(updatedUtilisateur);
    expect(prisma.Utilisateur.update).toHaveBeenCalledWith({
      where: { ID_Utilisateur: 1 },
      data: updatedData,
    });
  });

  test('✅ deleteUtilisateur should delete a Utilisateur', async () => {
    const deletedUtilisateur = { ID_User: 1 };
    prisma.Utilisateur.delete.mockResolvedValue(deletedUtilisateur);

    const result = await deleteUtilisateurs(1);
    expect(result).toEqual(deletedUtilisateur);
    expect(prisma.Utilisateur.delete).toHaveBeenCalledWith({
      where: { ID_Utilisateur: 1 },
    });
  });
});
