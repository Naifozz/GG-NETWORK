import { describe, test, expect } from 'vitest';
import { validateUserGroup } from '../../../src/models/userGroupModels.js';

describe('Validation du modèle UserGroupe', () => {
  test("✅ Validation d'un UserGroupe valide", async () => {
    const userGroupeValide = {
      ID_Group: 1,
      ID_Utilisateur: 1,
    };
    await expect(validateUserGroup(userGroupeValide)).resolves.not.toThrow();
    const result = await validateUserGroup(userGroupeValide);
    expect(result.ID_Group).toBe(1);
    expect(result.ID_Utilisateur).toBe(1);
  });

  test('❌ Échec de validation - ID_Groupe invalide (négatif)', async () => {
    const userGroupeInvalide = {
      ID_Group: -1,
      ID_Utilisateur: 1,
    };
    await expect(validateUserGroup(userGroupeInvalide)).rejects.toThrow(
      "L'ID du groupe doit être un entier positif",
    );
  });

  test('❌ Échec de validation - ID_Utilisateur invalide (négatif)', async () => {
    const userGroupeInvalide = {
      ID_Group: 1,
      ID_Utilisateur: -1,
    };
    await expect(validateUserGroup(userGroupeInvalide)).rejects.toThrow(
      "L'ID de l'utilisateur doit être un entier positif",
    );
  });

  test("✅ Validation d'un UserGroupe valide avec IsMod=true", async () => {
    const userGroupeValide = {
      ID_Group: 1,
      ID_Utilisateur: 1,
      IsMod: true,
    };
    await expect(validateUserGroup(userGroupeValide)).resolves.not.toThrow();
    const result = await validateUserGroup(userGroupeValide);
    expect(result.ID_Group).toBe(1);
    expect(result.ID_Utilisateur).toBe(1);
    expect(result.IsMod).toBe(true);
  });

  test('❌ Échec de validation - IsMod invalide (non boolean)', async () => {
    const userGroupeInvalide = {
      ID_Group: 1,
      ID_Utilisateur: 1,
      IsMod: 'not-a-boolean', // Valeur invalide
    };
    await expect(validateUserGroup(userGroupeInvalide)).rejects.toThrow(
      'Le statut de modérateur doit être un boolean (true ou false)',
    );
  });
});
