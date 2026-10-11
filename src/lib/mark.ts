/*
  THE RULE — the signature gesture of @aquellec/ui.

  One primitive: a short precise line drawn on a boundary. Two placements that
  carry the identity, and one hairline that is merely structural.

    THE THRESHOLD TICK   the signature. Laid across a data track at the value a
                         reading has to clear — on ScoreGauge's arc and on
                         ProgressBar's rail. A score is meaningless until you can
                         see the bar it was measured against, and this is the
                         one detail in the library nothing else in the category
                         does. It is drawn in the page's own ink at low opacity,
                         because it marks a position rather than competing with
                         the value being measured.

    THE ACCENT RUN       the same line at label scale, in cobalt, opening a
                         section eyebrow. Small, quiet, and the only place the
                         brand hue appears as pure geometry.

  Plus `mastheadRuleClass`, a 1px divider that confirms where a section ends and
  claims nothing else.

  It comes from what the product does: a hiring tool is a machine for drawing
  lines — this candidate cleared the bar, that one did not. Rather than hide
  those lines, the system draws them, once, exactly where they fall.

  TWO PLACEMENTS RETIRED
  Earlier passes ran the rule vertically down the leading edge of cards, toasts,
  badges, fields and buttons, and then ran it at 4px of full ink under every
  heading. The first gave the page five orientations of one gesture, which is
  not a signature but decoration wearing a rationale; the second made a light
  product look brutalist. Both are banned. Emphasis is elevation, space, type
  scale, or cobalt — in that order.

  Spelled with Tailwind's numeric utilities (`h-px`, `w-0.5`), which mean the
  same pixels under Tailwind 3 and 4. A named border-width token would not:
  Tailwind 4 has no theme namespace for one, and this package promises both
  majors.
*/

/** Accents a rule may take. Matches the hue families that carry meaning. */
export type MarkAccent = 'brand' | 'ai' | 'success' | 'warning' | 'danger' | 'neutral';

/**
 * RETAINED FOR COMPATIBILITY — the retired leading placement.
 *
 * The library no longer composes this anywhere; see the banned placement in the
 * header comment. It stays exported because it is part of the package's public
 * surface and a consumer may already be composing it. Do not reintroduce it
 * into a component: emphasis is elevation, space, or the brand hue.
 */
export const leadingMarkClass: Record<MarkAccent, string> = {
  brand: 'border-l-4 border-l-brand-600 dark:border-l-brand-400',
  ai: 'border-l-4 border-l-ai-500 dark:border-l-ai-400',
  success: 'border-l-4 border-l-moss-600 dark:border-l-moss-400',
  warning: 'border-l-4 border-l-ochre-600 dark:border-l-ochre-400',
  danger: 'border-l-4 border-l-brick-600 dark:border-l-brick-400',
  neutral: 'border-l-4 border-l-ink-900 dark:border-l-ink-100',
};

/**
 * The structural rule under a heading.
 *
 * A hairline, not a slab. It ran at 4px of full ink for one pass and the result
 * was brutalist: a page of black bars competing with its own headings for
 * weight. Separation is carried by the type scale and by space; this line only
 * confirms where a section ends, and at 1px it does that without joining the
 * argument.
 */
export const mastheadRuleClass = 'h-px w-full bg-ink-200 dark:bg-ink-800';

/**
 * THRESHOLD form — the tick itself, drawn across a horizontal data track.
 *
 * Positioned by the component, which knows where the boundary falls. The tone
 * is the page's own ink rather than an accent: the tick says *where the line
 * is*, and colouring it would make it argue with the fill being measured
 * against it.
 */
export const thresholdMarkClass =
  'absolute inset-y-0 w-0.5 -translate-x-1/2 bg-ink-900/45 dark:bg-ink-50/45';

/** THRESHOLD form, drawn on an SVG track rather than an HTML one. Same tone, same 4px. */
export const thresholdStrokeClass = 'stroke-ink-900/45 dark:stroke-ink-50/45';

/**
 * The same rule at label scale, opening an eyebrow.
 *
 * The one place it takes the brand hue rather than full ink: a kicker is
 * emphasis, and emphasis in this system is cobalt.
 */
export const ruleMarkClass = 'h-0.5 w-6 rounded-full bg-brand-600 dark:bg-brand-400';

/**
 * Numerals that stack.
 *
 * Every figure a recruiter compares — scores, counts, quotas, dates, prices —
 * is set with tabular figures so digits align column to column and a number
 * does not shuffle sideways as it counts up. Applied through one constant
 * because "most of the numbers" is not a design system.
 */
export const dataFigureClass = 'tabular-nums';
