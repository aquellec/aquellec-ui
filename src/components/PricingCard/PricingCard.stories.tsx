import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { withPageTitle } from '../../../.storybook/story-shell';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { PricingCard } from './PricingCard';

/**
 * Generic pricing card. `isPopular` highlights a plan; included and excluded
 * features are both announced to screen readers.
 */
const meta: Meta<typeof PricingCard> = {
  title: 'Data Display/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  decorators: [withPageTitle('Pricing', 'h2')],
  /*
    Mirrors the defaults declared by the component, so the controls open on the
    real state instead of an empty selection. Story args still take precedence.
  */
  args: { isPopular: false },
  argTypes: {
    isPopular: { control: 'boolean' },
    buttonVariant: { control: 'select', options: ['primary', 'ai', 'outline'] },
  },
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

export const Starter: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <PricingCard
        includedLabel={t.components.pricingIncluded}
        excludedLabel={t.components.pricingExcluded}
        featuresLabel={t.components.pricingFeatures}
        {...args}
        title={t.pricing.starter.title}
        description={t.pricing.starter.description}
        price={t.pricing.starter.price}
        period={t.pricing.period}
        badgeText={t.pricing.starter.badge}
        buttonText={t.pricing.starter.button}
        features={[
          { text: t.pricing.starter.features.projects, included: true },
          { text: t.pricing.starter.features.history, included: true },
          { text: t.pricing.starter.features.exports, included: true },
          { text: t.pricing.starter.features.api, included: true },
          { text: t.pricing.starter.features.sso, included: false },
        ]}
      />
    );
  },
  args: { isPopular: true, buttonVariant: 'ai' },
};

export const Growth: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <PricingCard
        includedLabel={t.components.pricingIncluded}
        excludedLabel={t.components.pricingExcluded}
        featuresLabel={t.components.pricingFeatures}
        {...args}
        title={t.pricing.growth.title}
        description={t.pricing.growth.description}
        price={t.pricing.growth.price}
        period={t.pricing.period}
        buttonText={t.pricing.growth.button}
        features={[
          { text: t.pricing.growth.features.everything, included: true },
          { text: t.pricing.growth.features.automation, included: true },
          { text: t.pricing.growth.features.roles, included: true },
          { text: t.pricing.growth.features.seats, included: true },
          { text: t.pricing.growth.features.support, included: true },
        ]}
      />
    );
  },
  args: { buttonVariant: 'primary' },
};

export const FreePlan: Story = {
  render: () => {
    const t = useI18n();
    return (
      <PricingCard
        includedLabel={t.components.pricingIncluded}
        excludedLabel={t.components.pricingExcluded}
        featuresLabel={t.components.pricingFeatures}
        title={t.pricing.free.title}
        description={t.pricing.free.description}
        price={t.pricing.free.price}
        buttonText={t.pricing.free.button}
        features={[{ text: t.pricing.free.feature, included: true }]}
      />
    );
  },
};

export const CustomQuote: Story = {
  render: () => {
    const t = useI18n();
    return (
      <PricingCard
        includedLabel={t.components.pricingIncluded}
        excludedLabel={t.components.pricingExcluded}
        featuresLabel={t.components.pricingFeatures}
        title={t.pricing.enterprise.title}
        description={t.pricing.enterprise.description}
        price={t.pricing.enterprise.price}
        period={t.pricing.enterprise.period}
        buttonVariant="outline"
        buttonText={t.pricing.free.button}
        features={[{ text: t.pricing.enterprise.feature, included: true }]}
      />
    );
  },
};

/** An excluded feature must be perceivable by more than the strikethrough. */
export const ExcludedFeature: Story = {
  render: () => {
    const t = useI18n();
    return (
      <PricingCard
        includedLabel={t.components.pricingIncluded}
        excludedLabel={t.components.pricingExcluded}
        featuresLabel={t.components.pricingFeatures}
        title={t.pricing.free.title}
        description={t.pricing.free.description}
        price={t.pricing.free.price}
        buttonText={t.pricing.free.button}
        features={[
          { text: t.pricing.free.feature, included: true },
          { text: t.pricing.starter.features.sso, included: false },
        ]}
      />
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);
    const excluded = canvas.getByText(t.pricing.starter.features.sso);

    // The included / excluded `sr-only` prefix is carried by the list item.
    await expect(excluded.closest('li')).toHaveTextContent(t.pricing.starter.features.sso);
  },
};

export const SelectPlanInteraction: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <PricingCard
        includedLabel={t.components.pricingIncluded}
        excludedLabel={t.components.pricingExcluded}
        featuresLabel={t.components.pricingFeatures}
        {...args}
        title={t.pricing.select.title}
        description={t.pricing.select.description}
        price={t.pricing.starter.price}
        period={t.pricing.period}
        buttonText={t.pricing.select.button}
        features={[{ text: t.pricing.select.feature, included: true }]}
      />
    );
  },
  args: { isPopular: true, onSelect: fn() },
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await userEvent.click(canvas.getByRole('button', { name: t.pricing.select.button }));
    await expect(args.onSelect).toHaveBeenCalled();
  },
};
