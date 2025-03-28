import { describe, test, expect } from 'vitest';
import { validateProfil } from '/src/models/profilModels.js';

describe('Validation du modèle Profil', () => {
  test("✅ Validation d'un profil valide", () => {
    const profilValide = {
      Description: 'Profil de test',
      ID_Utilisateur: 1,
      Profil_Privacy: false,
      Statut: 'Actif',
    };

    expect(() => validateProfil(profilValide)).not.toThrow();
  });

  test('❌ Échec de validation - Description manquante', () => {
    const profilInvalide = {
      Description: '',
      ID_Utilisateur: 1,
      Profil_Privacy: false,
      Statut: 'Actif',
    };

    expect(() => validateProfil(profilInvalide)).toThrow();
  });

  test('❌ Échec de la validation - Id Utilisateur invalide', () => {
    const profilInvalide = {
      Description: 'Profil de test',
      ID_Utilisateur: '',
      Profil_Privacy: false,
      Statut: 'Actif',
    };

    expect(() => validateProfil(profilInvalide)).toThrow();
  });

  test('❌ Échec de la validation - Le statut est requis', () => {
    const profilInvalide = {
      Description: 'Profil de test',
      ID_Utilisateur: 1,
      Profil_Privacy: false,
      Statut: '',
    };

    expect(() => validateProfil(profilInvalide)).toThrow();
  });

  test('❌ Échec de la validation - Le Profil_Privacy doit être un boolean', () => {
    const profilInvalide = {
      Description: 'Profil de test',
      ID_Utilisateur: 1,
      Profil_Privacy: 1,
      Statut: 'Actif',
    };

    expect(() => validateProfil(profilInvalide)).toThrow();
  });
});
