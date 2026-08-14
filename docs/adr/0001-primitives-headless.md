# ADR 0001 — Périmètre des primitives headless

- **Statut :** accepté
- **Date :** 2026-08-14
- **Portée :** `@aquellec/ui` — tous les composants, présents et à venir

## Contexte

La librairie est volontairement légère au runtime : `clsx` et `tailwind-merge` sont
les seules dépendances, `sideEffects: false`, et l'addon a11y de Storybook tourne
en mode bloquant (`test: 'error'`).

Les comportements accessibles sont aujourd'hui écrits à la main, sur une base
partagée réduite :

| Couche | Implémentation |
| --- | --- |
| Piège de focus | `useFocusTrap` dans `src/lib/focus-trap.ts` (88 lignes) — boucle Tab, Échap, récupération sur `focusin`, `[data-autofocus]`, restitution du focus |
| Modale | Portail, `role="dialog"`, `inert` sur les enfants directs de `<body>`, verrouillage du scroll (`src/components/Modal/Modal.tsx`, 249 lignes) |
| SegmentedControl | `radiogroup` WAI-ARIA avec roving tabindex, flèches, `Home` / `End` |
| Toast | `role="alert"` / `role="status"` et `aria-live` |
| Formulaires | Liaison label / `id`, `aria-invalid`, `aria-describedby` |

Ces patterns sont stables et couverts par des tests d'interaction. En revanche, les
composants encore à construire — Select, Combobox, Popover, Tooltip, Menu — reposent
sur du positionnement flottant, de la saisie prédictive, du roving focus et des règles
de fermeture (clic extérieur, Échap, imbrication) dont la surface de bug est bien
plus large. La question s'est donc posée d'adopter une librairie headless
(Ariakit, Base UI, Radix) pour l'ensemble de la librairie.

## Décision

**Adoption ciblée, pas globale.**

1. Les primitives headless sont réservées aux **widgets flottants ou composites** :
   `Select`, `Combobox`, `Popover`, `Tooltip`, `Menu`. Elles sont introduites au
   moment où le composant est construit, jamais en remplacement rétroactif.
2. Les **patterns APG simples déjà implémentés restent maison** : `Modal`,
   `SegmentedControl`, `Toast`, `Dropzone`, `Input`, `Textarea`, `DataTable`,
   ainsi que tous les composants purement présentationnels.
3. La librairie par défaut le jour venu est **Ariakit**, pour son API à base de
   hooks (cohérente avec les composants composables `Card.Header`, `Modal.Footer`)
   et ses imports par primitive. Ce choix est un défaut, pas un verrou : voir
   « Le cas Select / Combobox » plus bas.
4. La dépendance headless n'est ajoutée aux `dependencies` qu'à la livraison du
   **premier** composant concerné, et le coût en Ko est documenté dans le README à
   ce moment-là. Deux dépendances headless coexistant durablement (par exemple
   Ariakit et downshift) demandent une révision de cet ADR, pas un ajout discret.

### Règles d'application

- **Imports par primitive** (`@ariakit/react/select`) et jamais le barrel, pour
  protéger le bundle des applications hôtes.
- **Le contrat d'i18n prime sur la primitive** : tout nom accessible reste piloté
  par les props (`labels`, `ariaLabel`, `closeLabel`), aucune chaîne figée dans un
  wrapper.
- **La CI a11y bloquante reste en place** : une primitive headless réduit les bugs,
  elle ne les supprime pas — surtout une fois le style appliqué.
- **L'API publique ne change pas** : la primitive est un détail d'implémentation
  interne, le composant exporté reste stylé et opinionated.
- **La primitive est annoncée dans la documentation du composant.** Un consommateur
  doit pouvoir savoir ce qu'il embarque sans lire le code. C'est la pratique de
  welcome-ui : une clé `ariakit:` dans le front matter de chaque page composant,
  rendue en bouton « Built with Ariakit » vers la doc amont.

### Le cas Select / Combobox

Le point 1 désigne `Select` et `Combobox` comme la plus haute valeur d'adoption.
La librairie à y employer, en revanche, **reste ouverte**.

welcome-ui, qui utilise pourtant Ariakit sur treize composants — jusqu'au `Button`
et à la `Checkbox` —, a choisi **downshift** (avec `match-sorter` pour le filtrage)
pour son `Select` et son `Search`. Autrement dit : l'équipe qui a le plus investi
dans Ariakit est allée chercher ailleurs précisément là où on prévoit de l'utiliser.

Le choix se fera donc au moment de construire le composant, sur prototype, et non
d'avance. Critères de décision : intégration au formulaire (`name`, `form`, valeur
contrôlée), multi-sélection, recherche asynchrone, et `aria-activedescendant`
correct sur mobile.

### Ce qui n'est pas décidé ici

La réécriture des internes de `Modal` sur un Dialog headless est **différée**, non
rejetée. Elle sera reconsidérée si l'un de ces besoins apparaît :

- modales imbriquées (confirmation ouverte depuis une modale de formulaire) —
  la coordination `inert` / verrouillage du scroll actuelle ne le supporte pas ;
- `role="alertdialog"` pour les confirmations destructrices ;
- modale non fermable (`dismissible={false}`) — le clic sur l'overlay ferme
  toujours aujourd'hui.

Deux limites connues de l'implémentation actuelle sont acceptées en l'état : pas de
compensation de la gouttière de scrollbar (léger décalage de mise en page à
l'ouverture), et un périmètre `inert` limité aux enfants directs de `<body>` (une UI
portalisée hors de l'arbre du portail n'est pas couverte).

## Conséquences

**Positives**

- Le contrat de dépendances actuel est préservé : les consommateurs n'héritent
  d'aucun coût headless tant qu'aucun widget flottant n'est publié.
- Aucun churn sur des composants qui passent déjà la CI a11y.
- Les semaines de travail sur les cas limites du Combobox et du Menu sont évitées
  là où elles coûtent le plus cher.

**Négatives**

- La librairie aura deux modèles d'implémentation cohabitants (maison / headless),
  qu'il faut expliciter — c'est l'objet de cet ADR.
- Le premier composant headless introduit une dépendance runtime dans un package
  publié, et donc une surface d'audit supplémentaire.
- Les composants headless demandent des tests à deux niveaux : comportement de la
  primitive et rendu stylé du wrapper.

**À ne pas faire**

- Ne pas migrer `SegmentedControl` vers un Tabs/RadioGroup headless : le pattern
  radiogroup est implémenté et testé, le wrapper serait plus complexe que le code
  actuel.
- Ne pas envelopper les composants présentationnels (`Button`, `Badge`, `Card`,
  `ProgressBar`, `ScoreGauge`, `PricingCard`) : aucune primitive comportementale
  n'y est en jeu.
- Ne pas reconstruire un Combobox ou un Menu à la main.

## Alternatives considérées

| Option | Verdict |
| --- | --- |
| Adopter Ariakit partout, maintenant | Churn sur des composants stables et testés, dépendance runtime ajoutée sans gain visible pour les consommateurs |
| Rester 100 % maison | Le Combobox et le Menu concentrent l'essentiel de la surface de bug ; les réécrire n'apporte aucune différenciation |
| Base UI | Alternative crédible (v1 stable, API proche de Radix) ; écartée sur la cohérence d'API avec le style hooks / composables de la librairie |
| Radix UI | Écosystème plus large, mais maintenance plus lente sur les primitives complexes (Combobox) |
| **downshift** | **Non écartée** — retenue comme candidate à égalité avec Ariakit sur le seul périmètre `Select` / `Combobox`, sur le précédent welcome-ui. Sa portée s'arrête là : elle ne couvre ni Popover, ni Tooltip, ni Menu |

## Ordre de mise en œuvre

1. `Tooltip` — plus petite surface d'intégration, établit le patron wrapper stylé
   + i18n sans engager le débat Select. Sur Ariakit.
2. `Select` puis `Combobox` — recherche candidat / offre dans le dashboard
   recruteur. Prototyper les deux pistes (Ariakit, downshift) avant de trancher,
   et documenter le choix ici même.
3. `Menu` — actions de ligne du `DataTable`.
4. Internes de `Modal` — seulement si l'un des besoins listés plus haut se présente.

## Références

Relevés le 2026-08-14 sur les dépôts publics, à la source et non de mémoire.

| Design system | Constat utile |
| --- | --- |
| [welcome-ui](https://github.com/WTTJ/welcome-ui) | `@ariakit/react` en dépendance directe, sur treize composants dont `Button`, `Checkbox`, `Radio`, `Toggle` — mais `Select` et `Search` sont sur **downshift** + `match-sorter`. Chaque page composant annonce sa primitive (clé `ariakit:` en front matter, bouton « Built with Ariakit ») |
| [Polaris](https://github.com/Shopify/polaris) | Storybook interne sans `addon-docs` ; la documentation publique est un site Next.js séparé, exemples en iframe |
| [Fluent UI](https://github.com/microsoft/fluentui) | `viewMode: 'docs'` : le Storybook **est** le site de doc. Aucune configuration de viewport |
| [Carbon](https://github.com/carbon-design-system/carbon) | Couverture responsive traitée en modes Chromatic (`breakpoint-sm` sur toutes les stories), pas en stories dédiées |
| [React Spectrum](https://github.com/adobe/react-spectrum) | Le tactile passe par une prop de provider (`scale: medium` / `large`), pas par une media query |

Enseignement transverse, vérifié sur sept design systems : aucun n'expose de
sélecteur de viewport dans sa documentation. C'est ce qui a fondé le choix de ne
rien ajouter de ce côté ici.
