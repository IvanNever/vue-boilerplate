# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VueMart — an ecommerce admin panel built with Vue 3, TypeScript, and Vuetify. Talks to a separate API backend (see [nest-server](https://github.com/IvanNever/nest-server)) via `VITE_API_BASE_URL`.

## Current direction (active refactor)

The codebase is mid-refactor into a reusable boilerplate. Plan: `/Users/ivanneverovskyi/.claude/plans/clever-forging-horizon.md`. Decisions already made, in effect immediately even though the code doesn't fully reflect them yet:

- **No DI container.** It's been removed (see "API layer" below for the current pattern). Do not reintroduce a service locator/registry — repos are plain module-singleton exports, consumed via direct import.
- **No new module-scope `ref` state.** State is moving to Pinia. Don't add more of the `useAuth`/`useUsers`-style shared refs described below.

## Commands

```sh
npm run dev              # start dev server (Vite)
npm run build             # type-check + production build
npm run preview           # preview production build
npm run test:unit         # run all tests (Vitest)
npm run coverage          # run tests with coverage (v8)
npm run lint              # eslint . --fix (flat config, eslint.config.js)
npm run format             # prettier --write src/
npm run type-check         # vue-tsc --build --force
```

Run a single test file: `npx vitest run src/auth/views/LoginView.test.ts`
Run tests matching a name: `npx vitest run -t "renders the login form"`

Test files live next to the code they test (`Foo.ts` + `Foo.test.ts` in the same directory), not in a separate `__tests__` folder. Vitest config: jsdom environment, globals enabled, setup file at `src/infrastructure/test-utils/setupTests.ts` — registers Vuetify (with its full `components`/`directives`, required for any component test to render real markup) and stubs two browser globals jsdom lacks (`ResizeObserver`, `visualViewport`) that Vuetify's overlay/menu/dialog components touch at runtime. It does **not** mock `vue-router` globally — mock `useRouter`/`useRoute` per test file with `vi.mock('vue-router', ...)` where needed.

## Architecture

The codebase is organized as **feature modules** under `src/` (`auth`, `users`, `products`, `categories`, `orders`, `dashboard`, `common`), plus cross-cutting `infrastructure`, `layouts`, and `ui-kit` directories. `products`, `categories`, `orders`, and `dashboard` are currently stub views only; `auth` and `users` are the reference implementations for how a full module should be structured.

### Module internal layout

Each feature module follows a layered structure inspired by DDD:

- `domain/` — plain classes/interfaces with no framework dependencies: entities (extend `Entity`/`AggregateRoot` from `src/common/domain`), repo interfaces (e.g. `UsersRepo`, `AuthRepo`).
- `api/` — concrete repo implementations (e.g. `UsersRepoImpl`) that extend `BaseRepo` and talk to the backend via axios, plus DTO types and DTO⇄domain mappers (`userDtoMapper.ts`). Each `*RepoImpl.ts` file also exports a ready singleton instance (`export const usersRepo: UsersRepo = new UsersRepoImpl()`) — this is what consumers import, not the class.
- `infrastructure/routes.ts` — the module's `RouteRecordRaw[]`, imported into the central router.
- `composables/` — Vue composition functions (`useUsers`, `useAuth`) that hold shared module-scoped `ref`/`reactive` state (declared at module scope, outside the composable function, so state is shared across components) and call the repo singleton via direct import.
- `views/` — route-level `.vue` components.

### API layer

- `apiClient` (`src/infrastructure/api/apiClient.ts`) is a single shared axios instance, exported directly (no class, no registration): attaches `Bearer <token>` from `localStorage` on every request, and on a `403` response clears the token and hard-redirects to `/login`.
- `BaseRepo` (`src/infrastructure/api/BaseRepo.ts`) is a thin base class for repo implementations — `protected readonly inst: AxiosInstance = apiClient`, set via direct import. New repos should extend this rather than creating their own axios instance.
- Repos build URLs from `import.meta.env.VITE_API_BASE_URL` + a resource path, always convert between wire-format DTOs and domain objects via a mapper function (never expose DTOs to views/composables), and export a singleton instance for consumers to import (see above). There is no DI container — swapping an implementation means changing the import, and tests substitute it via `vi.mock('@/users/api/usersRepoImpl', ...)`.

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
- ESLint uses flat config (`eslint.config.js`): `eslint-plugin-vue`'s `flat/recommended`, `@eslint/js` recommended, `@vue/eslint-config-typescript`'s `vueTsConfigs.recommended`, and Prettier's `skip-formatting` (formatting is `npm run format`'s job, not lint's).