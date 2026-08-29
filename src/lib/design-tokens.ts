/*
  The origin of the design system.

  Everything downstream derives from this file: the Tailwind preset consumes it
  for the v3 config, `scripts/generate-theme-css.mjs` renders it into
  `dist/theme.css` for v4, and the Tokens documentation page reads it directly.
  A value written anywhere else is a value that will drift.

  Palette rationale — the product is a hiring tool: it handles people's careers
  and recruiters read it all day. So the neutrals carry the interface and the
  accents are rare. `brand` is a deep, slightly desaturated blue, credible
  rather than electric; `ai` is a restrained violet reserved for generated or
  inferred content, so a coloured surface always means "a machine produced
  this"; `semantic` is limited to outcomes a recruiter acts on.

  Every text pair below was measured against WCAG AA (4.5:1) on both the light
  and the dark surfaces before being written down.
*/

/**
 * Neutral ramp owned by the design system.
 *
 * Previously the components borrowed Tailwind's `slate`, which meant the most
 * used colour in the library was not a token of it. The ramp is cool but less
 * blue than `slate`, so dense tables read as a document rather than as a
 * screenshot of an IDE. `25` and `950` exist for the two page canvases.
 */
const neutral = {
  25: '#fcfcfd',
  50: '#f8f9fb',
  100: '#f1f3f7',
  200: '#e3e7ee',
  300: '#cbd2de',
  400: '#8d97a9',
  500: '#646e80',
  600: '#4b5563',
  700: '#3a424f',
  800: '#282f3a',
  900: '#161b22',
  950: '#0d1117',
} as const;

/** Brand and AI palette shared by components and the Tailwind preset. */
export const aquellecColors = {
  neutral,
  /*
    Trust blue. `600` is the primary action on light (6.68:1 under white),
    `400` the primary action on dark (5.86:1 under near-black copy). The scale
    is deliberately flatter than a default Tailwind ramp: a hiring interface
    needs two or three usable steps, not ten decorative ones.
  */
  brand: {
    50: '#eef4ff',
    100: '#dbe6ff',
    200: '#bed3ff',
    300: '#8fb4ff',
    400: '#5b8def',
    500: '#3a6fe0',
    600: '#2554c4',
    700: '#1d419b',
    800: '#1b377c',
    900: '#1a3163',
  },
  /*
    Reserved for machine-produced content: parsed fields, match scores,
    suggestions. Never decorative — a violet surface is a claim about where the
    information came from, and a recruiter has to be able to trust that claim.
  */
  ai: {
    50: '#f5f3ff',
    100: '#ebe7fe',
    200: '#dad3fd',
    300: '#bcaefa',
    400: '#9b85f2',
    500: '#7f63e4',
    600: '#6847c9',
    700: '#553aa3',
    800: '#473186',
    900: '#3c2b6d',
  },
  semantic: {
    /** Captions and secondary metadata. Passes AA on white and on `neutral-50`. */
    muted: neutral[500],
    /** Body copy that is not a heading. */
    subtle: neutral[600],
    success: {
      fg: '#0f6c4a',
      bg: '#eefaf4',
      border: '#b6e5d0',
      surface: '#eefaf4',
      /* Dark counterparts: a wash of the hue over the surface, never the light tint. */
      'fg-dark': '#5fd4a4',
      'bg-dark': 'rgb(15 108 74 / 0.18)',
      'border-dark': 'rgb(95 212 164 / 0.30)',
    },
    error: {
      fg: '#b32540',
      bg: '#fef2f4',
      border: '#f7ccd5',
      surface: '#fef2f4',
      /* Dark counterparts: a wash of the hue over the surface, never the light tint. */
      'fg-dark': '#f2919f',
      'bg-dark': 'rgb(179 37 64 / 0.20)',
      'border-dark': 'rgb(242 145 159 / 0.32)',
    },
    warning: {
      fg: '#9a5b09',
      bg: '#fdf7ec',
      border: '#f2ddb4',
      surface: '#fdf7ec',
      /* Dark counterparts: a wash of the hue over the surface, never the light tint. */
      'fg-dark': '#e9b063',
      'bg-dark': 'rgb(154 91 9 / 0.22)',
      'border-dark': 'rgb(233 176 99 / 0.32)',
    },
    info: {
      fg: '#1d4ed8',
      bg: '#eef4ff',
      border: '#bed3ff',
      surface: '#eef4ff',
      /* Dark counterparts: a wash of the hue over the surface, never the light tint. */
      'fg-dark': '#8fb4ff',
      'bg-dark': 'rgb(37 84 196 / 0.20)',
      'border-dark': 'rgb(143 180 255 / 0.30)',
    },
  },
} as const;

export type AquellecColors = typeof aquellecColors;

/**
 * Shape, type, elevation and motion tokens.
 *
 * Named after their role rather than their value, so a component asks for
 * `rounded-control` and inherits the decision instead of restating it. The
 * legacy `xl` / `2xl` radii and the `xs` / `card` / `overlay` shadows are kept:
 * they are part of the published API.
 */
export const aquellecThemeExtensions = {
  fontFamily: {
    /** Interface. `Inter` has the tabular figures a data table needs. */
    sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    /** Identifiers, scores, extracted values. */
    mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  },

  /*
    A working scale, not a display scale. The steps are close together because
    the interface is dense: the hierarchy is carried by weight and colour as
    much as by size. Negative tracking on the larger steps keeps headings from
    looking loose at this weight.
  */
  fontSize: {
    display: ['1.75rem', { lineHeight: '2.125rem', letterSpacing: '-0.02em' }],
    title: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],
    heading: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
    body: ['0.875rem', { lineHeight: '1.4375rem', letterSpacing: '-0.006em' }],
    label: ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '-0.004em' }],
    caption: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0' }],
    /** Section eyebrows. Always uppercase, hence the open tracking. */
    overline: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
  },

  borderRadius: {
    /** Inputs, buttons, segments — anything the pointer lands on. */
    control: '0.5rem',
    /** Cards, panels, table shells. */
    card: '0.75rem',
    /** Dialogs and other floating surfaces. */
    surface: '1rem',
    xl: '0.75rem',
    '2xl': '1rem',
  },

  /*
    Four steps, each a single shadow. Stacked shadows read as decoration; one
    tight shadow reads as a surface lifted off the page, which is all these
    need to say. The colour is the neutral ramp's darkest step, so elevation
    stays in the same family as the interface.
  */
  boxShadow: {
    xs: '0 1px 2px 0 rgb(13 17 23 / 0.05)',
    card: '0 1px 3px 0 rgb(13 17 23 / 0.07), 0 1px 2px -1px rgb(13 17 23 / 0.05)',
    raised: '0 4px 12px -2px rgb(13 17 23 / 0.10)',
    overlay: '0 16px 32px -8px rgb(13 17 23 / 0.18)',
  },

  /*
    Two curves. `standard` for anything that stays on screen, `exit` for
    anything leaving — a symmetric ease on a dismissal reads as hesitation.
    Durations are not tokens: Tailwind 4 has no `--duration-*` theme namespace,
    so naming them here would create a value the generated `theme.css` could not
    carry, and the two majors would drift.
  */
  transitionTimingFunction: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;
