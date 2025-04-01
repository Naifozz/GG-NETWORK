import { describe, test, expect } from 'vitest';
import { validateGroupe } from '../../../src/models/groupModels.js';

describe('Validation du modèle Groupe', () => {
  test("✅ Validation d'un groupe valide (minimal)", async () => {
    const groupeValide = {
      Nom: 'Groupe de Test',
      Etat: true,
      ID_Utilisateur: 1, // ID valide
    };
    await expect(validateGroupe(groupeValide)).resolves.not.toThrow();
    const result = await validateGroupe(groupeValide);
    expect(result.Nom).toBe('Groupe de Test');
    expect(result.Etat).toBe(true);
    expect(result.ID_Utilisateur).toBe(1);
  });

  test("✅ Validation d'un groupe valide (avec description)", async () => {
    const groupeValide = {
      Nom: 'Groupe de Test',
      Description: 'Une description valide',
      Etat: false,
      ID_Utilisateur: 2, // ID valide
    };
    await expect(validateGroupe(groupeValide)).resolves.not.toThrow();
    const result = await validateGroupe(groupeValide);
    expect(result.Description).toBe('Une description valide');
    expect(result.Etat).toBe(false);
    expect(result.ID_Utilisateur).toBe(2);
  });

  test('❌ Échec de validation - Nom trop court', async () => {
    const groupeInvalide = {
      Nom: 'A',
      Etat: true,
      ID_Utilisateur: 1,
    };
    await expect(validateGroupe(groupeInvalide)).rejects.toThrow(
      'Le nom du groupe doit contenir au moins 2 caractères',
    );
  });

  test('❌ Échec de validation - Nom trop long', async () => {
    const groupeInvalide = {
      Nom: 'A'.repeat(101),
      Etat: true,
      ID_Utilisateur: 1,
    };
    await expect(validateGroupe(groupeInvalide)).rejects.toThrow(
      'Le nom du groupe ne peut pas dépasser 100 caractères',
    );
  });

  test('❌ Échec de validation - Description trop longue', async () => {
    const groupeInvalide = {
      Nom: 'Groupe de Test',
      Description: 'A'.repeat(1001),
      Etat: true,
      ID_Utilisateur: 1,
    };
    await expect(validateGroupe(groupeInvalide)).rejects.toThrow(
      'La description ne peut pas dépasser 1000 caractères',
    );
  });

  test('❌ Échec de validation - État invalide', async () => {
    const groupeInvalide = {
      Nom: 'Groupe de Test',
      Etat: 'Autre',
      ID_Utilisateur: 1,
    };
    await expect(validateGroupe(groupeInvalide)).rejects.toThrow(
      "L'état du groupe doit être un boolean (true pour Public, false pour Privé)",
    );
  });

  test('❌ Échec de validation - ID_Utilisateur manquant', async () => {
    const groupeInvalide = {
      Nom: 'Groupe de Test',
      Etat: true,
    };
    await expect(validateGroupe(groupeInvalide)).rejects.toThrow(
      "L'ID de l'utilisateur est requis",
    );
  });

  test('❌ Échec de validation - ID_Utilisateur invalide (négatif)', async () => {
    const groupeInvalide = {
      Nom: 'Groupe de Test',
      Etat: true,
      ID_Utilisateur: -1,
    };
    await expect(validateGroupe(groupeInvalide)).rejects.toThrow(
      "L'ID de l'utilisateur doit être un entier positif",
    );
  });

  test("✅ Validation - L'état par défaut est 'Public' si non renseigné", async () => {
    const groupeValide = {
      Nom: 'Groupe de Test',
      ID_Utilisateur: 1, // ID valide
    };
    const result = await validateGroupe(groupeValide);
    expect(result.Etat).toBe(true); // Vérifie que l'état par défaut est "Public"
    expect(result.ID_Utilisateur).toBe(1);
  });
});
