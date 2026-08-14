import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Button } from './Button';

/**
 * Bouton d'action du design system. `primary` pour les actions principales,
 * `ai` pour les traitements génératifs, `outline` et `ghost` pour le secondaire.
 *
 * Les libellés viennent du dictionnaire de stories : changez la langue dans la
 * barre d'outils pour voir les exemples s'adapter.
 */
const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'ai'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.primary}</Button>;
  },
  args: { variant: 'primary' },
};

export const AIAction: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.ai}</Button>;
  },
  args: { variant: 'ai' },
};

export const Loading: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.loading}</Button>;
  },
  args: { isLoading: true },
};

export const Disabled: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.disabled}</Button>;
  },
  args: { disabled: true },
};

export const Secondary: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.secondary}</Button>;
  },
  args: { variant: 'secondary' },
};

export const Outline: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.outline}</Button>;
  },
  args: { variant: 'outline', size: 'lg' },
};

export const Ghost: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.ghost}</Button>;
  },
  args: { variant: 'ghost', size: 'sm' },
};

/** Toutes les variantes côte à côte, pour comparer les niveaux d'emphase. */
export const AllVariants: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">{t.button.primary}</Button>
        <Button variant="secondary">{t.button.secondary}</Button>
        <Button variant="outline">{t.button.outline}</Button>
        <Button variant="ghost">{t.button.ghost}</Button>
        <Button variant="ai">{t.button.ai}</Button>
      </div>
    );
  },
};

export const ClickInteraction: Story = {
  render: (args) => {
    const t = useI18n();
    return <Button {...args}>{t.button.submit}</Button>;
  },
  args: { variant: 'primary', onClick: fn() },
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await userEvent.click(canvas.getByRole('button', { name: t.button.submit }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
