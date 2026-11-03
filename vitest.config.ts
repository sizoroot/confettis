import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: [ 'test/**/*.test.ts' ],
        typecheck: {
            enabled: true,
            tsconfig: './tsconfig.test.json',
            include: [ 'test/**/*.test-d.ts' ]
        }
    }
})
