import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Button } from './Button';

/**
 * Action button of the design system. `primary` for main actions, `ai` for
 * generative workflows, `outline` and `ghost` for secondary ones.
 *
 * Labels come from the story dictionary: switch the language in the toolbar to
 * see the examples adapt.
 */
const meta: Meta<typeof Button> = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  /*
    Mirrors the defaults declared by the component, so the controls open on the
    real state instead of an empty selection. Story args still take precedence.
  */
  args: { variant: 'primary', size: 'md', isLoading: false },
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

/** Every variant side by side, to compare emphasis levels. */
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
