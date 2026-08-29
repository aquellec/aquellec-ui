import { aquellecColors } from '../src/lib/design-tokens';

/**
 * Light / dark mode shared by the toolbar switch, the story decorator and the
 * documentation container.
 *
 * The mode is a Storybook global rather than a story argument: it belongs to
 * the whole preview, exactly like the locale, and every story has to answer to
 * it without declaring anything.
 */
export const THEMES = ['light', 'dark'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'light';

/** Toolbar labels. */
export const themeLabels: Record<Theme, { title: string; icon: string }> = {
  light: { title: 'Light', icon: 'sun' },
  dark: { title: 'Dark', icon: 'moon' },
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

/** Canvas behind the stories, taken from the token used by `pageSurfaceClass`. */
const CANVAS_BACKGROUND: Record<Theme, string> = {
  light: '',
  dark: aquellecColors.neutral[950],
};

/**
 * Applies the mode to the preview document.
 *
 * The `dark` class goes on `<html>` because the Tailwind preset uses the
 * `class` strategy, and components rendered through a portal — the Modal, the
 * toasts — attach to `document.body`, outside any decorator wrapper. A class on
 * a wrapping `div` would leave them in light mode.
 *
 * The canvas is painted at the same time: dark components on the white
 * Storybook background would misrepresent every contrast ratio.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.backgroundColor = CANVAS_BACKGROUND[theme];
  document.body.style.backgroundColor = CANVAS_BACKGROUND[theme];
}
