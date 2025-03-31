import { PrismaClient } from '@prisma/client';
import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  getAllProfils,
  createProfil,
  getProfilById,
  updateProfil,
  deleteProfil,
} from '../../../src/repositories/profilRepository.js';

vi.mock('@prisma/client', () => {
  const mockPrisma = {
    Profil: {
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

describe('Profil Repository', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('✅ getAllProfils should return all profils', async () => {
    const mockData = [
      {
        ID_Profil: 1,
        Description: 'Test',
        Profil_Privacy: true,
        Statut: 'Actif',
      },
    ];
    prisma.Profil.findMany.mockResolvedValue(mockData);

    const result = await getAllProfils();
    expect(result).toEqual(mockData);
    expect(prisma.Profil.findMany).toHaveBeenCalledTimes(1);
  });

  test('✅ createProfil should create a new profil', async () => {
    const newProfil = {
      Description: 'New',
      Profil_Privacy: false,
      Statut: 'Inactif',
    };
    const createdProfil = { ID_Profil: 2, ...newProfil };
    prisma.Profil.create.mockResolvedValue(createdProfil);

    const result = await createProfil(newProfil);
    expect(result).toEqual(createdProfil);
    expect(prisma.Profil.create).toHaveBeenCalledWith({ data: newProfil });
  });

  test('✅ getProfilById should return a profil by ID', async () => {
    const mockProfil = {
      ID_Profil: 1,
      Description: 'Test',
      Profil_Privacy: true,
      Statut: 'Actif',
    };
    prisma.Profil.findUnique.mockResolvedValue(mockProfil);

    const result = await getProfilById(1);
    expect(result).toEqual(mockProfil);
    expect(prisma.Profil.findUnique).toHaveBeenCalledWith({
      where: { ID_Profil: 1 },
    });
  });

  test('✅ updateProfil should update a profil', async () => {
    const updatedData = { Description: 'Updated' };
    const updatedProfil = {
      ID_Profil: 1,
      Description: 'Updated',
      Profil_Privacy: true,
      Statut: 'Actif',
    };
    prisma.Profil.update.mockResolvedValue(updatedProfil);

    const result = await updateProfil(1, updatedData);
    expect(result).toEqual(updatedProfil);
    expect(prisma.Profil.update).toHaveBeenCalledWith({
      where: { ID_Profil: 1 },
      data: updatedData,
    });
  });

  test('✅ deleteProfil should delete a profil', async () => {
    const deletedProfil = { ID_Profil: 1 };
    prisma.Profil.delete.mockResolvedValue(deletedProfil);

    const result = await deleteProfil(1);
    expect(result).toEqual(deletedProfil);
    expect(prisma.Profil.delete).toHaveBeenCalledWith({
      where: { ID_Profil: 1 },
    });
  });
});
