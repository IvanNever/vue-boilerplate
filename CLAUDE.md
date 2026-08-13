# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VueMart — an ecommerce admin panel built with Vue 3, TypeScript, and Vuetify. Talks to a separate API backend (see [nest-server](https://github.com/IvanNever/nest-server)) via `VITE_API_BASE_URL`.

## Current direction (active refactor)

The codebase is mid-refactor into a reusable boilerplate. Plan: `/Users/ivanneverovskyi/.claude/plans/clever-forging-horizon.md`. Decisions already made, in effect immediately even though the code doesn't fully reflect them yet:

- **No new DI-container registrations.** The hand-rolled context in `src/infrastructure/context/` is being removed (see below — it's documented here only because it still exists in code). New repos should be plain module-singleton exports, not registered anywhere.
- **No new module-scope `ref` state.** State is moving to Pinia. Don't add more of the `useAuth`/`useUsers`-style shared refs described below.
- Tests are being rewritten from scratch; don't pattern-match old test files that may still be in the tree mid-refactor.

## Commands

```sh
npm run dev              # start dev server (Vite)
npm run build             # type-check + production build
npm run preview           # preview production build
npm run test:unit         # run all tests (Vitest)
npm run coverage          # run tests with coverage (v8)
npm run lint              # eslint --fix over .vue/.js/.jsx/.cjs/.mjs/.ts/.tsx/.cts/.mts
npm run format             # prettier --write src/
npm run type-check         # vue-tsc --build --force
```

Run a single test file: `npx vitest run src/auth/views/LoginView.test.ts`
Run tests matching a name: `npx vitest run -t "renders the login form"`

Test files live next to the code they test (`Foo.ts` + `Foo.test.ts` in the same directory), not in a separate `__tests__` folder. Vitest config: jsdom environment, globals enabled, setup file at `src/infrastructure/test-utils/setupTests.ts` (registers Vuetify and mocks `vue-router`'s `useRouter`).

## Architecture

The codebase is organized as **feature modules** under `src/` (`auth`, `users`, `products`, `categories`, `orders`, `dashboard`, `common`), plus cross-cutting `infrastructure`, `layouts`, and `ui-kit` directories. `products`, `categories`, `orders`, and `dashboard` are currently stub views only; `auth` and `users` are the reference implementations for how a full module should be structured.

### Module internal layout

Each feature module follows a layered structure inspired by DDD:

- `domain/` — plain classes/interfaces with no framework dependencies: entities (extend `Entity`/`AggregateRoot` from `src/common/domain`), repo interfaces (e.g. `UsersRepo`, `AuthRepo`).
- `api/` — concrete repo implementations (e.g. `UsersRepoImpl`) that extend `BaseRepo` and talk to the backend via axios, plus DTO types and DTO⇄domain mappers (`userDtoMapper.ts`).
- `infrastructure/context.ts` — wires the module's repo implementation into a per-module DI context (see below) and exposes an `init*Context()` function called once from `main.ts`.
- `infrastructure/routes.ts` — the module's `RouteRecordRaw[]`, imported into the central router.
- `composables/` — Vue composition functions (`useUsers`, `useAuth`) that hold shared module-scoped `ref`/`reactive` state (declared at module scope, outside the composable function, so state is shared across components) and call into the repo via the module's context.
- `views/` — route-level `.vue` components.

### Dependency injection (`src/infrastructure/context/index.ts`)

A minimal hand-rolled DI container, not a library. Key pieces:

- `initPublicContext()` creates a global `publicContext` and registers `ApiCoreImpl` under `'ApiCore'`. Call once in `main.ts` before any module context.
- `createContext(name)` creates a module-local context wired to the shared `publicContext`.
- `context.registry(Service, key)` instantiates `new Service()` and stores it; throws if the key is already registered. `registryOverwrite` replaces without checking. `registryPublic` registers on the shared public context instead of the local one.
- Consumers fetch services with `context.get<T>('key')`, typed via generics — there's no automatic constructor injection, just a keyed instance map.
- Each module's `infrastructure/context.ts` must export an `init*Context()` and call it from `main.ts` in the correct order (public context first).

### API layer

- `ApiCoreImpl` (`src/infrastructure/api/ApiCore.ts`) wraps a single axios instance shared app-wide: attaches `Bearer <token>` from `localStorage` on every request, and on a `403` response clears the token and hard-redirects to `/login`.
- `BaseRepo` (`src/infrastructure/api/BaseRepo.ts`) is the base class for all repo implementations — it pulls `ApiCore` out of `publicContext` and exposes `this.inst` (the axios instance). New repos should extend this rather than creating their own axios instance.
- Repos build URLs from `import.meta.env.VITE_API_BASE_URL` + a resource path, and always convert between wire-format DTOs and domain objects via a mapper function (never expose DTOs to views/composables).

### Domain primitives (`src/common/domain`)

- `Entity` / `AggregateRoot` — identity-based equality via numeric `id`.
- `ValueObject` — structural equality via `getEqualityComponents()`.
- `Result<T>` / `ResultError` — an explicit success/failure wrapper (`Result.success(value)` / `Result.failure(...errors)`) for domain operations that shouldn't throw; accessing `.value` on a failure or `.errors` on a success throws.

These primitives exist but are only lightly used outside `common/domain` today (e.g. `User` extends `Entity`); most error handling in composables/views still uses try/catch + `apiErrors()` rather than `Result`.

### Routing (`src/infrastructure/router/index.ts`)

Central router imports each module's route table (e.g. `usersRoutes`) and nests it under the authenticated `AppLayout` shell at `/`. A `beforeEach` guard reads the token out of `useAuth()`/`localStorage` and redirects unauthenticated users to `/login` (`EmptyLayout` + `LoginView`), and authenticated users away from `/login`.

### UI kit (`src/ui-kit`)

Wrapper components around Vuetify primitives (`AppInput`, `AppButton`, `AppForm`, `AppCard`, etc.) — prefer these over raw `v-*` Vuetify components when building views. `appNotification/useNotification.ts` provides the app-wide toast/snackbar mechanism used for both success and error messages (errors typically formatted via `src/infrastructure/utils/apiErrors.ts`, which maps HTTP status codes to user-facing strings).

### Path alias

`@/*` resolves to `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Code style

- Semicolon usage is inconsistent across the codebase (some files use them, some don't) — Prettier is configured with `singleQuote: true`, `trailingComma: none`, `printWidth: 80`; run `npm run format` rather than hand-matching style.
- ESLint extends `plugin:vue/vue3-essential`, `eslint:recommended`, and the Vue/TypeScript + Prettier configs (`.eslintrc.cjs`).