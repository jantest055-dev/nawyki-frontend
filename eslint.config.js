import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // legacy/ i stare pliki src/*.jsx to nieużywany prototyp; supabase/ to Deno (deno lint).
  globalIgnores(['dist', 'dev-dist', 'legacy', 'supabase', 'src/**/*.jsx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Treści użytkownika renderujemy wyłącznie jako tekst.
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML jest zabronione w tym projekcie.',
        },
        {
          selector: "AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]",
          message: 'Bezpośrednie przypisanie innerHTML/outerHTML jest zabronione.',
        },
      ],
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
])
