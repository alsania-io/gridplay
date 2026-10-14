import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
      // Wallet subscriptions, async board loads, and router-query-driven init are
      // legitimate effects; keep this advisory rather than blocking.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.swc/**',
      'out/**',
      'coverage/**',
      '.kilocode/**',
      '.deprecated/**',
      'next-env.d.ts',
      'examples/**',
      'public/**',
    ],
  },
];

export default eslintConfig;
