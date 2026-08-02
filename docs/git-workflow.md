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

## Suggested CI

Nothing is wired up yet. A minimal pipeline on pull requests:

```yaml
- npm ci
- npm run lint
- npm run typecheck
- npm run format:check
- npm run build
```
