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
          Page <strong className="text-ink-800 dark:text-ink-100">{currentPage}</strong> sur{' '}
          <strong className="text-ink-800 dark:text-ink-100">{totalPages}</strong>
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

    overviews: {
      labels: {
        guidance: 'Quand y recourir',
        use: 'À utiliser quand',
        avoid: 'Choisir autre chose quand',
        anatomy: 'En composition',
        states: 'Les états où il vit',
        mark: 'Le filet ici',
      },

      states: {
        analysing: 'Analyse de 12 CV',
        quotaSpent: 'Quota mensuel épuisé',
        importedTitle: '12 CV importés',
        importedBody: 'Classés pour Senior Front-End Engineer. Deux ont franchi 75 %.',
        quotaTitle: 'Il vous reste 3 analyses ce mois-ci',
        quotaBody: 'Votre forfait se réinitialise le 1er septembre.',
        noApplicants:
          "Aucune candidature pour l'instant. Publiez l'offre ou importez des CV pour lancer le classement.",
        emptyPipelineTitle: 'Pipeline vide',
        emptyPipelineBody:
          "Ce poste n'a encore aucune candidature. Importez un lot de CV, ou partagez l'annonce pour commencer à en recevoir.",
        emptyPipelineAction: 'Importer des CV',
        parseFailedTitle: 'CV illisible',
        parseFailedBadge: 'Échec du parsing',
        parseFailedBody:
          "Le fichier est une image scannée : il n'y a aucun texte à comparer à l'offre. Demandez un PDF texte au candidat, ou saisissez le profil à la main.",
        upgrade: 'Changer de forfait',
      },

      specimens: {
        actions: {
          stageLabel: 'Étape du pipeline',
          screening: 'Présélection',
          interview: 'Entretien',
          offer: 'Proposition',
          runAnalysis: "Lancer l'analyse ATS",
          advance: "Passer à l'entretien",
          requestReferences: 'Demander les références',
          archive: 'Archiver',
          caption:
            "Une action principale par vue, et exactement une action IA. Le filet Flare sur le bord gauche du bouton d'analyse est la seule chose de cette rangée qui annonce qu'un modèle va lire quelque chose.",
        },
        forms: {
          roleLabel: 'Poste visé',
          roleHelper: 'Le score est calculé par rapport à cette annonce.',
          emailLabel: 'E-mail du candidat',
          emailError: "Cette adresse est incomplète : il manque un domaine après l'arobase.",
          jobLabel: "Description de l'offre",
          jobValue:
            "Vous porterez le front-end de notre expérience candidat : React, TypeScript, un design system partagé avec deux autres squads, et le travail d'accessibilité qu'exige un produit utilisé par des gens sous pression.",
          jobHelper: "Plus l'annonce est précise, plus le score est honnête.",
          caption:
            "Chaque champ porte le filet sur son bord d'attaque — neutre au repos, cobalt au focus, brique en erreur. Rien ne se déplace au changement d'état, parce que les 2px sont toujours là.",
        },
        feedback: {
          matched: 'Correspond',
          review: 'À revoir',
          rejected: 'Sous la barre',
          parsed: 'Lu par IA',
          draft: 'Brouillon',
          toastTitle: 'Analyse terminée',
          toastBody: 'Salomé Berthier obtient 88 % pour Senior Front-End Engineer.',
          errorTitle: '1 fichier sur 12 illisible',
          errorBody: 'theo-vasseur-cv.pdf est une image scannée. Demandez un PDF texte.',
          caption:
            "Le statut est porté par le filet et par le mot, jamais par la couleur seule — le même badge lu en niveaux de gris dit encore Correspond, À revoir ou Sous la barre.",
        },
        dataDisplay: {
          quotaLabel: 'Analyses ce mois-ci',
          quotaHelper: 'Forfait gratuit · réinitialisé le 1er septembre',
          columns: {
            candidate: 'Candidat',
            score: 'Score',
            status: 'Statut',
            received: 'Reçu le',
          },
          statuses: { matched: 'Correspond', review: 'À revoir', rejected: 'Sous la barre' },
          caption:
            "Les repères de seuil sont l'essentiel. 88 franchit la barre des 75, 61 se situe entre les deux, 43 n'en franchit aucune — et cela se voit sans lire un seul chiffre.",
        },
        surfaces: {
          applicationTitle: 'Salomé Berthier',
          applicationSubtitle: 'Senior Front-End Engineer · candidature du 24 août',
          matched: 'Correspond',
          applicationBody:
            "Huit ans de front-end produit, dont quatre sur un design system. Chaque mot-clé indispensable de l'annonce figure dans le CV, avec des dates qui concordent.",
          applicationMeta: 'Présélection · suivi par Nadia',
          openReport: 'Ouvrir le rapport',
          aiTitle: "Ce que le modèle a relevé",
          aiSubtitle: "Extrait du CV, pas du formulaire de candidature",
          aiBadge: 'IA',
          aiBody:
            "Le travail d'accessibilité est décrit deux fois mais jamais nommé comme compétence. À creuser en présélection : l'annonce y accorde beaucoup de poids et le score n'en tient pas compte.",
          aiMeta: 'Généré le 24 août · à relire avant partage',
          caption:
            "Deux feuilles, aucun contour. Ce qui les sépare, c'est l'élévation et le filet Flare le long de la seconde — le seul signal indiquant qu'une machine en a écrit le contenu.",
        },
        templates: {
          pages: [
            {
              kicker: 'Template',
              label: 'Dashboard candidat',
              body: "Import, poste visé, le score en une, quota et historique.",
              href: './?path=/docs/templates-candidatedashboard--documentation',
            },
            {
              kicker: 'Template',
              label: 'Dashboard recruteur',
              body: 'Import en lot, chiffres du pipeline en corps de titre, candidatures classées.',
              href: './?path=/docs/templates-recruiterdashboard--documentation',
            },
          ],
          caption:
            "Les templates sont l'endroit où la hiérarchie se démontre au lieu de se décrire : un chiffre domine, tout le reste est du soutien.",
        },
      },

      families: {
        actions: {
          kicker: 'Famille · Actions',
          title: 'Actions',
          description:
            "Boutons et segments exclusifs. Les contrôles qui engagent un recruteur — faire avancer un candidat, dépenser une analyse, changer le sujet de la page.",
          facts: [
            { label: 'Composants', value: '2' },
            { label: 'Variantes de bouton', value: '5' },
            { label: 'Cible minimale', value: '44px' },
          ],
          use: [
            "Une action principale par vue, et c'est la raison d'être de la page.",
            "La variante ai uniquement là où un modèle va lire ou écrire quelque chose.",
            'SegmentedControl pour deux à quatre vues exclusives des mêmes données.',
          ],
          avoid: [
            "Naviguer ailleurs : c'est un lien, et un lien doit ressembler à un lien.",
            "Plus de quatre segments ; au-delà c'est un select, pas un contrôle.",
            "Un bouton ghost comme seule action d'un écran. Personne ne le trouve.",
          ],
          mark: "Sur les deux dashboards, le score est composé en corps de titre sur l'unique panneau inversé, et chaque tête de section repose sur le filet pleine largeur. Ces deux dispositifs portent toute la page ; il n'y a presque aucune autre décoration, et exactement une couleur qui n'est pas un statut.",
          states:
            "Une analyse en cours garde son libellé et tourne sur place plutôt que de se transformer en spinner — un bouton qui perd son mot perd la raison pour laquelle on l'a pressé. Un quota épuisé désactive au lieu de masquer : le recruteur doit savoir que l'action existe.",
        },
        forms: {
          kicker: 'Famille · Formulaires',
          title: 'Formulaires',
          description:
            "Les champs à partir desquels une décision d'embauche se construit : le poste visé, le texte de l'annonce, et le CV lui-même. Tout ce qu'un candidat confie passe par là.",
          facts: [
            { label: 'Composants', value: '3' },
            { label: 'Erreurs', value: 'ARIA' },
            { label: 'Limite import', value: '5 Mo' },
          ],
          use: [
            "Toujours avec un label visible. Un placeholder n'est pas un label et disparaît quand on en a le plus besoin.",
            "Dropzone pour les CV, avec le format et la taille annoncés avant le dépôt, pas après.",
            "Textarea avec maxLength pour les annonces : le compteur répond avant qu'on pose la question.",
          ],
          avoid: [
            "Valider à chaque frappe. Attendez le blur ; corriger quelqu'un en plein mot est agressif.",
            "La couleur comme seul signe d'erreur — le filet, l'icône et la phrase doivent concorder.",
            "Masquer l'aide dès qu'une erreur apparaît. Le lecteur a besoin des deux.",
          ],
          mark: "Chaque champ porte le filet sur son bord d'attaque en permanence : neutre au repos, cobalt au focus, brique en erreur. C'est le moyen le moins cher de rendre l'état d'un long formulaire lisible du coin de l'œil.",
          states:
            "L'import garde le nom du fichier et affiche la progression dessus. Un parsing raté dit ce qui ne va pas avec le fichier puis quoi faire — les deux choses dont un candidat a besoin, et les deux que la plupart des erreurs d'upload omettent.",
        },
        feedback: {
          kicker: 'Famille · Retours',
          title: 'Retours',
          description:
            "Statuts, notifications et dialogues. Tout ce qui annonce ce qui vient d'arriver à une candidature, ou demande de confirmer ce qui ne pourra pas être défait.",
          facts: [
            { label: 'Composants', value: '3' },
            { label: 'Live regions', value: 'role=status' },
            { label: 'Erreurs', value: 'role=alert' },
          ],
          use: [
            "Badge pour un statut qui appartient à une ligne : correspond, à revoir, sous la barre.",
            "Toast pour ce qui s'est terminé pendant que le recruteur regardait ailleurs.",
            "Modal uniquement quand l'action suivante est destructrice ou réellement bloquante.",
          ],
          avoid: [
            "Un toast pour ce que le lecteur est déjà en train de regarder se produire.",
            "Une modale pour afficher de l'information : c'est une page, ou une carte sur celle où il est.",
            "Empiler plus de trois toasts ; au-delà, personne n'en lit aucun.",
          ],
          mark: "Chaque surface sémantique de cette famille porte le filet dans sa propre teinte sur le bord d'attaque : c'est ce qui rend un badge, un toast et une carte IA lisibles comme une seule famille plutôt que comme trois rectangles teintés.",
          states:
            "Un toast d'erreur prend role=\"alert\" et est annoncé immédiatement ; le reste attend son tour sur role=\"status\". Rien ne masque automatiquement une erreur, parce que le seul message qui mérite d'être lu est celui qu'on risque le plus de manquer.",
        },
        dataDisplay: {
          kicker: 'Famille · Données',
          title: 'Affichage de données',
          description:
            "Scores, classements, quotas. Les composants qui transforment une pile de CV en un ordre sur lequel quelqu'un va agir — et la raison pour laquelle cette librairie avait besoin d'une direction artistique plutôt que d'une palette.",
          facts: [
            { label: 'Composants', value: '3' },
            { label: 'Paliers de score', value: '75 · 50' },
            { label: 'Chiffres', value: 'Tabulaires' },
          ],
          use: [
            "ScoreGauge quand un score est la réponse de la page. En grand : c'est tout l'enjeu.",
            "DataTable quand la comparaison entre candidats compte plus que chacun d'eux.",
            'ProgressBar pour tout ce qui a un plafond : quota, sièges, avancement de lot.',
          ],
          avoid: [
            "Une jauge par ligne. Répétée en petit, c'est de la décoration ; utilisez le chiffre et le badge.",
            "Un score sans seuil affiché. Un pourcentage seul ne dit rien à un candidat.",
            "Classer par score sans montrer le score. Un ordre caché n'est pas un classement, c'est un verdict.",
          ],
          mark: "C'est ici que le filet mérite son nom. Les limites de palier sont tracées sur l'arc de la jauge et sur le rail de quota en repères de 2px, pour qu'un score se lise toujours face à la barre qu'il devait franchir, jamais dans le vide.",
          states:
            "Un tableau vide dit quoi faire ensuite plutôt que d'annoncer qu'il est vide. Un tableau en chargement conserve la largeur de ses colonnes pour que la page ne saute pas à l'arrivée des lignes — un tableau qui se réagence oblige à tout relire.",
        },
        surfaces: {
          kicker: 'Famille · Surfaces',
          title: 'Surfaces',
          description:
            "Cartes et cartes de forfait : les feuilles sur lesquelles tout le reste est posé. Dans ce système, une surface se définit par l'élévation et l'espace, presque jamais par un contour.",
          facts: [
            { label: 'Composants', value: '2' },
            { label: 'Variantes de Card', value: '4' },
            { label: "Paliers d'élévation", value: '4' },
          ],
          use: [
            'Card pour regrouper ce qui se lit ensemble et se traite ensemble.',
            "La variante ai uniquement pour du contenu généré par un modèle, et toujours annoncé comme tel.",
            'Card.Header / Body / Footer, pour que la même anatomie se répète partout.',
          ],
          avoid: [
            'Une carte autour d’un seul chiffre. Grossissez plutôt le chiffre.',
            'Imbriquer une carte dans une carte — utilisez un filet et du blanc.',
            "Un contour là où du blanc suffirait. La plupart des boîtes de la plupart des dashboards sont inutiles.",
          ],
          mark: "La carte IA est une feuille unie avec le filet Flare sur son bord d'attaque. Ni dégradé ni halo : sur une page presque sans contours, un bord de 2px suffit à identifier la seule surface écrite par une machine.",
          states:
            "Un pipeline vide est une carte avec une phrase et une action, pas une illustration et un point d'exclamation. Un parsing raté nomme la cause et propose la voie manuelle, parce que le candidat attend de toute façon.",
        },
        templates: {
          kicker: 'Famille · Templates',
          title: 'Templates',
          description:
            "Deux pages de référence qui assemblent la librairie en contexte produit — et l'endroit où l'argument de hiérarchie se tranche vraiment, parce qu'un design system ne vaut que l'écran le plus chargé qu'il produit.",
          facts: [
            { label: 'Templates', value: '2' },
            { label: 'Points de rupture', value: '4' },
            { label: 'Taille du héros', value: '116px' },
          ],
          use: [
            "Comme point de départ d'une vraie page, pas comme capture dans une présentation.",
            "Pour éprouver un changement de token sur un écran chargé avant de le livrer.",
            "Pour trancher un débat de hiérarchie avec quelque chose de rendu.",
          ],
          avoid: [
            "Les recopier tels quels. Ce sont des arguments sur l'emphase, pas une mise en page à hériter.",
            "Ajouter un second héros. Dès que deux choses sont les plus grosses, aucune ne l'est.",
          ],
          mark: "Sur les deux dashboards, le score est composé en corps de titre avec son seuil marqué dessous, et les têtes de section reposent sur le filet lourd. Ces deux dispositifs portent toute la page ; il n'y a presque aucune autre décoration.",
          states:
            "Les deux templates livrent leur état vide et leur état épuisé, parce qu'un recruteur rencontre le premier dès le premier jour et le second le jour où cela compte le plus.",
        },
      },
    },

    introduction: {
      heroKicker: 'Design system · Dossier',
      heroDescription:
        "Une librairie React typée pour les logiciels de recrutement : CV analysés, postes appariés, candidatures classées. Elle suit une direction artistique unique — papier chaud, encre froide, une marque partout où quelque chose a été mesuré — parce qu'un outil qui décide qui obtient un entretien doit avoir l'air de le prendre au sérieux.",
      facts: [
        { label: 'Runtime', value: 'React 18 · 19' },
        { label: 'Styles', value: 'Tailwind 3 · 4' },
        { label: 'Contraste minimal', value: 'WCAG 2.1 AA' },
        { label: 'Licence', value: 'MIT' },
      ],
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
        "Un seul fichier porte les fondations : src/lib/design-tokens.ts. Le preset Tailwind 3, la feuille de styles Tailwind 4 et cette page en sont trois rendus, donc ce que vous lisez ici est ce qui a réellement compilé. Les décomptes ci-dessous sont mesurés sur l'objet de tokens au rendu de la page — ils ne peuvent pas devenir faux.",
      factLabels: {
        hues: 'Teintes',
        colours: 'Tokens de couleur',
        typeSteps: 'Paliers typographiques',
        elevations: 'Élévations',
      },
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
    inStock: 'success',
    lowStock: 'warning',
    outOfStock: 'danger',
    aiSuggested: 'ai',
    draft: 'neutral',
    ok: 'success',
    error: 'danger',
    warning: 'warning',
    neutral: 'neutral',
    ai: 'ai',
  },

  card: {
    report: {
      title: 'Titre de carte',
      subtitle: 'Sous-titre de carte',
      badge: 'badge',
      body: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae.',
      meta: 'Métadonnée',
      action: 'Action',
    },
    ai: {
      title: 'Carte IA',
      subtitle: 'Sous-titre de carte',
      body: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae.',
      confidence: 'badge',
      action: 'Action',
    },
    plan: {
      title: 'Carte outline',
      subtitle: 'Sous-titre de carte',
      body: 'Nunc laoreet egestas nulla.',
    },
    tip: {
      title: 'Carte ghost',
      body: 'Nunc laoreet egestas nulla.',
    },
    section: {
      title: 'Titre de section',
      subtitle: 'Rendu en h2',
      body: 'Nunc laoreet egestas nulla.',
    },
    minimal: {
      title: 'Titre seul',
      body: 'Nunc laoreet egestas nulla.',
    },
  },

  input: {
    workspace: { label: 'Libellé', placeholder: 'Placeholder', value: 'Valeur' },
    email: { label: 'Email', placeholder: 'nom@example.com', error: "Message d'erreur" },
    password: { label: 'Mot de passe', helper: "Texte d'aide" },
    search: { label: 'Rechercher', placeholder: 'Placeholder' },
  },

  textarea: {
    description: {
      label: 'Libellé',
      placeholder: 'Placeholder',
      helper: "Texte d'aide",
      error: "Message d'erreur",
      value: 'Nunc laoreet egestas nulla',
    },
    note: { label: 'Libellé', helper: "Texte d'aide" },
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
      label: 'Libellé',
      helper: "Texte d'aide",
      helperNearLimit: "Texte d'aide",
      action: 'Action',
    },
    seats: { label: 'Libellé' },
    undefined: { label: 'Libellé' },
    processing: 'Progression',
  },

  gauge: {
    performance: 'Score',
    quality: 'Rating',
    health: 'Level',
    match: 'Match',
  },

  table: {
    columns: {
      name: 'Nom',
      category: 'Catégorie',
      status: 'Statut',
      price: 'Prix',
      updated: 'Mis à jour',
      action: 'Action',
      empty: 'Vide',
    },
    categories: { audio: 'Catégorie A', accessories: 'Catégorie B', displays: 'Catégorie C' },
    statuses: { active: 'actif', review: 'en attente', archived: 'archivé' },
    rowAction: 'Ouvrir',
    emptyMessage: 'Nunc laoreet egestas nulla.',
  },

  modal: {
    /* Ouvre la modale : les stories la rendent fermée, comme sur la page de doc. */
    trigger: 'Ouvrir la modale',
    report: {
      trigger: 'Ouvrir la modale',
      title: 'Titre de modale',
      intro: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae',
      campaign: 'Vestibulum',
      checklist: 'Nullam quis risus',
      items: {
        deliverability: 'success',
        formatting: 'success',
        links: 'success',
        images: 'danger',
      },
      secondary: 'annuler',
      primary: 'confirmer',
    },
    confirm: {
      title: 'Titre de modale',
      body: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae.',
    },
    overlay: {
      title: 'Titre de modale',
      body: 'Cliquer sur le fond ferme le dialogue.',
    },
    keyboard: {
      title: 'Titre de modale',
      body: 'Nunc laoreet egestas nulla.',
      cancel: 'annuler',
      submit: 'confirmer',
    },
    untitled: {
      ariaLabel: 'Dialogue sans titre visible',
      body: 'Nunc laoreet egestas nulla.',
    },
    headerClose: {
      title: 'Titre de modale',
      body: 'Nunc laoreet egestas nulla.',
    },
    noFocusable: {
      ariaLabel: 'Contenu sans élément focusable',
      body: 'Nunc laoreet egestas nulla.',
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
      description: 'Nunc laoreet egestas nulla.',
      price: '$9',
      button: 'Choisir Starter',
      badge: 'Le plus populaire',
      features: {
        projects: 'Fonctionnalité une',
        history: 'Fonctionnalité deux',
        exports: 'Fonctionnalité trois',
        api: 'Fonctionnalité quatre',
        sso: 'Fonctionnalité cinq',
      },
    },
    growth: {
      title: 'Growth',
      description: 'Nunc laoreet egestas nulla.',
      price: '$49',
      button: 'Choisir Growth',
      features: {
        everything: 'Tout le forfait Starter',
        automation: 'Fonctionnalité deux',
        roles: 'Fonctionnalité trois',
        seats: 'Fonctionnalité quatre',
        support: 'Fonctionnalité cinq',
      },
    },
    free: {
      title: 'Gratuit',
      description: 'Nunc laoreet egestas nulla.',
      price: 'Gratuit',
      button: 'Choisir Free',
      feature: 'Fonctionnalité une',
    },
    enterprise: {
      title: 'Entreprise',
      description: 'Nunc laoreet egestas nulla.',
      price: 'Sur devis',
      period: '/ an',
      feature: 'Fonctionnalité une',
    },
    select: {
      title: 'Growth',
      description: 'Nunc laoreet egestas nulla.',
      button: 'Choisir ce forfait',
      feature: 'Fonctionnalité une',
    },
    period: '/ mois',
    heading: 'Tarifs',
  },

  toast: {
    success: { title: 'success', description: 'Nunc laoreet egestas nulla.' },
    ai: { title: 'ai', description: 'Nunc laoreet egestas nulla.' },
    warning: { title: 'warning', description: 'Nunc laoreet egestas nulla.' },
    error: { title: 'error', description: 'Nunc laoreet egestas nulla.' },
    info: { title: 'info', description: 'Nunc laoreet egestas nulla.' },
    titleOnly: { title: 'Titre seul' },
    dismissed: 'Toast fermé.',
    queue: {
      trigger: 'Afficher un toast',
      title: 'success',
      description: 'Nunc laoreet egestas nulla.',
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
      hero: {
        kicker: 'Score ATS',
        against: 'pour',
        verdict:
          "Franchit la barre des 75 % pour ce poste. Deux des trois compétences indispensables de l'annonce figurent dans votre CV avec des dates qui concordent ; la troisième est décrite mais jamais nommée.",
        scaleReview: 'À revoir',
        scaleBar: 'Barre',
        railLabel: 'Score de correspondance face aux seuils de palier',
      },
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
      hero: {
        kicker: 'Pipeline',
        role: 'Senior Front-End Engineer',
        applications: 'candidatures',
        matched: 'ont franchi la barre',
        review: 'à relire à la main',
        rejected: 'sous la barre',
        verdict:
          "Dix-huit candidatures sur vingt-quatre franchissent 75 %. Six se situent entre les deux barres et demandent une lecture humaine avant d'annoncer quoi que ce soit.",
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
