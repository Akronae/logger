import eslint from '@eslint/js';
import eslintprettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // keep ignores here inside its own object
  // https://github.com/eslint/eslint/discussions/18304#discussioncomment-9069706
  {
    ignores: [
      '.git/*',
      '.idea/*',
      '.yarn/*',
      'node_modules/*',
      'coverage/*',
      'dist/*',
      'build/*',
      '.prisma/*',
      'prisma/*',
      '.vercel/*',
      '@mf-types/*',
    ],
  },
  eslint.configs.recommended,
  eslintprettier,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // sometimes you need to filter out ranges of forbidden characters..
      'no-control-regex': 'off',
      // this rule is stupid sometimes we need any because it's a JS world
      '@typescript-eslint/no-explicit-any': 'off',
      // this rule is really stupid
      '@typescript-eslint/ban-ts-comment': 'off',
      // this rule is stupid we need namespaces for type augmentation
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  }
);
