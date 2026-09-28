# Git workflow

```
main         production; always deployable
  └── develop    integration branch
        └── feature/*   one branch per unit of work
```

## Branches

Branch from `develop`, never from `main`:

```bash
git switch develop && git pull
git switch -c feature/pricing-page
```

Naming:

| Prefix      | For                   | Example                     |
| ----------- | --------------------- | --------------------------- |
| `feature/`  | new work              | `feature/auth`              |
| `fix/`      | bug fixes             | `fix/modal-focus-restore`   |
| `chore/`    | tooling, deps, config | `chore/bump-next`           |
| `docs/`     | documentation only    | `docs/api-layer`            |
| `refactor/` | no behaviour change   | `refactor/extract-variants` |

Keep them short-lived. A branch open for two weeks is a merge conflict waiting
to happen.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add pricing table
fix: stop modal restoring focus to a detached node
chore: bump next to 16.2.12
docs: document the API layer
refactor: extract buttonVariants
```

Describe the effect, not the diff. "fix: prevent double submit on slow
connections" is useful; "fix: update Button.tsx" is not.

## Pre-commit

Husky runs `lint-staged` on every commit — ESLint `--fix` then Prettier on
staged files only. It's fast because it never touches the whole repo.

It does **not** typecheck; that would be too slow for a commit hook. Run it
yourself before opening a PR:

```bash
npm run typecheck
```

If a hook blocks you, fix the cause. `--no-verify` just moves the failure to CI.

## Releasing

`develop` → `main` by pull request. Before merging:

```bash
npm run typecheck
npm run lint
npm run build
```

`main` should never receive a direct commit.

## The lockfile is cross-platform

Development happens on Windows; CI runs on Linux. `npm install` resolves the
dependency tree for **the machine it runs on**, and several build tools ship a
different binary per platform (`@tailwindcss/oxide-*`, `@next/swc-*`,
`lightningcss-*`, `@img/sharp-*`) plus a WebAssembly fallback. A lockfile
generated on Windows can therefore be missing edges that Linux needs, and
`npm ci` refuses to install:

```
npm error Missing: @emnapi/runtime@1.11.3 from lock file
```

It never reproduces locally, because locally you are the platform the lockfile
was built for.

So after **any** dependency change, regenerate the lockfile with Linux
resolution before committing:

```bash
npm_config_os=linux npm_config_cpu=x64 npm install --package-lock-only
```

In PowerShell:

```powershell
$env:npm_config_os='linux'; $env:npm_config_cpu='x64'
npm install --package-lock-only
Remove-Item Env:npm_config_os, Env:npm_config_cpu
```

Then verify it resolves everywhere. Each of these must exit 0 — the last one is
what CI actually runs:

```bash
npm ci --dry-run                                            # your machine
npm_config_os=linux npm_config_cpu=x64 npm ci --dry-run     # CI
```

`--dry-run` validates the lockfile against `package.json` without touching
`node_modules`, which makes it a fast pre-push check.

Two related traps:

- **Editing `package.json` by hand** without re-running an install desynchronises
  the lockfile the same way. `npm ci` compares the two and fails on any drift.
- **Don't "fix" this by switching CI to `npm install`.** That hides the drift and
  gives up the reproducible install that `npm ci` exists to provide.

## CI

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`
and `develop`. It reads `.nvmrc`, so CI and local Node versions can't drift, and
runs the checks cheapest-first:

```yaml
- npm ci
- npm run lint
- npm run typecheck
- npm run format:check
- npm run build
```
