import { describe, test, expect } from 'vitest';
import { validateProfil } from '/src/models/profilModels.js';

describe('Validation du modèle Profil', () => {
  test("✅ Validation d'un profil valide", async () => {
    const profilValide = {
      Description: 'Profil de test',
      ID_Utilisateur: 1,
      Profil_Privacy: false,
      Statut: 'Actif',
    };

    expect(() => validateProfil(profilValide)).not.toThrow();
  });

  test('❌ Échec de validation - Description manquante', async () => {
    const profilInvalide = {
      Description: '',
      ID_Utilisateur: 1,
      Profil_Privacy: false,
      Statut: 'Actif',
    };

    let error;
    try {
      await validateProfil(profilInvalide);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  test('❌ Échec de la validation - Id Utilisateur invalide', async () => {
    const profilInvalide = {
      Description: 'Profil de test',
      ID_Utilisateur: '',
      Profil_Privacy: false,
      Statut: 'Actif',
    };

    let error;
    try {
      await validateProfil(profilInvalide);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  test('❌ Échec de la validation - Le statut est requis', async () => {
    const profilInvalide = {
      Description: 'Profil de test',
      ID_Utilisateur: 1,
      Profil_Privacy: false,
      Statut: '',
    };

    let error;
    try {
      await validateProfil(profilInvalide);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  test('❌ Échec de la validation - Le Profil_Privacy doit être un boolean', async () => {
    const profilInvalide = {
      Description: 'Profil de test',
      ID_Utilisateur: 1,
      Profil_Privacy: 1,
      Statut: 'Actif',
    };

    let error;
    try {
      await validateProfil(profilInvalide);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
