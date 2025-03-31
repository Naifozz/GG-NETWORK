import { describe, test, expect } from 'vitest';
import { validateGroupe } from '../../src/models/groupModels.js';

describe('Validation du modèle Groupe', () => {
  test("✅ Validation d'un groupe valide (minimal)", () => {
    const groupeValide = {
      Nom: 'Groupe de Test',
      Etat: true,
    };
    expect(() => validateGroupe(groupeValide)).not.toThrow();
    const result = validateGroupe(groupeValide);
    expect(result.Nom).toBe('Groupe de Test');
    expect(result.Etat).toBe(true);
  });

  test("✅ Validation d'un groupe valide (avec description)", () => {
    const groupeValide = {
      Nom: 'Groupe de Test',
      Description: 'Une description valide',
      Etat: false,
    };
    expect(() => validateGroupe(groupeValide)).not.toThrow();
    const result = validateGroupe(groupeValide);
    expect(result.Description).toBe('Une description valide');
    expect(result.Etat).toBe(false);
  });

  test('❌ Échec de validation - Nom trop court', () => {
    const groupeInvalide = {
      Nom: 'A',
      Etat: 'true',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      'Le nom du groupe doit contenir au moins 2 caractères',
    );
  });

  test('❌ Échec de validation - Nom trop long', () => {
    const groupeInvalide = {
      Nom: 'A'.repeat(101),
      Etat: 'true',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      'Le nom du groupe ne peut pas dépasser 100 caractères',
    );
  });

  test('❌ Échec de validation - Description trop longue', () => {
    const groupeInvalide = {
      Nom: 'Groupe de Test',
      Description: 'A'.repeat(1001),
      Etat: 'true',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      'La description ne peut pas dépasser 1000 caractères',
    );
  });

  test('❌ Échec de validation - État invalide', () => {
    const groupeInvalide = {
      Nom: 'Groupe de Test',
      Etat: 'Autre',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      "L'état du groupe doit être un boolean (true pour Public, false pour Privé)",
    );
  });

  test("✅ Validation - L'état par défaut est 'Public' si non renseigné", () => {
    const groupeValide = {
      Nom: 'Groupe de Test',
    };
    const result = validateGroupe(groupeValide);
    expect(result.Etat).toBe(true);
  });
});
