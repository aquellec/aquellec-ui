/*
  Reference dictionary for the stories.

  `en` is the source of truth: the `Dictionary` type is derived from it and every
  other locale must match. A missing or extra key in `fr.tsx` is therefore a
  compile error rather than a string missing at runtime.

  Examples are written in the product's own domain: resumes, match scores, ATS
  statuses, hiring pipelines. An earlier pass had made them domain agnostic, on
  the reasoning that a reader should not have to parse a scenario before seeing
  the component — sound in principle, but the execution replaced the scenarios
  with lorem ipsum and with the variant names themselves ('success', 'Label',
  'Placeholder'). That is not neutrality, it is the absence of content: it hides
  how a component behaves under a real label length, and it gives a reviewer
  nothing to judge the design against.

  The rule that survives from that pass is the useful one — no narrative. A
  label reads 'Shortlisted', not a three-sentence story about a candidate.
*/
import {
  defaultDataTableLabels,
  type DataTableLabels,
} from '../../src/components/DataTable/DataTable';
import {
  defaultDropzoneLabels,
  type DropzoneLabels,
} from '../../src/components/Dropzone/Dropzone';
import { DEFAULT_MODAL_CLOSE_LABEL } from '../../src/components/Modal/Modal';
import {
  defaultScoreGaugeStatusLabels,
  type ScoreGaugeStatusLabels,
} from '../../src/components/ScoreGauge/ScoreGauge';
import { DEFAULT_TOAST_CLOSE_LABEL } from '../../src/components/Toast/Toast';

/*
  Component-owned copy, passed through their `labels` props.

  English is the components' own default, so this locale simply re-exports those
  defaults instead of duplicating them. The block is annotated rather than
  `satisfies`-ed so `Dictionary` carries the component interfaces: with literal
  types, a wider translation would not be assignable.
*/
export interface ComponentLabels {
  dropzone: DropzoneLabels;
  dataTable: DataTableLabels;
  gaugeStatus: ScoreGaugeStatusLabels;
  modalClose: string;
  toastClose: string;
  toastRegion: string;
  pricingIncluded: string;
  pricingExcluded: string;
  pricingFeatures: (planTitle: string) => string;
}

const components: ComponentLabels = {
  dropzone: defaultDropzoneLabels,
  dataTable: defaultDataTableLabels,
  gaugeStatus: defaultScoreGaugeStatusLabels,
  modalClose: DEFAULT_MODAL_CLOSE_LABEL,
  toastClose: DEFAULT_TOAST_CLOSE_LABEL,
  toastRegion: 'Notifications',
  pricingIncluded: 'Included: ',
  pricingExcluded: 'Not included: ',
  pricingFeatures: (planTitle) => `${planTitle} plan features`,
};

export const en = {
  components,

  /*
    Copy of the MDX documentation pages. Prose that carries inline formatting is
    stored as `ReactNode`, so a translation keeps control of where the emphasis
    and the code spans fall.
  */
  docs: {
    /*
      Component descriptions rendered at the top of every autodocs page, keyed by
      story title. The custom docs page reads them, so they follow the toolbar
      locale; the JSDoc block above each meta stays as the in-editor reference.
    */
    components: {
      'Actions/Button': 'Action button of the design system. Use primary for main actions, ai for generative workflows, outline and ghost for secondary ones.',
      'Actions/SegmentedControl': 'Group of exclusive segments. Options are passed as a prop, and the WAI-ARIA radio group pattern gives it a roving tabindex, arrow keys and Home / End.',
      'Forms/Input': 'Single-line text field. Label, error message and helper text are tied together through htmlFor and aria-describedby.',
      'Forms/Textarea': 'Multi-line input for descriptions and long notes. Shows a character counter as soon as maxLength is set.',
      'Forms/Dropzone': 'Drag-and-drop upload zone. Single and multiple modes, size and type validation, loading and disabled states. Every string is overridable through the labels prop.',
      'Feedback/Toast': 'Transient notification. The error variant switches to role="alert" so it is announced immediately; the others use role="status".',
      'Feedback/Modal': 'Accessible modal dialog. Dismissed with Escape, the overlay or the close button, with the title wired through aria-labelledby, focus trapped and restored on close.',
      'Feedback/Badge': 'Compact label for a status, a category or an extracted value. Semantic variants make scanning easier.',
      'Data Display/DataTable': 'Data table with custom columns, pagination and loading or empty states. Any row shape is accepted through Column<T>.',
      'Data Display/Card': 'Structured container grouping content, actions and metadata, composed of Card.Header, Card.Body and Card.Footer.',
      'Data Display/PricingCard': 'Pricing card. isPopular highlights a plan, and included as well as excluded features are both announced to screen readers.',
      'Data Display/ScoreGauge': 'Circular gauge for a score out of 100. The color follows the tier and the value is exposed as a meter, so it is announced as a value.',
      'Data Display/ProgressBar': 'Generic progress bar for quotas, consumption or fill level. No copy is hardcoded, and the color switches at configurable thresholds.',
      'Templates/CandidateDashboard': 'Candidate page template: resume upload, job description, ATS score and analysis history.',
      'Templates/RecruiterDashboard': 'Recruiter page template: bulk resume import, KPIs and analysis history.',
    },
    sections: {
      pillars: { kicker: 'Foundations', title: 'Design system pillars' },
      catalog: { kicker: 'Catalog', title: 'Library architecture' },
      quickStart: { kicker: 'Getting started', title: 'Quick start' },
      governance: { kicker: 'Quality contract', title: 'Quality and governance' },
      brandColors: { kicker: 'Palettes', title: 'Brand colors' },
      semanticTokens: { kicker: 'Palettes', title: 'Semantic tokens' },
      radii: { kicker: 'Foundations', title: 'Radii and elevations' },
      typography: { kicker: 'Foundations', title: 'Typography' },
      focus: { kicker: 'Accessibility', title: 'Focus' },
      viewports: { kicker: 'Responsive', title: 'Viewports' },
      tokenUsage: { kicker: 'Consumption', title: 'Using the tokens' },
    },

    introduction: {
      heroKicker: 'Design System · React 19 · Tailwind CSS',
      heroDescription:
        'Typed React component library for recruitment and AI analysis SaaS products: resume parsing, ATS matching, candidate and recruiter workspaces, quotas and score visualisation.',
      chips: {
        typescript: 'TypeScript strict',
        wcag: 'WCAG 2.1 AA',
        preset: 'Exportable Tailwind preset',
        storybook: 'Storybook 10 + Vitest',
      },
      pillars: {
        accessibility: {
          title: 'Accessibility first',
          body: 'Components built on WAI-ARIA APG patterns: associated labels, live regions, semantic roles. Dialog with a focus trap, focus restoration, Escape key and inert background content. Contrast targets WCAG 2.1 AA, checked through the Storybook a11y addon.',
        },
        domain: {
          title: 'Recruitment SaaS domain',
          body: 'Components designed for real journeys: PDF upload, candidate and recruiter switch, ATS score gauge, paginated tables, quota bars and pricing cards. Dashboard templates live in the Templates section.',
        },
        dx: {
          title: 'Developer experience',
          body: 'Props extended from native HTML attributes, discriminated TypeScript unions, styling through cn() (clsx + tailwind-merge). Light runtime: no heavy UI library, lucide-react as a peer dependency only.',
        },
      },
      families: {
        actions: 'Primary and AI buttons, exclusive segments with keyboard navigation.',
        forms: 'Forms with ARIA errors, PDF drop zone using a native label and drag-and-drop.',
        feedback: 'Live region notifications, provider-backed queue, modal dialogs, compact statuses.',
        dataDisplay: 'ATS score, paginated tables with skeletons, quotas and consumption.',
        surfaces: 'Composable Header / Body / Footer surfaces, SaaS plan cards.',
        templates: 'Reference pages assembling the components in product context.',
      },
      catalogIntro:
        'The catalog is organised into five families. Every component ships interactive stories, an Autodocs page and — where relevant — Vitest tests run from Storybook.',
      composablePatterns: 'Composable patterns',
      compoundIntro: 'Most structural blocks follow a compound split:',
      sharedUtilities: 'Shared utilities (cn, focusRing, semantic tokens) are exported from the package root. Visual reference for colors and viewports:',
      steps: {
        install: '1. Install the package',
        peerDependencies:
          'react, react-dom and lucide-react are peer dependencies — install them in your host application.',
        configureTailwind: '2. Configure Tailwind CSS',
        presetIntro:
          'Import the design system preset to inherit the brand, ai and semantic.* tokens:',
        esmEquivalent: 'ESM / TypeScript equivalent:',
        importComponents: '3. Import the components',
        developLocally: '4. Develop and document locally',
      },
      governance: {
        axis: 'Axis',
        practice: 'Practice',
        accessibility: 'Accessibility',
        accessibilityBody: '@storybook/addon-a11y enabled on every story, in blocking mode.',
        interactions: 'Interactions',
        interactionsBody: 'Vitest play() tests through @storybook/addon-vitest.',
        viewports: 'Viewports',
        viewportsBody: 'Mobile 375 · Tablet 768 · Desktop 1280 · Wide 1536.',
        typing: 'Typing',
        typingBody: 'strict: true, .d.ts declarations emitted to dist/.',
      },
      tokensNote:
        'For any token or contrast change, update src/lib/design-tokens.ts: the preset and the Tokens page both derive from it.',
    },

    tokens: {
      heroKicker: 'Foundations · Tailwind preset',
      heroTitle: 'Design Tokens',
      heroDescription:
        'Single source for the foundations: src/lib/design-tokens.ts. The Tailwind preset shipped by the package and this page are both generated from that file, so the values below are always the ones actually compiled.',
      brandIntro:
        'Two complete ten-step scales, exported by the preset as brand and ai. Steps 500 / 600 / 700 carry the documented roles — accent, action, AA-compliant text on white.',
      scaleUsage: {
        brand: 'Actions, links, navigation',
        ai: 'AI features: scoring, summaries, generative buttons',
      },
      roles: { accent: 'Accent', action: 'Action', aaText: 'AA text' },
      semanticIntro:
        'Consumed by Badge, Toast, Dropzone and Input through the helpers in src/lib/semantic-colors.ts, never as raw colors. Every family exposes four roles: fg (text and icon), bg (chip background), border and surface (banner background).',
      semanticNote:
        'bg and surface currently share the same value across all four families: the distinction exists so they can be split later without touching the components.',
      semanticGroups: {
        success: { label: 'Success', usage: 'Validated match, successful import' },
        error: { label: 'Error', usage: 'Rejection, parsing failure' },
        warning: { label: 'Warning', usage: 'Quota nearly reached, average score' },
        info: { label: 'Information', usage: 'Neutral, contextual help' },
      },
      neutral: {
        token: 'Token',
        value: 'Value',
        usage: 'Usage',
        muted: 'Secondary text, captions',
        subtle: 'Muted body text, controls',
      },
      radii: 'Radii',
      elevations: 'Elevations',
      typeScale: 'Type scale',
      typeScaleSubtitle: 'Default Tailwind utilities · system font stack',
      typeSample: 'Optimise your resume for ATS',
      typeUsage: {
        xs: 'Labels, badges, metadata',
        sm: 'Body text, tables, forms',
        base: 'Dialog titles, main content',
        lg: 'Section titles',
        xl: 'Template page headers',
        xl2: 'Dashboard KPIs',
        xl3: 'Pricing hero',
      },
      focusRings: 'Focus rings',
      focusIntro:
        'Centralised in src/lib/focus-ring.ts. Navigate with the keyboard (Tab) to see them — they are focus-visible only, so invisible on click.',
      focusNote:
        'All three rings are focus-visible only: they appear on keyboard navigation, never on click. They sit on top of a transparent outline, which keeps focus visible in forced-colors mode — so removing them through className leaves no focus indicator.',
      focusVariants: {
        standard: 'Standard control',
        destructive: 'Destructive action',
        quiet: 'Quiet button',
      },
      viewportsTitle: 'Storybook viewports',
      pinViewport: 'Pinning a viewport on a story',
      pinViewportNote:
        'When a viewport is set through globals it is applied automatically and can no longer be changed from the toolbar — useful to pin a test case.',
      shortcuts: 'Keyboard shortcuts: next viewport Alt + V · previous Alt + Shift + V · reset Alt + Ctrl + V.',
      presetHeading: 'Through the Tailwind preset',
      presetIntro: 'Tokens reach a host application through the preset — there is no stylesheet to import:',
      presetNote: 'The preset also carries the prefers-reduced-motion animation reset.',
      outsideHeading: 'Outside Tailwind',
      outsideIntro:
        'The raw objects stay available for uses outside utility classes (charts, emails, canvas):',
      outsideNote:
        'Every change goes through src/lib/design-tokens.ts: the preset, the components and this page all derive from it automatically.',
    },
  },

  common: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    save: 'Save',
    viewDetails: 'View details',
    download: 'Download PDF',
    upgrade: 'Upgrade plan',
    freePlan: 'Free plan',
    today: 'Today',
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
    inStock: 'Shortlisted',
    lowStock: 'To review',
    outOfStock: 'Not retained',
    aiSuggested: 'AI extracted',
    draft: 'Sourced',
    ok: 'success',
    error: 'danger',
    warning: 'warning',
    neutral: 'neutral',
    ai: 'ai',
  },

  card: {
    report: {
      title: 'Application summary',
      subtitle: 'Senior Front-End Engineer',
      badge: 'Shortlisted',
      body: 'Eight years of front-end work, four of them on design systems. Matches the required React and TypeScript experience; no accessibility work stated.',
      meta: 'Analysed 12 minutes ago',
      action: 'Open the resume',
    },
    ai: {
      title: 'Extracted from the resume',
      subtitle: 'Fields read by the parser, not entered by hand',
      body: 'Nine years of experience, last role held for three years, notice period of two months. Salary expectation was not stated in the document.',
      confidence: 'AI extracted',
      action: 'Check against the source',
    },
    plan: {
      title: 'Screening call',
      subtitle: 'Scheduled by the hiring manager',
      body: 'Thirty minutes, remote. Confirm the notice period and the expected range before the technical round.',
    },
    tip: {
      title: 'Two roles left unfilled',
      body: 'Both have been open for more than sixty days. Widening the location criteria would triple the matching pool.',
    },
    section: {
      title: 'Evaluation',
      subtitle: 'Rendered as an h2',
      body: 'Three interviewers submitted a scorecard. The technical round is the only one still pending.',
    },
    minimal: {
      title: 'Pipeline',
      body: 'Twenty-four applications received, six shortlisted.',
    },
  },

  input: {
    workspace: {
      label: 'Job title',
      placeholder: 'Senior Front-End Engineer',
      value: 'Senior Front-End Engineer',
    },
    email: {
      label: 'Candidate email',
      placeholder: 'first.last@example.com',
      error: 'This address is already attached to another application.',
    },
    password: { label: 'ATS access key', helper: 'Used to sync with the applicant tracking system.' },
    search: { label: 'Search candidates', placeholder: 'Name, skill or job reference' },
  },

  textarea: {
    description: {
      label: 'Job description',
      placeholder: 'Paste the description the ATS will match against',
      helper: 'The more precise the description, the more reliable the match score.',
      error: 'A description is required to run the analysis.',
      value: 'We are looking for a senior front-end engineer with solid React and TypeScript experience, comfortable owning a design system and its accessibility.',
    },
    note: {
      label: 'Interview notes',
      helper: 'Visible to the hiring team only. Never sent to the candidate.',
    },
  },

  segmented: {
    period: { label: 'Period', week: 'week', month: 'month', quarter: 'quarter' },
    view: { label: 'View mode', grid: 'grid', list: 'list' },
    workspace: {
      label: 'Workspace',
      candidate: 'Candidate space',
      recruiter: 'Recruiter space',
      active: 'Active workspace:',
    },
  },

  progress: {
    storage: { label: 'Label', unit: 'of' },
    credits: {
      label: 'Resume analyses this month',
      helper: 'Resets on the first of the month.',
      helperNearLimit: 'Close to the plan limit — analyses will queue once it is reached.',
      action: 'Change plan',
    },
    seats: { label: 'Recruiter seats used' },
    undefined: { label: 'Analyses run' },
    processing: 'Parsing the resume',
  },

  gauge: {
    performance: 'ATS score',
    quality: 'Resume quality',
    health: 'Profile completeness',
    match: 'Match',
  },

  table: {
    columns: {
      name: 'Candidate',
      category: 'Role applied for',
      status: 'Status',
      price: 'ATS score',
      updated: 'Analysed',
      action: 'Action',
      empty: 'Empty',
    },
    categories: {
      audio: 'Front-End Engineer',
      accessories: 'Full-Stack Developer',
      displays: 'Product Designer',
    },
    statuses: { active: 'Shortlisted', review: 'To review', archived: 'Not retained' },
    rowAction: 'Open',
    emptyMessage: 'No application has been analysed for this role yet.',
  },

  modal: {
    /* Opens the modal: the stories render it closed, as on the documentation page. */
    trigger: 'Open the modal',
    report: {
      trigger: 'Open the ATS report',
      title: 'ATS report',
      intro: 'Fields the parser could read from the resume submitted for',
      campaign: 'Senior Front-End Engineer',
      checklist: 'Extraction check',
      items: {
        deliverability: 'Contact details',
        formatting: 'Work history',
        links: 'Skills',
        images: 'Certifications',
      },
      secondary: 'Close',
      primary: 'Shortlist',
    },
    confirm: {
      title: 'Reject this application?',
      body: 'The candidate moves out of the pipeline. Nothing is sent to them until you send the rejection yourself.',
    },
    overlay: {
      title: 'Analysis details',
      body: 'Clicking the overlay dismisses the dialog.',
    },
    keyboard: {
      title: 'Move to the technical round',
      body: 'The hiring manager is notified and the candidate keeps their current status until the interview is scheduled.',
      cancel: 'Cancel',
      submit: 'Move forward',
    },
    untitled: {
      ariaLabel: 'Dialog without a visible title',
      body: 'The resume has been queued. The score appears once parsing completes.',
    },
    headerClose: {
      title: 'Screening summary',
      body: 'Six of the eight required skills were found in the resume.',
    },
    noFocusable: {
      ariaLabel: 'Content with no focusable element',
      body: 'No application matches the current filters.',
    },
    compound: {
      title: 'Composed header',
      body: 'Body rendered through a sub-component.',
      confirm: 'ok',
    },
  },

  pricing: {
    starter: {
      title: 'Starter',
      description: 'One recruiter, one open role at a time.',
      price: '$9',
      button: 'Choose Starter',
      badge: 'Most popular',
      features: {
        projects: '50 resume analyses per month',
        history: '90 days of analysis history',
        exports: 'CSV export',
        api: 'ATS integration',
        sso: 'SSO',
      },
    },
    growth: {
      title: 'Growth',
      description: 'A hiring team running several roles in parallel.',
      price: '$49',
      button: 'Choose Growth',
      features: {
        everything: 'Everything in Starter',
        automation: '500 resume analyses per month',
        roles: 'Unlimited open roles',
        seats: 'Five recruiter seats',
        support: 'Priority support',
      },
    },
    free: {
      title: 'Free',
      description: 'Try the parser on a handful of resumes.',
      price: 'Free',
      button: 'Choose Free',
      feature: '10 resume analyses per month',
    },
    enterprise: {
      title: 'Enterprise',
      description: 'In-house recruitment at scale, with your own ATS.',
      price: 'Custom',
      period: '/ year',
      feature: 'Unlimited analyses and seats',
    },
    select: {
      title: 'Growth',
      description: 'A hiring team running several roles in parallel.',
      button: 'Choose this plan',
      feature: '500 resume analyses per month',
    },
    period: '/ month',
    heading: 'Pricing',
  },

  toast: {
    success: { title: 'Resume analysed', description: 'Match score available on the application.' },
    ai: { title: 'Parsing in progress', description: 'Twelve resumes queued, about two minutes left.' },
    warning: {
      title: 'Approaching the monthly limit',
      description: '46 of 50 analyses used on the Starter plan.',
    },
    error: {
      title: 'Resume could not be read',
      description: 'The PDF is a scan with no text layer. Ask for a text version.',
    },
    info: { title: 'Job description updated', description: 'Scores will be recomputed tonight.' },
    titleOnly: { title: 'Shortlist saved' },
    dismissed: 'Toast dismissed.',
    queue: {
      trigger: 'Push a toast',
      title: 'Resume analysed',
      description: 'Match score available on the application.',
    },
  },

  dropzone: {
    single: 'Single file upload',
    multiple: 'Multiple file upload',
  },

  dashboard: {
    workspaceLabel: 'Choose a workspace',
    statuses: { matched: 'Match', review: 'To review', rejected: 'Low' },

    candidate: {
      brand: 'aquellec',
      title: 'My candidate space',
      analysis: {
        title: 'Run an ATS analysis',
        subtitle: 'Upload your resume and paste the target job description',
        resumeLabel: 'Your resume (PDF)',
        company: { label: 'Company name', placeholder: 'e.g. Vercel, Doctolib', value: 'Vercel' },
        job: {
          label: 'Job title',
          placeholder: 'e.g. Senior Front-End Developer',
          value: 'Front-End Engineer',
        },
        description: {
          label: 'Job description',
          placeholder: 'Paste the job description here…',
          helper: 'The more detailed the description, the more accurate the score.',
          value:
            'We are looking for a Senior Front-End Developer with strong React, Next.js and TypeScript skills…',
        },
        cta: 'Run the ATS analysis',
      },
      advice: {
        title: 'ATS recommendations',
        subtitle: 'Suggested improvements for Front-End Engineer',
        badge: '3 tips',
        body: 'Add keywords about automated testing (Vitest, Cypress) to improve your score with recruiters.',
        meta: 'Last analysis: today',
        action: 'View details',
      },
      score: { label: 'ATS score', status: 'Profile is a match' },
      quota: {
        title: 'Monthly quota',
        label: 'Analyses this month',
        unit: 'resumes',
        helper: 'Free plan',
        action: 'Upgrade plan',
      },
      history: {
        title: 'My recent analyses',
        subtitle: 'History of your ATS matches',
        columns: {
          position: 'Company — Role',
          score: 'ATS score',
          status: 'Status',
          date: 'Date',
          action: 'Action',
        },
        action: 'Report',
      },
    },

    recruiter: {
      brand: 'aquellec HR',
      title: 'Hiring pipeline',
      kpi: {
        matchLabel: 'Average match',
        matchCaption: 'Across 24 applications',
        compatible: 'Matching profiles',
        toReview: 'To review manually',
      },
      upload: {
        title: 'Bulk resume import',
        subtitle: 'Drop several PDFs — batch analysis through the API',
      },
      history: {
        title: 'Analysis history',
        subtitle: 'ATS ranking and match statuses',
        columns: {
          candidate: 'Candidate / resume',
          job: 'Target role',
          score: 'ATS score',
          status: 'Status',
          date: 'Date',
          action: 'Action',
        },
        action: 'Report',
      },
    },
  },
};
