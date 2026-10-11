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

    overviews: {
      labels: {
        guidance: 'When to reach for it',
        use: 'Use it when',
        avoid: 'Use something else when',
        anatomy: 'In composition',
        states: 'The states it lives in',
        mark: 'The rule here',
      },

      states: {
        analysing: 'Analysing 12 resumes',
        quotaSpent: 'Monthly quota spent',
        importedTitle: '12 resumes imported',
        importedBody: 'Ranked against Senior Front-End Engineer. Two cleared 75%.',
        quotaTitle: '3 analyses left this month',
        quotaBody: 'Your plan resets on 1 September.',
        noApplicants: 'No applications yet. Publish the role or import resumes to start ranking.',
        emptyPipelineTitle: 'Nothing in the pipeline',
        emptyPipelineBody:
          'This role has no applications yet. Import a batch of resumes, or share the posting to start collecting them.',
        emptyPipelineAction: 'Import resumes',
        parseFailedTitle: 'Could not read this resume',
        parseFailedBadge: 'Parsing failed',
        parseFailedBody:
          'The file is a scanned image, so there is no text to match against the role. Ask the candidate for a text PDF, or enter the profile by hand.',
        upgrade: 'Upgrade plan',
      },

      specimens: {
        actions: {
          stageLabel: 'Pipeline stage',
          screening: 'Screening',
          interview: 'Interview',
          offer: 'Offer',
          runAnalysis: 'Run ATS analysis',
          advance: 'Advance to interview',
          requestReferences: 'Request references',
          archive: 'Archive',
          caption:
            'One primary action per view, and exactly one AI action. The Flare rule on the left edge of the analysis button is the only thing on this row that says a model is about to read something.',
        },
        forms: {
          roleLabel: 'Target role',
          roleHelper: 'The score is computed against this posting.',
          emailLabel: 'Candidate email',
          emailError: 'This address is incomplete. It needs a domain after the @.',
          jobLabel: 'Job description',
          jobValue:
            'You will own the front-end of our candidate experience: React, TypeScript, a design system shared with two other squads, and the accessibility work that goes with a product used by people under pressure.',
          jobHelper: 'The more specific the posting, the more honest the score.',
          caption:
            'Every field carries the rule on its leading edge — neutral at rest, cobalt on focus, brick on error. Nothing reflows when the state changes, because the 2px is always there.',
        },
        feedback: {
          matched: 'Match',
          review: 'Review by hand',
          rejected: 'Below bar',
          parsed: 'AI parsed',
          draft: 'Draft',
          toastTitle: 'Analysis complete',
          toastBody: 'Salomé Berthier scored 88% against Senior Front-End Engineer.',
          errorTitle: 'Could not read 1 of 12 files',
          errorBody: 'theo-vasseur-cv.pdf is a scanned image. Ask for a text PDF.',
          caption:
            'Status is carried by the rule and the word, never by colour alone — the same badge read in greyscale still says Match, Review by hand or Below bar.',
        },
        dataDisplay: {
          quotaLabel: 'Analyses this month',
          quotaHelper: 'Free plan · resets 1 September',
          columns: {
            candidate: 'Candidate',
            score: 'Match',
            status: 'Status',
            received: 'Received',
          },
          statuses: { matched: 'Match', review: 'Review', rejected: 'Below bar' },
          caption:
            'The threshold ticks are the point. 88 clears the 75 bar, 61 sits between the two, 43 clears neither — and you can see all three without reading a number.',
        },
        surfaces: {
          applicationTitle: 'Salomé Berthier',
          applicationSubtitle: 'Senior Front-End Engineer · applied 24 August',
          matched: 'Match',
          applicationBody:
            'Eight years in product front-end, four of them on a design system. Every must-have keyword in the posting appears in the resume, with dates that line up.',
          applicationMeta: 'Screening · owner Nadia',
          openReport: 'Open report',
          aiTitle: 'What the model found',
          aiSubtitle: 'Extracted from the resume, not from the application form',
          aiBadge: 'AI',
          aiBody:
            'Accessibility work is described twice but never named as a skill. Worth asking about in screening — the posting weights it heavily and the match score does not credit it.',
          aiMeta: 'Generated 24 August · review before sharing',
          caption:
            'Two sheets, no outlines. What separates them is elevation and the Flare rule down the second one, which is the only signal that a machine wrote its contents.',
        },
        templates: {
          pages: [
            {
              kicker: 'Template',
              label: 'Candidate dashboard',
              body: 'Upload, target role, the score as the lead story, quota and history.',
              href: './?path=/docs/templates-candidatedashboard--documentation',
            },
            {
              kicker: 'Template',
              label: 'Recruiter dashboard',
              body: 'Bulk import, pipeline numbers set at masthead size, ranked applications.',
              href: './?path=/docs/templates-recruiterdashboard--documentation',
            },
          ],
          caption:
            'The templates are where the hierarchy is argued rather than described: one number dominates, everything else is support.',
        },
      },

      families: {
        actions: {
          kicker: 'Family · Actions',
          title: 'Actions',
          description:
            'Buttons and exclusive segments. The controls that commit a recruiter to something — advancing a candidate, spending an analysis, changing what the page is about.',
          facts: [
            { label: 'Components', value: '2' },
            { label: 'Button variants', value: '5' },
            { label: 'Min target', value: '44px' },
          ],
          use: [
            'One primary action per view, and it is the thing the page exists for.',
            'The ai variant only where a model is about to read or write something.',
            'SegmentedControl for two to four exclusive views of the same data.',
          ],
          avoid: [
            'Navigating somewhere — that is a link, and a link should look like one.',
            'More than four segments; past that it is a select, not a control.',
            'A ghost button as the only action on a screen. Nobody finds it.',
          ],
          mark: "On both dashboards the headline figure is set at display size in a light band, and every section head sits on a full-width 1px rule. The rest of the page is held together by the type scale and spacing, with one colour that is not a status: the cobalt of actions.",
          states:
            'A pending analysis holds its label and spins in place rather than swapping to a spinner — a button that loses its word loses the reason it was pressed. A spent quota disables rather than hides, because the recruiter needs to know the action exists.',
        },
        forms: {
          kicker: 'Family · Forms',
          title: 'Forms',
          description:
            'The fields a hiring decision is assembled from: the target role, the posting text, and the resume itself. Everything a candidate hands over passes through here.',
          facts: [
            { label: 'Components', value: '3' },
            { label: 'Error wiring', value: 'ARIA' },
            { label: 'Upload limit', value: '5 MB' },
          ],
          use: [
            'Always with a visible label. A placeholder is not a label and disappears when it is needed most.',
            'Dropzone for resumes, with the accepted format and size stated before the drop, not after.',
            'Textarea with maxLength for postings, so the counter answers the question before it is asked.',
          ],
          avoid: [
            'Validating on every keystroke. Wait for blur; correcting someone mid-word is hostile.',
            'Colour as the only sign of an error — the rule, the icon and the sentence all have to agree.',
            'Hiding the helper text once an error appears. The reader needs both.',
          ],
          mark: 'Every field carries the rule on its leading edge at all times: neutral at rest, cobalt on focus, brick on error. It is the cheapest way to make the state of a long form scannable from the side of the screen.',
          states:
            'Uploading holds the file name and shows progress against it. A failed parse says what is wrong with the file and what to do about it, in that order — the two things a candidate needs and the two things most upload errors omit.',
        },
        feedback: {
          kicker: 'Family · Feedback',
          title: 'Feedback',
          description:
            'Statuses, notifications and dialogs. Everything that tells someone what just happened to an application, or asks them to confirm something they cannot undo.',
          facts: [
            { label: 'Components', value: '3' },
            { label: 'Live regions', value: 'role=status' },
            { label: 'Errors', value: 'role=alert' },
          ],
          use: [
            'Badge for a status that belongs to a row: matched, under review, below bar.',
            'Toast for something that completed while the recruiter was looking elsewhere.',
            'Modal only when the next action is destructive or genuinely blocking.',
          ],
          avoid: [
            'A toast for something the reader is already watching happen.',
            'A modal to show information — that is a page, or a card on the one they are on.',
            'Stacking more than three toasts; past that nobody reads any of them.',
          ],
          mark: 'No rule in this family. A status is identified by its fill, its icon and its word, never by colour alone. Status badges are solid so they read at a glance down a column; the AI badge and toast use tonal cobalt at low emphasis, because a model\'s contribution is not a status.',
          states:
            'An error toast takes role="alert" and is announced immediately; everything else waits its turn on role="status". Nothing auto-dismisses an error, because the one message worth reading is the one most likely to be missed.',
        },
        dataDisplay: {
          kicker: 'Family · Data',
          title: 'Data display',
          description:
            'Scores, rankings, quotas. The components that turn a pile of resumes into an ordering somebody will act on, and so the ones where legible figures and thresholds matter most.',
          facts: [
            { label: 'Components', value: '3' },
            { label: 'Score tiers', value: '75 · 50' },
            { label: 'Figures', value: 'Tabular' },
          ],
          use: [
            'ScoreGauge when one score is the answer to the page. Set it large; that is the whole point.',
            'DataTable when the comparison between candidates matters more than any single one.',
            'ProgressBar for anything with a ceiling: quota, seats, batch progress.',
          ],
          avoid: [
            'A gauge per row. Repeated at small sizes it is decoration; use the number and the badge.',
            'A score with no threshold marked. A percentage alone tells a candidate nothing.',
            'Ranking by score without showing the score. Hidden ordering is not a ranking, it is a verdict.',
          ],
          mark: 'This is where the rule earns its name. The tier boundaries are drawn onto the gauge arc and the quota rail as 2px ticks, so a score is always read against the bar it had to clear rather than in a vacuum.',
          states:
            'An empty table shows an icon and a message: "No data available" by default, to be replaced through emptyMessage with the next thing to do. A loading table keeps its headers and shows skeleton rows, so the page does not jump when the data lands.',
        },
        surfaces: {
          kicker: 'Family · Surfaces',
          title: 'Surfaces',
          description:
            'Cards and plan cards: the sheets everything else is laid on. In this system a surface is defined by elevation and space, almost never by an outline.',
          facts: [
            { label: 'Components', value: '2' },
            { label: 'Card variants', value: '4' },
            { label: 'Elevation steps', value: '4' },
          ],
          use: [
            'Card to group things that are read together and acted on together.',
            'The ai variant only for content a model generated, and always labelled as such.',
            'Card.Header / Body / Footer, so the same anatomy repeats everywhere.',
          ],
          avoid: [
            'A card around a single number. Set the number bigger instead.',
            'Nesting a card inside a card — use a rule and whitespace.',
            'An outline where whitespace would do. Most boxes in most dashboards are unnecessary.',
          ],
          mark: 'The AI card has no border and no colour of its own: it sits one elevation step above the default card. What identifies it as machine-written is the badge and the AI action placed inside it, which say so in words.',
          states:
            'An empty pipeline is a card with a sentence and one action, not an illustration and an exclamation mark. A failed parse names the cause and offers the manual route, because the candidate is still waiting either way.',
        },
        templates: {
          kicker: 'Family · Templates',
          title: 'Templates',
          description:
            'Two reference pages that assemble the library in product context — and the place the hierarchy argument is actually settled, because a design system is only as good as the busiest screen it produces.',
          facts: [
            { label: 'Templates', value: '2' },
            { label: 'Breakpoints', value: '4' },
            { label: 'Hero size', value: '116px' },
          ],
          use: [
            'As the starting point for a real page, not as a screenshot in a deck.',
            'To check a token change against a busy screen before shipping it.',
            'To settle an argument about hierarchy with something rendered.',
          ],
          avoid: [
            'Copying them wholesale. They are an argument about emphasis, not a layout to inherit.',
            'Adding a second hero. The moment two things are the biggest, neither is.',
          ],
          mark: 'On both dashboards the headline figure is set at display size (on the candidate side, the score with both thresholds marked underneath), and the section heads sit on a 1px rule. The rest of the hierarchy comes from the type scale and spacing, with almost no other decoration.',
          states:
            'Both templates ship their empty and their exhausted states, because a recruiter meets the empty one on day one and the exhausted one on the day it matters most.',
        },
      },
    },

    introduction: {
      heroKicker: 'Design system · Dossier',
      heroDescription:
        'A typed React component library for recruitment software: resume analysis, ATS matching, candidate and recruiter workspaces. The focus is accessibility, a coherent token system in light and dark, and living documentation in Storybook.',
      facts: [
        { label: 'Runtime', value: 'React 18 · 19' },
        { label: 'Styling', value: 'Tailwind 3 · 4' },
        { label: 'Contrast floor', value: 'WCAG 2.1 AA' },
        { label: 'Licence', value: 'MIT' },
      ],
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
        'One file holds the foundations: src/lib/design-tokens.ts. The Tailwind 3 preset, the Tailwind 4 stylesheet and this page are three renderings of it, so what you read here is what actually compiled. The counts below are measured off the token object as this page renders — they cannot go stale.',
      factLabels: {
        hues: 'Hues',
        colours: 'Colour tokens',
        typeSteps: 'Type steps',
        elevations: 'Elevations',
      },
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
      title: 'Card title',
      subtitle: 'Card subtitle',
      badge: 'badge',
      body: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae.',
      meta: 'Metadata',
      action: 'Action',
    },
    ai: {
      title: 'AI card',
      subtitle: 'Card subtitle',
      body: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae.',
      confidence: 'badge',
      action: 'Action',
    },
    plan: {
      title: 'Outline card',
      subtitle: 'Card subtitle',
      body: 'Nunc laoreet egestas nulla.',
    },
    tip: {
      title: 'Ghost card',
      body: 'Nunc laoreet egestas nulla.',
    },
    section: {
      title: 'Section title',
      subtitle: 'Rendered as an h2',
      body: 'Nunc laoreet egestas nulla.',
    },
    minimal: {
      title: 'Title only',
      body: 'Nunc laoreet egestas nulla.',
    },
  },

  input: {
    workspace: { label: 'Label', placeholder: 'Placeholder', value: 'Value' },
    email: { label: 'Email', placeholder: 'name@example.com', error: 'Error message' },
    password: { label: 'Password', helper: 'Helper text' },
    search: { label: 'Search', placeholder: 'Placeholder' },
  },

  textarea: {
    description: {
      label: 'Label',
      placeholder: 'Placeholder',
      helper: 'Helper text',
      error: 'Error message',
      value: 'Nunc laoreet egestas nulla',
    },
    note: { label: 'Label', helper: 'Helper text' },
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
      label: 'Label',
      helper: 'Helper text',
      helperNearLimit: 'Helper text',
      action: 'Action',
    },
    seats: { label: 'Label' },
    undefined: { label: 'Label' },
    processing: 'Progress',
  },

  gauge: {
    performance: 'Score',
    quality: 'Rating',
    health: 'Level',
    match: 'Match',
  },

  table: {
    columns: {
      name: 'Name',
      category: 'Category',
      status: 'Status',
      price: 'Price',
      updated: 'Updated',
      action: 'Action',
      empty: 'Empty',
    },
    categories: { audio: 'Category A', accessories: 'Category B', displays: 'Category C' },
    statuses: { active: 'active', review: 'pending', archived: 'archived' },
    rowAction: 'Open',
    emptyMessage: 'Nunc laoreet egestas nulla.',
  },

  modal: {
    /* Opens the modal: the stories render it closed, as on the documentation page. */
    trigger: 'Open the modal',
    report: {
      trigger: 'Open modal',
      title: 'Modal title',
      intro: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae',
      campaign: 'Vestibulum',
      checklist: 'Nullam quis risus',
      items: {
        deliverability: 'success',
        formatting: 'success',
        links: 'success',
        images: 'danger',
      },
      secondary: 'cancel',
      primary: 'confirm',
    },
    confirm: {
      title: 'Modal title',
      body: 'Nunc laoreet egestas nulla, quis dictum eros consequat vitae.',
    },
    overlay: {
      title: 'Modal title',
      body: 'Clicking the overlay dismisses the dialog.',
    },
    keyboard: {
      title: 'Modal title',
      body: 'Nunc laoreet egestas nulla.',
      cancel: 'cancel',
      submit: 'confirm',
    },
    untitled: {
      ariaLabel: 'Dialog without a visible title',
      body: 'Nunc laoreet egestas nulla.',
    },
    headerClose: {
      title: 'Modal title',
      body: 'Nunc laoreet egestas nulla.',
    },
    noFocusable: {
      ariaLabel: 'Content with no focusable element',
      body: 'Nunc laoreet egestas nulla.',
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
      description: 'Nunc laoreet egestas nulla.',
      price: '$9',
      button: 'Choose Starter',
      badge: 'Most popular',
      features: {
        projects: 'Feature one',
        history: 'Feature two',
        exports: 'Feature three',
        api: 'Feature four',
        sso: 'Feature five',
      },
    },
    growth: {
      title: 'Growth',
      description: 'Nunc laoreet egestas nulla.',
      price: '$49',
      button: 'Choose Growth',
      features: {
        everything: 'Everything in Starter',
        automation: 'Feature two',
        roles: 'Feature three',
        seats: 'Feature four',
        support: 'Feature five',
      },
    },
    free: {
      title: 'Free',
      description: 'Nunc laoreet egestas nulla.',
      price: 'Free',
      button: 'Choose Free',
      feature: 'Feature one',
    },
    enterprise: {
      title: 'Enterprise',
      description: 'Nunc laoreet egestas nulla.',
      price: 'Custom',
      period: '/ year',
      feature: 'Feature one',
    },
    select: {
      title: 'Growth',
      description: 'Nunc laoreet egestas nulla.',
      button: 'Choose this plan',
      feature: 'Feature one',
    },
    period: '/ month',
    heading: 'Pricing',
  },

  toast: {
    success: { title: 'success', description: 'Nunc laoreet egestas nulla.' },
    ai: { title: 'ai', description: 'Nunc laoreet egestas nulla.' },
    warning: { title: 'warning', description: 'Nunc laoreet egestas nulla.' },
    error: { title: 'error', description: 'Nunc laoreet egestas nulla.' },
    info: { title: 'info', description: 'Nunc laoreet egestas nulla.' },
    titleOnly: { title: 'Title only' },
    dismissed: 'Toast dismissed.',
    queue: {
      trigger: 'Push a toast',
      title: 'success',
      description: 'Nunc laoreet egestas nulla.',
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
      hero: {
        kicker: 'ATS match',
        against: 'against',
        verdict:
          'Clears the 75% bar for this role. Two of the three must-have skills in the posting appear in your resume with dates that line up; the third is described but never named.',
        scaleReview: 'Review',
        scaleBar: 'Bar',
        railLabel: 'Match score against the tier thresholds',
      },
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
      hero: {
        kicker: 'Pipeline',
        role: 'Senior Front-End Engineer',
        applications: 'applications',
        matched: 'cleared the bar',
        review: 'to review by hand',
        rejected: 'below the bar',
        verdict:
          'Eighteen of twenty-four applications clear 75%. Six sit between the two bars and need a human read before anyone is told anything.',
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
