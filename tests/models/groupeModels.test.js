import { describe, test, expect } from 'vitest';
import { validateGroupe } from '../../src/models/groupModels.js';

describe('Validation du modèle Groupe', () => {
  test("✅ Validation d'un groupe valide (minimal)", () => {
    const groupeValide = {
      nom: 'Groupe de Test',
      etat: 'Public',
    };
    expect(() => validateGroupe(groupeValide)).not.toThrow();
    const result = validateGroupe(groupeValide);
    expect(result.nom).toBe('Groupe de Test');
    expect(result.etat).toBe('Public');
  });

  test("✅ Validation d'un groupe valide (avec description)", () => {
    const groupeValide = {
      nom: 'Groupe de Test',
      description: 'Une description valide',
      etat: 'Prive',
    };
    expect(() => validateGroupe(groupeValide)).not.toThrow();
    const result = validateGroupe(groupeValide);
    expect(result.description).toBe('Une description valide');
    expect(result.etat).toBe('Prive');
  });

  test('❌ Échec de validation - Nom trop court', () => {
    const groupeInvalide = {
      nom: 'A',
      etat: 'Public',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      'Le nom du groupe doit contenir au moins 2 caractères',
    );
  });

  test('❌ Échec de validation - Nom trop long', () => {
    const groupeInvalide = {
      nom: 'A'.repeat(101),
      etat: 'Public',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      'Le nom du groupe ne peut pas dépasser 100 caractères',
    );
  });

  test('❌ Échec de validation - Description trop longue', () => {
    const groupeInvalide = {
      nom: 'Groupe de Test',
      description: 'A'.repeat(1001),
      etat: 'Public',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      'La description ne peut pas dépasser 1000 caractères',
    );
  });

  test('❌ Échec de validation - État invalide', () => {
    const groupeInvalide = {
      nom: 'Groupe de Test',
      etat: 'Autre',
    };
    expect(() => validateGroupe(groupeInvalide)).toThrow(
      'L\'état du groupe doit être "Public" ou "Prive"',
    );
  });

  test("✅ Validation - L'état par défaut est 'Public' si non renseigné", () => {
    const groupeValide = {
      nom: 'Groupe de Test',
    };
    const result = validateGroupe(groupeValide);
    expect(result.etat).toBe('Public');
  });
});
