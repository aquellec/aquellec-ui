# @aquellec/ui

Composants UI React pour applications SaaS de recrutement (analyse de CV, matching ATS, espaces candidat et recruteur).

## Pourquoi ce projet ?

Une librairie créée pour alimenter mes projets perso (Dashboard Next.js & API Python d'analyse de CV). L'objectif était de construire des composants propres, accessibles et directement réutilisables pour des interfaces SaaS.

**Stack :** React 19, TypeScript, Tailwind CSS, Lucide Icons.

**Documentation & tests :** Storybook 10 (A11y, viewports, interactions).

## Installation & usage local

```bash
# Installer les dépendances
pnpm install

# Lancer Storybook en local
pnpm dev

# Builder la librairie
pnpm build
```

## Composants inclus

**Actions & inputs** — Button, Dropzone (upload PDF), Textarea, RoleToggle (switch Candidat / Recruteur).

**Data & dataviz** — ScoreGauge (score ATS 0–100 %), DataTable (pagination et skeleton), UsageBar (quota de crédits), Badge.

**Layout & structure** — Card, Modal, PricingCard, Toast.

**Showcase / templates** — Dashboards complets Candidat et Recruteur dans Storybook.

## Choix techniques simples

- **Composables** — Sous-composants (`Card.Header`, `Modal.Footer`, etc.) pour garder de la flexibilité.
- **Accessibilité** — Navigation clavier, attributs ARIA et états `:focus-visible`.
- **Styles** — `tailwind-merge` + `clsx` pour surcharger facilement les classes sans conflits CSS.

## Licence

MIT — Amandine Quellec
