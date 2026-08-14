/*
  Reference dictionary for the stories.

  `en` is the source of truth: the `Dictionary` type is derived from it and every
  other locale must match. A missing or extra key in `fr.tsx` is therefore a
  compile error rather than a string missing at runtime.

  Examples are deliberately domain agnostic (product catalog, storage, billing,
  team) — the design system is not tied to recruitment. Only the dashboard
  templates keep a business context.
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
        'All three rings are focus-visible only: they appear on keyboard navigation, never on click. They sit on top of an outline-none, so removing them through className leaves no focus indicator.',
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
    primary: 'Save changes',
    ai: 'Generate summary',
    loading: 'Saving…',
    disabled: 'Unavailable',
    secondary: 'View history',
    outline: 'Export data',
    ghost: 'Cancel',
    submit: 'Publish product',
  },

  badge: {
    inStock: 'In stock',
    lowStock: 'Low stock',
    outOfStock: 'Out of stock',
    aiSuggested: 'AI suggested',
    draft: 'Draft',
    ok: 'Passed',
    error: 'Failed',
    warning: 'Warning',
    neutral: 'Neutral',
    ai: 'AI',
  },

  card: {
    report: {
      title: 'Weekly summary',
      subtitle: 'Performance across all channels',
      badge: '3 insights',
      body: 'Conversion is up 12% week over week. Most of the lift comes from returning visitors on mobile.',
      meta: 'Last updated',
      action: 'View details',
    },
    ai: {
      title: 'AI summary',
      subtitle: 'Generated from the last 30 days of activity',
      body: 'Traffic quality improved steadily. Checkout abandonment remains the main drop-off point.',
      confidence: 'Confidence: 98%',
      action: 'Regenerate',
    },
    plan: {
      title: 'Starter plan',
      subtitle: 'Essential features',
      body: '3 projects included, unlimited collaborators.',
    },
    tip: {
      title: 'Tip of the day',
      body: 'Keyboard shortcuts speed up repetitive actions.',
    },
    section: {
      title: 'Main section',
      subtitle: 'Semantic h2 heading',
      body: 'Section content.',
    },
    minimal: {
      title: 'No subtitle, no action',
      body: 'Minimal content.',
    },
  },

  input: {
    workspace: {
      label: 'Workspace name',
      placeholder: 'e.g. Acme Inc.',
      value: 'Acme Inc.',
    },
    email: {
      label: 'Work email',
      placeholder: 'name@company.com',
      error: 'Enter a valid email address.',
    },
    password: {
      label: 'Password',
      helper: 'At least 8 characters, including one capital letter.',
    },
    search: {
      label: 'Search the catalog',
      placeholder: 'Product, SKU, category…',
    },
  },

  textarea: {
    description: {
      label: 'Product description',
      placeholder: 'Describe the product as it should appear in the catalog…',
      helper: 'The more detail you give, the better the generated summary.',
      error: 'The description must be at least 50 characters.',
      value: 'Wireless keyboard',
    },
    note: {
      label: 'Internal note',
      helper: '50 characters recommended.',
    },
  },

  segmented: {
    period: {
      label: 'Displayed period',
      week: 'Week',
      month: 'Month',
      quarter: 'Quarter',
    },
    view: {
      label: 'View mode',
      grid: 'Grid',
      list: 'List',
    },
    workspace: {
      label: 'Choose a workspace',
      candidate: 'Candidate space',
      recruiter: 'Recruiter space',
      active: 'Active workspace:',
    },
  },

  progress: {
    storage: { label: 'Storage used', unit: 'GB of' },
    credits: {
      label: 'Credits used',
      helper: 'Free plan',
      helperNearLimit: 'Quota almost reached',
      action: 'Upgrade plan',
    },
    seats: { label: 'Seats assigned' },
    undefined: { label: 'Quota not set' },
    processing: 'Processing progress',
  },

  gauge: {
    performance: 'Performance score',
    quality: 'Data quality',
    health: 'Account health',
    match: 'Overall match',
  },

  table: {
    columns: {
      name: 'Product',
      category: 'Category',
      status: 'Status',
      price: 'Price',
      updated: 'Updated',
      action: 'Action',
      empty: 'No value',
    },
    categories: {
      audio: 'Audio',
      accessories: 'Accessories',
      displays: 'Displays',
    },
    statuses: {
      active: 'Active',
      review: 'In review',
      archived: 'Archived',
    },
    rowAction: 'Open',
    emptyMessage: 'No product matches these filters yet.',
  },

  modal: {
    report: {
      trigger: 'View full report',
      title: 'Delivery report',
      intro: 'Detailed breakdown computed for the campaign',
      campaign: 'Spring launch',
      checklist: 'Checks performed:',
      items: {
        deliverability: 'Deliverability',
        formatting: 'Formatting',
        links: 'Links',
        images: 'Missing images',
      },
      secondary: 'Close',
      primary: 'Download PDF',
    },
    confirm: {
      title: 'Confirmation',
      body: 'Do you want to publish these changes?',
    },
    overlay: {
      title: 'Click outside to close',
      body: 'Clicking the overlay dismisses the dialog.',
    },
    keyboard: {
      title: 'Keyboard navigation',
      body: 'Dialog content with a focus trap.',
      cancel: 'Cancel',
      submit: 'Submit',
    },
    untitled: {
      ariaLabel: 'Dialog without a visible title',
      body: 'Dialog without a visible title.',
    },
    headerClose: {
      title: 'Report',
      body: 'Report content.',
    },
    noFocusable: {
      ariaLabel: 'Content with no focusable element',
      body: 'Content with no focusable element.',
    },
    compound: {
      title: 'Composed header',
      body: 'Body rendered through a sub-component.',
      confirm: 'OK',
    },
  },

  pricing: {
    starter: {
      title: 'Starter',
      description: 'For small teams getting started.',
      price: '$9',
      button: 'Start free trial',
      badge: 'Most popular',
      features: {
        projects: 'Unlimited projects',
        history: '30-day history',
        exports: 'CSV and PDF exports',
        api: 'REST API access',
        sso: 'SSO and audit logs',
      },
    },
    growth: {
      title: 'Growth',
      description: 'For teams that need automation and controls.',
      price: '$49',
      button: 'Start free trial',
      features: {
        everything: 'Everything in Starter',
        automation: 'Workflow automation',
        roles: 'Granular roles and permissions',
        seats: 'Collaborative workspace (5 seats)',
        support: 'Priority support',
      },
    },
    free: {
      title: 'Free',
      description: 'To explore the product.',
      price: 'Free',
      button: 'Get started',
      feature: '3 projects per month',
    },
    enterprise: {
      title: 'Enterprise',
      description: 'High volume and dedicated SLA.',
      price: 'Custom',
      period: '/ year',
      feature: 'Unlimited API',
    },
    select: {
      title: 'Growth',
      description: 'Recommended plan.',
      button: 'Choose this plan',
      feature: 'Unlimited projects',
    },
    period: '/ month',
    heading: 'Pricing',
  },

  toast: {
    success: {
      title: 'Changes saved',
      description: 'Your catalog has been updated across all channels.',
    },
    ai: {
      title: 'Summary ready',
      description: '12 matching keywords found. Overall score is 88%.',
    },
    warning: {
      title: 'Quota almost reached',
      description: 'You have 1 credit left for this month.',
    },
    error: {
      title: 'Upload failed',
      description: 'The file is not a valid PDF, or it is corrupted.',
    },
    info: {
      title: 'New feature',
      description: 'PDF export is available on the Pro plan.',
    },
    titleOnly: { title: 'Export started' },
    dismissed: 'Notification dismissed.',
    queue: {
      trigger: 'Show a notification',
      title: 'File uploaded',
      description: 'Processing completed successfully.',
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
