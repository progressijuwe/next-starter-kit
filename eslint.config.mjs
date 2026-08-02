import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,

    {
        rules: {
            /* Unused variables are an error, but an underscore prefix marks a
               deliberate discard — e.g. omitting a key while destructuring. */
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            /* Type-only imports are erased at compile time; making the intent
               explicit keeps runtime imports honest and avoids import cycles. */
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
        },
    },

    /* Must stay last: it switches off the stylistic rules that would otherwise
       fight Prettier's formatting. */
    prettier,

    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
    ]),
]);

export default eslintConfig;
