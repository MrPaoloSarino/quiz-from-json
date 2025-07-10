# Contributing Guide

## Development Setup

1. **Install dependencies**
   ```sh
   pnpm install
   ```

2. **Lint**
   ```sh
   pnpm lint
   ```

3. **Type Check**
   ```sh
   pnpm run type-check
   ```

4. **Run Tests**
   ```sh
   pnpm test
   ```

5. **Environment Variables**
   - Copy `.env.example` to `.env` and fill in your secrets (Google API keys, etc).

## CI/CD
- All pushes and PRs are checked for lint, type safety, and tests via GitHub Actions.

## Debug Logging
- Debug logs are only shown in development mode (`process.env.NODE_ENV === 'development'`).

## Legacy Code
- Legacy quiz import code is maintained minimally and marked for future review. 