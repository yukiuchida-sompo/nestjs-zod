import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: '../api/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/generated/api',
      schemas: './src/generated/schemas',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: 'http://localhost:3001',
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/fetcher.ts',
          name: 'customFetcher',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});

