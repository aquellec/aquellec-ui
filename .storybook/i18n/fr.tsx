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
          Page <strong className="text-neutral-800 dark:text-neutral-100">{currentPage}</strong> sur{' '}
          <strong className="text-neutral-800 dark:text-neutral-100">{totalPages}</strong>
        </>
      ),
      scrollRegion: 'Tableau, défilement horizontal',
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
    components: {
      'Actions/Button': "Bouton d'action du design system. primary pour les actions principales, ai pour les traitements génératifs, outline et ghost pour le secondaire.",
      'Actions/SegmentedControl': 'Groupe de segments exclusifs. Les options sont passées en prop, et le pattern radiogroup WAI-ARIA lui donne un roving tabindex, les flèches et Home / End.',
      'Forms/Input': "Champ de saisie sur une ligne. Libellé, message d'erreur et texte d'aide sont reliés via htmlFor et aria-describedby.",
      'Forms/Textarea': 'Saisie multi-lignes pour descriptions et notes longues. Affiche un compteur de caractères dès que maxLength est défini.',
      'Forms/Dropzone': "Zone de dépôt par glisser-déposer. Modes simple et multiple, validation de taille et de type, états chargement et désactivé. Tous les textes sont surchargeables via la prop labels.",
      'Feedback/Toast': "Notification temporaire. La variante error passe en role=\"alert\" pour être annoncée sans attendre ; les autres utilisent role=\"status\".",
      'Feedback/Modal': "Dialogue modal accessible. Fermeture par Échap, par le fond ou par le bouton, titre relié en aria-labelledby, focus piégé et restitué à la fermeture.",
      'Feedback/Badge': 'Étiquette compacte pour un statut, une catégorie ou une valeur extraite. Les variantes sémantiques facilitent le scan visuel.',
      'Data Display/DataTable': "Tableau de données avec colonnes personnalisées, pagination et états chargement ou vide. N'importe quelle forme de ligne est acceptée via Column<T>.",
      'Data Display/Card': 'Conteneur structuré regroupant contenu, actions et métadonnées, composé de Card.Header, Card.Body et Card.Footer.',
      'Data Display/PricingCard': "Carte tarifaire. isPopular met un forfait en avant, et les fonctionnalités incluses comme exclues sont annoncées aux lecteurs d'écran.",
      'Data Display/ScoreGauge': 'Jauge circulaire pour un score sur 100. La couleur suit le palier et la valeur est exposée en meter, donc annoncée comme une valeur.',
      'Data Display/ProgressBar': 'Barre de progression générique pour quotas, consommation ou remplissage. Aucun texte codé en dur, et la couleur bascule à des seuils configurables.',
      'Templates/CandidateDashboard': "Template de page candidat : import de CV, fiche de poste, score ATS et historique des analyses.",
      'Templates/RecruiterDashboard': 'Template de page recruteur : import massif de CV, KPI et historique des analyses.',
    },
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
        "Les trois anneaux sont en focus-visible uniquement : ils apparaissent au clavier, jamais au clic. Ils s'appliquent par-dessus un contour transparent, qui garde le focus visible en contrastes forcés — donc les retirer via className ne laisse aucun indicateur de focus.",
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
    primary: 'primary',
    ai: 'ai',
    loading: 'loading',
    disabled: 'disabled',
    secondary: 'secondary',
    outline: 'outline',
    ghost: 'ghost',
    submit: 'submit',
  },

  badge: {
    inStock: 'Présélectionné',
    lowStock: 'À examiner',
    outOfStock: 'Non retenu',
    aiSuggested: 'Extrait par IA',
    draft: 'Sourcé',
    ok: 'success',
    error: 'danger',
    warning: 'warning',
    neutral: 'neutral',
    ai: 'ai',
  },

  card: {
    report: {
      title: 'Synthèse de candidature',
      subtitle: 'Ingénieur Front-End senior',
      badge: 'Présélectionné',
      body: "Huit ans en front-end, dont quatre sur des design systems. Correspond à l'expérience React et TypeScript demandée ; aucun travail d'accessibilité mentionné.",
      meta: 'Analysé il y a 12 minutes',
      action: 'Ouvrir le CV',
    },
    ai: {
      title: 'Extrait du CV',
      subtitle: 'Champs lus par le parseur, non saisis à la main',
      body: "Neuf ans d'expérience, dernier poste occupé trois ans, préavis de deux mois. La prétention salariale n'apparaît pas dans le document.",
      confidence: 'Extrait par IA',
      action: 'Vérifier sur la source',
    },
    plan: {
      title: 'Entretien de préqualification',
      subtitle: 'Planifié par le manager',
      body: 'Trente minutes, à distance. Confirmer le préavis et la fourchette attendue avant le tour technique.',
    },
    tip: {
      title: 'Deux postes non pourvus',
      body: "Ouverts depuis plus de soixante jours. Élargir le critère de localisation triplerait le vivier correspondant.",
    },
    section: {
      title: 'Évaluation',
      subtitle: 'Rendu en h2',
      body: "Trois évaluateurs ont rendu leur grille. Seul le tour technique reste en attente.",
    },
    minimal: {
      title: 'Pipeline',
      body: 'Vingt-quatre candidatures reçues, six présélectionnées.',
    },
  },

  input: {
    workspace: {
      label: 'Intitulé du poste',
      placeholder: 'Ingénieur Front-End senior',
      value: 'Ingénieur Front-End senior',
    },
    email: {
      label: 'Email du candidat',
      placeholder: 'prenom.nom@example.com',
      error: 'Cette adresse est déjà rattachée à une autre candidature.',
    },
    password: { label: "Clé d'accès ATS", helper: "Sert à la synchronisation avec l'ATS." },
    search: { label: 'Rechercher un candidat', placeholder: 'Nom, compétence ou référence de poste' },
  },

  textarea: {
    description: {
      label: 'Description du poste',
      placeholder: "Collez la description sur laquelle l'ATS fera le matching",
      helper: 'Plus la description est précise, plus le score de correspondance est fiable.',
      error: "Une description est nécessaire pour lancer l'analyse.",
      value: "Nous recherchons un ingénieur front-end senior, solide en React et TypeScript, à l'aise pour porter un design system et son accessibilité.",
    },
    note: {
      label: "Notes d'entretien",
      helper: "Visibles par l'équipe de recrutement uniquement. Jamais transmises au candidat.",
    },
  },

  segmented: {
    period: { label: 'Période', week: 'semaine', month: 'mois', quarter: 'trimestre' },
    view: { label: "Mode d'affichage", grid: 'grille', list: 'liste' },
    workspace: {
      label: 'Espace de travail',
      candidate: 'Espace Candidat',
      recruiter: 'Espace Recruteur',
      active: 'Espace actif :',
    },
  },

  progress: {
    storage: { label: 'Libellé', unit: 'sur' },
    credits: {
      label: 'Analyses de CV ce mois-ci',
      helper: 'Remis à zéro le 1er du mois.',
      helperNearLimit: "Proche de la limite du forfait — les analyses seront mises en file d'attente.",
      action: 'Changer de forfait',
    },
    seats: { label: 'Sièges recruteur utilisés' },
    undefined: { label: 'Analyses lancées' },
    processing: 'Lecture du CV',
  },

  gauge: {
    performance: 'Score ATS',
    quality: 'Qualité du CV',
    health: 'Complétude du profil',
    match: 'Correspondance',
  },

  table: {
    columns: {
      name: 'Candidat',
      category: 'Poste visé',
      status: 'Statut',
      price: 'Score ATS',
      updated: 'Analysé',
      action: 'Action',
      empty: 'Vide',
    },
    categories: {
      audio: 'Ingénieur Front-End',
      accessories: 'Développeur Full-Stack',
      displays: 'Product Designer',
    },
    statuses: { active: 'Présélectionné', review: 'À examiner', archived: 'Non retenu' },
    rowAction: 'Ouvrir',
    emptyMessage: "Aucune candidature n'a encore été analysée pour ce poste.",
  },

  modal: {
    /* Ouvre la modale : les stories la rendent fermée, comme sur la page de doc. */
    trigger: 'Ouvrir la modale',
    report: {
      trigger: 'Ouvrir le rapport ATS',
      title: 'Rapport ATS',
      intro: 'Champs que le parseur a pu lire dans le CV déposé pour',
      campaign: 'Ingénieur Front-End senior',
      checklist: "Contrôle d'extraction",
      items: {
        deliverability: 'Coordonnées',
        formatting: 'Parcours professionnel',
        links: 'Compétences',
        images: 'Certifications',
      },
      secondary: 'Fermer',
      primary: 'Présélectionner',
    },
    confirm: {
      title: 'Écarter cette candidature ?',
      body: "Le candidat sort du pipeline. Rien ne lui est envoyé tant que vous n'envoyez pas le refus vous-même.",
    },
    overlay: {
      title: "Détail de l'analyse",
      body: 'Cliquer sur le fond ferme le dialogue.',
    },
    keyboard: {
      title: 'Passer au tour technique',
      body: "Le manager est notifié et le candidat garde son statut tant que l'entretien n'est pas planifié.",
      cancel: 'Annuler',
      submit: 'Faire avancer',
    },
    untitled: {
      ariaLabel: 'Dialogue sans titre visible',
      body: "Le CV est en file d'attente. Le score apparaît dès que la lecture est terminée.",
    },
    headerClose: {
      title: 'Synthèse de préqualification',
      body: 'Six des huit compétences requises ont été trouvées dans le CV.',
    },
    noFocusable: {
      ariaLabel: 'Contenu sans élément focusable',
      body: 'Aucune candidature ne correspond aux filtres actuels.',
    },
    compound: {
      title: 'En-tête composé',
      body: 'Corps rendu via un sous-composant.',
      confirm: 'ok',
    },
  },

  pricing: {
    starter: {
      title: 'Starter',
      description: 'Un recruteur, un poste ouvert à la fois.',
      price: '$9',
      button: 'Choisir Starter',
      badge: 'Le plus populaire',
      features: {
        projects: '50 analyses de CV par mois',
        history: "90 jours d'historique d'analyses",
        exports: 'Export CSV',
        api: 'Intégration ATS',
        sso: 'SSO',
      },
    },
    growth: {
      title: 'Growth',
      description: 'Une équipe qui mène plusieurs postes en parallèle.',
      price: '$49',
      button: 'Choisir Growth',
      features: {
        everything: 'Tout le forfait Starter',
        automation: '500 analyses de CV par mois',
        roles: 'Postes ouverts illimités',
        seats: 'Cinq sièges recruteur',
        support: 'Support prioritaire',
      },
    },
    free: {
      title: 'Gratuit',
      description: 'Tester le parseur sur quelques CV.',
      price: 'Gratuit',
      button: 'Choisir Free',
      feature: '10 analyses de CV par mois',
    },
    enterprise: {
      title: 'Entreprise',
      description: 'Recrutement interne à grande échelle, avec votre ATS.',
      price: 'Sur devis',
      period: '/ an',
      feature: 'Analyses et sièges illimités',
    },
    select: {
      title: 'Growth',
      description: 'Une équipe qui mène plusieurs postes en parallèle.',
      button: 'Choisir ce forfait',
      feature: '500 analyses de CV par mois',
    },
    period: '/ mois',
    heading: 'Tarifs',
  },

  toast: {
    success: { title: 'CV analysé', description: 'Score de correspondance disponible sur la candidature.' },
    ai: { title: 'Lecture en cours', description: "Douze CV en file d'attente, environ deux minutes." },
    warning: {
      title: 'Limite mensuelle proche',
      description: '46 analyses sur 50 utilisées avec le forfait Starter.',
    },
    error: {
      title: 'CV illisible',
      description: 'Le PDF est un scan sans couche texte. Demandez une version texte.',
    },
    info: { title: 'Description du poste mise à jour', description: 'Les scores seront recalculés cette nuit.' },
    titleOnly: { title: 'Présélection enregistrée' },
    dismissed: 'Toast fermé.',
    queue: {
      trigger: 'Afficher un toast',
      title: 'CV analysé',
      description: 'Score de correspondance disponible sur la candidature.',
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
