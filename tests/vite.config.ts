import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'], // Optionnel : fichier de configuration des tests
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

/*
Points clés des tests :
- Tests de validation du schéma Zod
- Mocking de Prisma pour tester l'unicité
- Tests couvrant différents cas de validation
- Utilisation de `beforeEach` pour réinitialiser les mocks

Quelques conseils supplémentaires :
- Assurez-vous d'importer les bons modules
- Adaptez les chemins d'import selon votre structure de projet
- Les tests vérifient à la fois la validation Zod et la vérification d'unicité

Voulez-vous que je vous explique un détail en particulier sur ces tests ?
*/
