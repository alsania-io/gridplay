# GridPlay - Agent Instructions

## Quick Reference
- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript 5.7
- **Styling**: Tailwind CSS + Chakra UI v3
- **Database**: Supabase (PostgreSQL) with RLS
- **Payments**: Crypto tokens (ALSA/SPIRIT) + Stripe/PayPal (deprecated)
- **Testing**: Jest + React Testing Library (jsdom)
- **Node**: ≥24.0.0 required

## Commands
```bash
# Development
make dev              # Start dev server (npm run dev)
make build            # Production build (npm run build)
make start            # Production server (npm run start)

# Quality
make lint             # ESLint (npm run lint)
make test             # Jest tests (npm test)
npm run type-check    # TypeScript check (tsc --noEmit)

# Maintenance
make clean            # Remove .next, out, coverage, cache
make install          # npm install
```

## Project Structure
```
app/                    # Next.js App Router pages
components/             # React components (with __tests__/)
hooks/                  # Custom React hooks
lib/                    # Utilities, API, database, constants
pages/api/              # Legacy API routes (with __tests__/)
public/                 # Static assets
contracts/              # Solidity contracts (GridPlayEscrow.sol)
state/                  # Recoil state management
```

## Key Conventions
- **Path aliases**: `@/*` maps to root (tsconfig.json)
- **Test files**: `*.test.ts` / `*.test.tsx` in `__tests__/` or alongside source
- **Environment**: Copy `.env.example` → `.env.local` (never commit)
- **Database**: Run `lib/database/schema.sql` via Supabase CLI or psql
- **Contracts**: Hardhat config in root; deploy with `PRIVATE_KEY` + `POLYGON_RPC_URL`

## Testing Notes
- Coverage threshold: 50% (branches/functions/lines/statements)
- Mocks in `jest.setup.ts`: Supabase, Stripe, PayPal, IntersectionObserver, matchMedia, ResizeObserver
- Run single test: `npm test -- path/to/test.test.tsx`
- Watch mode: `npm run test:watch`

## Lint/TypeScript
- ESLint extends `next/core-web-vitals`
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-unused-vars`: warn
- `react-hooks/exhaustive-deps`: warn
- Strict TS config with `noEmit: true`

## Gotchas
- Next.js config excludes test files from page extensions
- Supabase RLS policies require `auth.uid()` context
- Payment amounts stored in cents (integers)
- Board scores use Fisher-Yates shuffle in DB function
- Crypto tokens replace Stripe/PayPal (see `TOKEN_INTEGRATION_SUMMARY.md`)
- No AGENTS.md existed previously; this is the first version

## References
- `MAKEFILE_README.md` - Detailed Makefile workflows
- `README.md` - Full project docs
- `lib/database/schema.sql` - Complete DB schema with RLS
- `contracts/GridPlayEscrow.sol` - Smart contract
- `.env.example` - Required environment variables