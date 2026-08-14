import type { Dictionary } from './types';

/*
  French translation, typed as `Dictionary` (derived from `en`): any missing,
  extra or misspelled key breaks `pnpm type-check`.

  This file is the single exception to the English-only rule of the repository.
*/
export const fr: Dictionary = {
  /*
    The only place French is allowed in this repository: the `fr` locale.
    These entries mirror the component label interfaces one to one.
  */
  components: {
    dropzone: {
      inputLabel: (multiple) =>
        multiple
          ? 'Zone de dépôt de fichiers. Appuyez sur Entrée ou Espace pour parcourir vos fichiers.'
          : 'Zone de dépôt de fichier. Appuyez sur Entrée ou Espace pour parcourir vos fichiers.',
      browse: 'Cliquez pour parcourir',
      dropHint: (multiple) =>
        multiple ? 'ou glissez vos fichiers ici' : 'ou glissez votre fichier ici',
      constraint: (maxSizeMB, multiple) =>
        `Format PDF uniquement (max. ${maxSizeMB} Mo${multiple ? ' par fichier' : ''})`,
      loadingTitle: 'Traitement en cours…',
      loadingHint: (multiple) =>
        `Veuillez patienter pendant l'envoi ${multiple ? 'de vos fichiers' : 'de votre fichier'}`,
      uploading: 'Envoi en cours…',
      uploadingStatus: 'Envoi en cours',
      remove: (multiple) => (multiple ? 'Supprimer les fichiers' : 'Supprimer le fichier'),
      selection: (count) =>
        `${count} fichier${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''}`,
      totalSize: (formattedSize) => `Volume total : ${formattedSize}`,
      fileSize: (bytes) =>
        bytes < 1024 * 1024
          ? `${(bytes / 1024).toFixed(1)} Ko`
          : `${(bytes / (1024 * 1024)).toFixed(1)} Mo`,
      errorTooLarge: (fileName, maxSizeMB) =>
        `« ${fileName} » dépasse la limite de ${maxSizeMB} Mo.`,
      errorInvalidType: (fileName) => `« ${fileName} » n'est pas un PDF valide.`,
    },

    dataTable: {
      pagination: 'Pagination du tableau',
      previousPage: 'Page précédente',
      nextPage: 'Page suivante',
      pageStatus: (currentPage, totalPages) => (
        <>
          Page <strong className="text-slate-800">{currentPage}</strong> sur{' '}
          <strong className="text-slate-800">{totalPages}</strong>
        </>
      ),
    },

    gaugeStatus: {
      high: 'Excellente correspondance',
      medium: 'Correspondance moyenne',
      low: 'À améliorer',
      ai: 'Analyse IA',
    },

    modalClose: 'Fermer la fenêtre',
    toastClose: 'Fermer la notification',
    toastRegion: 'Notifications',
    pricingIncluded: 'Inclus : ',
    pricingExcluded: 'Non inclus : ',
    pricingFeatures: (planTitle) => `Fonctionnalités du forfait ${planTitle}`,
  },

  docs: {
    sections: {
      pillars: { kicker: 'Fondations', title: 'Les piliers du design system' },
      catalog: { kicker: 'Catalogue', title: 'Architecture de la librairie' },
      quickStart: { kicker: 'Prise en main', title: 'Démarrage rapide' },
      governance: { kicker: 'Contrat de qualité', title: 'Qualité et gouvernance' },
      brandColors: { kicker: 'Palettes', title: 'Couleurs de marque' },
      semanticTokens: { kicker: 'Palettes', title: 'Tokens sémantiques' },
      radii: { kicker: 'Fondations', title: 'Rayons et élévations' },
      typography: { kicker: 'Fondations', title: 'Typographie' },
      focus: { kicker: 'Accessibilité', title: 'Focus' },
      viewports: { kicker: 'Responsive', title: 'Viewports' },
      tokenUsage: { kicker: 'Consommation', title: 'Utiliser les tokens' },
    },

    introduction: {
      heroKicker: 'Design System · React 19 · Tailwind CSS',
      heroDescription:
        "Librairie de composants React typés pour applications SaaS de recrutement et d'analyse IA : parsing de CV, matching ATS, espaces candidat et recruteur, quotas et visualisation de scores.",
      chips: {
        typescript: 'TypeScript strict',
        wcag: 'WCAG 2.1 AA',
        preset: 'Preset Tailwind exportable',
        storybook: 'Storybook 10 + Vitest',
      },
      pillars: {
        accessibility: {
          title: "L'accessibilité d'abord",
          body: "Composants calés sur les patterns WAI-ARIA APG : labels associés, live regions, rôles sémantiques. Modale avec piège de focus, restitution du focus, touche Échap et contenu de fond inert. Contrastes visés WCAG 2.1 AA, vérifiés via l'addon a11y de Storybook.",
        },
        domain: {
          title: 'Métier SaaS recrutement',
          body: "Composants pensés pour les parcours réels : import PDF, bascule candidat / recruteur, jauge de score ATS, tableaux paginés, barres de quota et cartes tarifaires. Les templates de dashboard sont dans la section Templates.",
        },
        dx: {
          title: 'Expérience développeur',
          body: "Props étendues depuis les attributs HTML natifs, unions TypeScript discriminées, styles via cn() (clsx + tailwind-merge). Runtime léger : aucune librairie UI lourde, lucide-react en peer dependency uniquement.",
        },
      },
      families: {
        actions: 'Boutons primaires et IA, segments exclusifs avec navigation clavier.',
        forms: 'Formulaires avec erreurs ARIA, zone de dépôt PDF via label natif et glisser-déposer.',
        feedback: "Notifications en live region, file d'attente via provider, dialogues modaux, statuts compacts.",
        dataDisplay: 'Score ATS, tableaux paginés avec skeleton, quotas et consommation.',
        surfaces: 'Surfaces composables Header / Body / Footer, cartes de forfait SaaS.',
        templates: 'Pages de référence assemblant les composants en contexte produit.',
      },
      catalogIntro:
        "Le catalogue est organisé en cinq familles. Chaque composant expose des stories interactives, une page Autodocs et — lorsque c'est pertinent — des tests Vitest exécutés depuis Storybook.",
      composablePatterns: 'Patterns composables',
      compoundIntro: 'La plupart des blocs structurels suivent un découpage compound :',
      sharedUtilities: 'Les utilitaires partagés (cn, focusRing, tokens sémantiques) sont exportés depuis la racine du package. Référence visuelle des couleurs et des viewports :',
      steps: {
        install: '1. Installer le package',
        peerDependencies:
          "react, react-dom et lucide-react sont des peer dependencies — installez-les dans votre application hôte.",
        configureTailwind: '2. Configurer Tailwind CSS',
        presetIntro:
          'Importez le preset du design system pour hériter des tokens brand, ai et semantic.* :',
        esmEquivalent: 'Équivalent ESM / TypeScript :',
        importComponents: '3. Importer les composants',
        developLocally: '4. Développer et documenter en local',
      },
      governance: {
        axis: 'Axe',
        practice: 'Pratique',
        accessibility: 'Accessibilité',
        accessibilityBody: '@storybook/addon-a11y activé sur chaque story, en mode bloquant.',
        interactions: 'Interactions',
        interactionsBody: 'Tests play() Vitest via @storybook/addon-vitest.',
        viewports: 'Viewports',
        viewportsBody: 'Mobile 375 · Tablette 768 · Desktop 1280 · Large 1536.',
        typing: 'Typage',
        typingBody: 'strict: true, déclarations .d.ts générées dans dist/.',
      },
      tokensNote:
        "Toute évolution de token ou de contraste passe par src/lib/design-tokens.ts : le preset et la page Tokens en découlent.",
    },

    tokens: {
      heroKicker: 'Fondations · Preset Tailwind',
      heroTitle: 'Design Tokens',
      heroDescription:
        "Source unique des fondations : src/lib/design-tokens.ts. Le preset Tailwind livré par le package et cette page sont générés depuis ce fichier, donc les valeurs ci-dessous sont toujours celles réellement compilées.",
      brandIntro:
        "Deux échelles complètes de dix paliers, exportées par le preset sous les noms brand et ai. Les paliers 500 / 600 / 700 portent les rôles documentés — accent, action, texte conforme AA sur fond blanc.",
      scaleUsage: {
        brand: 'Actions, liens, navigation',
        ai: 'Fonctionnalités IA : scoring, synthèses, boutons génératifs',
      },
      roles: { accent: 'Accent', action: 'Action', aaText: 'Texte AA' },
      semanticIntro:
        "Consommés par Badge, Toast, Dropzone et Input via les helpers de src/lib/semantic-colors.ts, jamais en couleurs brutes. Chaque famille expose quatre rôles : fg (texte et icône), bg (fond de pastille), border et surface (fond de bannière).",
      semanticNote:
        "bg et surface partagent aujourd'hui la même valeur dans les quatre familles : la distinction existe pour pouvoir les dissocier plus tard sans toucher aux composants.",
      semanticGroups: {
        success: { label: 'Succès', usage: 'Correspondance validée, import réussi' },
        error: { label: 'Erreur', usage: 'Rejet, échec de parsing' },
        warning: { label: 'Alerte', usage: 'Quota bientôt atteint, score moyen' },
        info: { label: 'Information', usage: 'Neutre, aide contextuelle' },
      },
      neutral: {
        token: 'Token',
        value: 'Valeur',
        usage: 'Usage',
        muted: 'Texte secondaire, légendes',
        subtle: 'Corps de texte atténué, contrôles',
      },
      radii: 'Rayons',
      elevations: 'Élévations',
      typeScale: 'Échelle typographique',
      typeScaleSubtitle: 'Utilitaires Tailwind par défaut · police système',
      typeSample: 'Optimisez votre CV pour les ATS',
      typeUsage: {
        xs: 'Labels, badges, métadonnées',
        sm: 'Corps de texte, tableaux, formulaires',
        base: 'Titres de modale, contenu principal',
        lg: 'Titres de section',
        xl: 'En-têtes de page template',
        xl2: 'KPI de dashboard',
        xl3: 'Hero tarifaire',
      },
      focusRings: 'Anneaux de focus',
      focusIntro:
        "Centralisés dans src/lib/focus-ring.ts. Naviguez au clavier (Tab) pour les voir — ils sont en focus-visible uniquement, donc invisibles au clic.",
      focusNote:
        "Les trois anneaux sont en focus-visible uniquement : ils apparaissent au clavier, jamais au clic. Ils s'appliquent par-dessus un outline-none, donc les retirer via className ne laisse aucun indicateur de focus.",
      focusVariants: {
        standard: 'Contrôle standard',
        destructive: 'Action destructive',
        quiet: 'Bouton discret',
      },
      viewportsTitle: 'Viewports Storybook',
      pinViewport: 'Figer un viewport sur une story',
      pinViewportNote:
        "Quand un viewport est défini via globals, il est appliqué automatiquement et ne peut plus être changé depuis la toolbar — utile pour figer un cas de test.",
      shortcuts: 'Raccourcis clavier : viewport suivant Alt + V · précédent Alt + Maj + V · réinitialiser Alt + Ctrl + V.',
      presetHeading: 'Via le preset Tailwind',
      presetIntro: "Les tokens arrivent dans une application hôte par le preset — aucune feuille de style à importer :",
      presetNote: "Le preset embarque aussi la neutralisation des animations sous prefers-reduced-motion.",
      outsideHeading: 'En dehors de Tailwind',
      outsideIntro:
        "Les objets bruts restent disponibles pour les usages hors classes utilitaires (graphiques, e-mails, canvas) :",
      outsideNote:
        "Toute évolution passe par src/lib/design-tokens.ts : le preset, les composants et cette page en découlent automatiquement.",
    },
  },

  common: {
    cancel: 'Annuler',
    confirm: 'Confirmer',
    close: 'Fermer',
    save: 'Enregistrer',
    viewDetails: 'Voir le détail',
    download: 'Télécharger le PDF',
    upgrade: 'Changer de forfait',
    freePlan: 'Forfait gratuit',
    today: "Aujourd'hui",
  },

  button: {
    primary: 'Enregistrer les modifications',
    ai: 'Générer la synthèse',
    loading: 'Enregistrement…',
    disabled: 'Indisponible',
    secondary: "Voir l'historique",
    outline: 'Exporter les données',
    ghost: 'Annuler',
    submit: 'Publier le produit',
  },

  badge: {
    inStock: 'En stock',
    lowStock: 'Stock faible',
    outOfStock: 'Épuisé',
    aiSuggested: 'Suggéré par IA',
    draft: 'Brouillon',
    ok: 'Réussi',
    error: 'Échoué',
    warning: 'Attention',
    neutral: 'Neutre',
    ai: 'IA',
  },

  card: {
    report: {
      title: 'Synthèse hebdomadaire',
      subtitle: 'Performance tous canaux confondus',
      badge: '3 constats',
      body: "La conversion progresse de 12 % d'une semaine sur l'autre. L'essentiel du gain vient des visiteurs connus sur mobile.",
      meta: 'Dernière mise à jour',
      action: 'Voir le détail',
    },
    ai: {
      title: 'Synthèse IA',
      subtitle: 'Générée à partir des 30 derniers jours',
      body: "La qualité du trafic s'améliore régulièrement. L'abandon au paiement reste le principal point de fuite.",
      confidence: 'Confiance : 98 %',
      action: 'Relancer',
    },
    plan: {
      title: 'Forfait Starter',
      subtitle: 'Fonctionnalités essentielles',
      body: '3 projets inclus, collaborateurs illimités.',
    },
    tip: {
      title: 'Astuce du jour',
      body: 'Les raccourcis clavier accélèrent les actions répétitives.',
    },
    section: {
      title: 'Section principale',
      subtitle: 'Titre sémantique h2',
      body: 'Contenu de la section.',
    },
    minimal: {
      title: 'Sans sous-titre ni action',
      body: 'Contenu minimal.',
    },
  },

  input: {
    workspace: {
      label: "Nom de l'espace de travail",
      placeholder: 'Ex : Acme Inc.',
      value: 'Acme Inc.',
    },
    email: {
      label: 'Email professionnel',
      placeholder: 'prenom@entreprise.com',
      error: 'Saisissez une adresse email valide.',
    },
    password: {
      label: 'Mot de passe',
      helper: '8 caractères minimum, dont une majuscule.',
    },
    search: {
      label: 'Rechercher dans le catalogue',
      placeholder: 'Produit, référence, catégorie…',
    },
  },

  textarea: {
    description: {
      label: 'Description du produit',
      placeholder: "Décrivez le produit tel qu'il doit apparaître au catalogue…",
      helper: 'Plus la description est détaillée, meilleure est la synthèse générée.',
      error: 'La description doit contenir au moins 50 caractères.',
      value: 'Clavier sans fil',
    },
    note: {
      label: 'Note interne',
      helper: '50 caractères recommandés.',
    },
  },

  segmented: {
    period: {
      label: 'Période affichée',
      week: 'Semaine',
      month: 'Mois',
      quarter: 'Trimestre',
    },
    view: {
      label: "Mode d'affichage",
      grid: 'Grille',
      list: 'Liste',
    },
    workspace: {
      label: "Choisir l'espace de travail",
      candidate: 'Espace Candidat',
      recruiter: 'Espace Recruteur',
      active: 'Espace actif :',
    },
  },

  progress: {
    storage: { label: 'Stockage utilisé', unit: 'Go sur' },
    credits: {
      label: 'Crédits consommés',
      helper: 'Forfait gratuit',
      helperNearLimit: 'Quota presque atteint',
      action: 'Changer de forfait',
    },
    seats: { label: 'Sièges attribués' },
    undefined: { label: 'Quota non défini' },
    processing: 'Progression du traitement',
  },

  gauge: {
    performance: 'Score de performance',
    quality: 'Qualité des données',
    health: 'Santé du compte',
    match: 'Correspondance globale',
  },

  table: {
    columns: {
      name: 'Produit',
      category: 'Catégorie',
      status: 'Statut',
      price: 'Prix',
      updated: 'Mis à jour',
      action: 'Action',
      empty: 'Sans valeur',
    },
    categories: {
      audio: 'Audio',
      accessories: 'Accessoires',
      displays: 'Écrans',
    },
    statuses: {
      active: 'Actif',
      review: 'En revue',
      archived: 'Archivé',
    },
    rowAction: 'Ouvrir',
    emptyMessage: 'Aucun produit ne correspond à ces filtres pour le moment.',
  },

  modal: {
    report: {
      trigger: 'Voir le rapport complet',
      title: 'Rapport de diffusion',
      intro: 'Diagnostic détaillé calculé pour la campagne',
      campaign: 'Lancement de printemps',
      checklist: 'Contrôles effectués :',
      items: {
        deliverability: 'Délivrabilité',
        formatting: 'Mise en forme',
        links: 'Liens',
        images: 'Images manquantes',
      },
      secondary: 'Fermer',
      primary: 'Télécharger le PDF',
    },
    confirm: {
      title: 'Confirmation',
      body: 'Souhaitez-vous publier ces modifications ?',
    },
    overlay: {
      title: 'Fermeture par le fond',
      body: 'Cliquer en dehors ferme le dialogue.',
    },
    keyboard: {
      title: 'Navigation clavier',
      body: 'Contenu du dialogue avec piège de focus.',
      cancel: 'Annuler',
      submit: 'Valider',
    },
    untitled: {
      ariaLabel: 'Dialogue sans titre visible',
      body: 'Dialogue sans titre visible.',
    },
    headerClose: {
      title: 'Rapport',
      body: 'Contenu du rapport.',
    },
    noFocusable: {
      ariaLabel: 'Contenu sans élément focusable',
      body: 'Contenu sans élément focusable.',
    },
    compound: {
      title: 'En-tête composé',
      body: 'Corps rendu via un sous-composant.',
      confirm: 'OK',
    },
  },

  pricing: {
    starter: {
      title: 'Starter',
      description: 'Pour les petites équipes qui démarrent.',
      price: '9 €',
      button: "Démarrer l'essai gratuit",
      badge: 'Le plus populaire',
      features: {
        projects: 'Projets illimités',
        history: 'Historique sur 30 jours',
        exports: 'Exports CSV et PDF',
        api: "Accès à l'API REST",
        sso: 'SSO et journaux d’audit',
      },
    },
    growth: {
      title: 'Growth',
      description: "Pour les équipes qui ont besoin d'automatisation et de contrôle.",
      price: '49 €',
      button: "Démarrer l'essai gratuit",
      features: {
        everything: 'Tout le forfait Starter',
        automation: 'Automatisation des flux',
        roles: 'Rôles et permissions granulaires',
        seats: 'Espace collaboratif (5 sièges)',
        support: 'Support prioritaire',
      },
    },
    free: {
      title: 'Gratuit',
      description: 'Pour découvrir le produit.',
      price: 'Gratuit',
      button: 'Commencer',
      feature: '3 projets par mois',
    },
    enterprise: {
      title: 'Entreprise',
      description: 'Volume élevé et SLA dédié.',
      price: 'Sur devis',
      period: '/ an',
      feature: 'API illimitée',
    },
    select: {
      title: 'Growth',
      description: 'Forfait recommandé.',
      button: 'Choisir ce forfait',
      feature: 'Projets illimités',
    },
    period: '/ mois',
    heading: 'Tarifs',
  },

  toast: {
    success: {
      title: 'Modifications enregistrées',
      description: 'Votre catalogue a été mis à jour sur tous les canaux.',
    },
    ai: {
      title: 'Synthèse disponible',
      description: '12 mots-clés correspondants trouvés. Le score global est de 88 %.',
    },
    warning: {
      title: 'Quota bientôt atteint',
      description: "Il ne vous reste plus qu'un crédit pour ce mois-ci.",
    },
    error: {
      title: "Échec de l'import",
      description: "Le fichier n'est pas un PDF valide, ou il est corrompu.",
    },
    info: {
      title: 'Nouvelle fonctionnalité',
      description: "L'export PDF est disponible sur le forfait Pro.",
    },
    titleOnly: { title: 'Export lancé' },
    dismissed: 'Notification fermée.',
    queue: {
      trigger: 'Afficher une notification',
      title: 'Fichier importé',
      description: 'Traitement terminé avec succès.',
    },
  },

  dropzone: {
    single: 'Import de fichier unique',
    multiple: 'Import de plusieurs fichiers',
  },

  dashboard: {
    workspaceLabel: "Choisir l'espace de travail",
    statuses: { matched: 'Compatible', review: 'À revoir', rejected: 'Faible' },

    candidate: {
      brand: 'aquellec',
      title: 'Mon espace candidat',
      analysis: {
        title: 'Lancer une analyse ATS',
        subtitle: 'Importez votre CV et collez la fiche de poste visée',
        resumeLabel: 'Votre CV (PDF)',
        company: { label: "Nom de l'entreprise", placeholder: 'Ex : Vercel, Doctolib', value: 'Vercel' },
        job: {
          label: 'Titre du poste',
          placeholder: 'Ex : Développeur Front-End Senior',
          value: 'Front-End Engineer',
        },
        description: {
          label: "Description de l'offre",
          placeholder: 'Collez ici la description du poste visé…',
          helper: 'Plus la description est détaillée, plus le score ATS est précis.',
          value:
            'Nous recherchons un(e) Développeur(se) Front-End Senior maîtrisant React, Next.js et TypeScript…',
        },
        cta: "Lancer l'analyse ATS",
      },
      advice: {
        title: 'Recommandations ATS',
        subtitle: 'Optimisations suggérées pour Front-End Engineer',
        badge: '3 conseils',
        body: 'Ajoutez des mots-clés relatifs aux tests (Vitest, Cypress) pour améliorer votre score auprès des recruteurs.',
        meta: "Dernière analyse : aujourd'hui",
        action: 'Voir le détail',
      },
      score: { label: 'Score ATS', status: 'Profil compatible' },
      quota: {
        title: 'Quota mensuel',
        label: 'Analyses du mois',
        unit: 'CV',
        helper: 'Forfait gratuit',
        action: 'Passer à la version Pro',
      },
      history: {
        title: 'Mes analyses récentes',
        subtitle: 'Historique de vos matchings ATS',
        columns: {
          position: 'Entreprise — Poste',
          score: 'Score ATS',
          status: 'Statut',
          date: 'Date',
          action: 'Action',
        },
        action: 'Rapport',
      },
    },

    recruiter: {
      brand: 'aquellec RH',
      title: 'Pipeline de recrutement',
      kpi: {
        matchLabel: 'Match moyen',
        matchCaption: 'Sur 24 candidatures',
        compatible: 'Profils compatibles',
        toReview: 'À revoir manuellement',
      },
      upload: {
        title: 'Import massif de CV',
        subtitle: "Glissez plusieurs PDF — analyse par lot via l'API",
      },
      history: {
        title: 'Historique des analyses',
        subtitle: 'Tri ATS et statuts de matching',
        columns: {
          candidate: 'Candidat / CV',
          job: 'Poste visé',
          score: 'Score ATS',
          status: 'Statut',
          date: 'Date',
          action: 'Action',
        },
        action: 'Rapport',
      },
    },
  },
};
