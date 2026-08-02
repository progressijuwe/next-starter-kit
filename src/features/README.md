# Features

Self-contained feature modules. Each owns its components, hooks, services and
types, so a feature can be deleted in one `rm -rf` without leaving orphans.

```
features/
└── billing/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types.ts
    └── index.ts
```

Rule of thumb: something belongs here once it is used by more than one route
but is not generic enough for `src/components`. Cross-feature imports should go
through the feature's `index.ts`, never into its internals.
