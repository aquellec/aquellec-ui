/*
  Dictionnaire de référence des stories.

  `en` est la source de vérité : le type `Dictionary` en est dérivé, et chaque
  autre langue doit s'y conformer. Une clé oubliée ou en trop dans `fr.ts` est
  donc une erreur de compilation, pas une chaîne manquante à l'exécution.

  Les exemples sont volontairement agnostiques (catalogue produit, stockage,
  facturation, équipe) : le design system n'est pas réservé au recrutement.
  Seuls les templates de dashboard conservent leur contexte métier.
*/
export const en = {
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
        subtitle: 'Upload your résumé and paste the target job description',
        resumeLabel: 'Your résumé (PDF)',
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
        unit: 'résumés',
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
        title: 'Bulk résumé import',
        subtitle: 'Drop several PDFs — batch analysis through the API',
      },
      history: {
        title: 'Analysis history',
        subtitle: 'ATS ranking and match statuses',
        columns: {
          candidate: 'Candidate / résumé',
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
