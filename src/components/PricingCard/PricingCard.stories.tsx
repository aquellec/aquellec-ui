import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { withPageTitle } from '../../../.storybook/story-shell';
import { PricingCard } from './PricingCard';

/**
 * Carte tarifaire pour les offres Candidat et Recruteur. Met en avant un plan
 * recommandé via `isPopular` et liste les fonctionnalités incluses / exclues.
 */
const meta: Meta<typeof PricingCard> = {
  title: 'Data Display/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  decorators: [withPageTitle('Tarifs', 'h2')],
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

export const CandidatePro: Story = {
  args: {
    title: 'Candidat Pro',
    description: 'Pour maximiser ses chances d\u2019obtenir des entretiens.',
    price: '9.99€',
    isPopular: true,
    badgeText: 'Recommandé Candidats',
    buttonText: 'Booster mon CV',
    buttonVariant: 'ai',
    features: [
      { text: 'Analyses de CV illimitées', included: true },
      { text: 'Optimisation de mots-clés ATS', included: true },
      { text: 'Génération de lettre de motivation IA', included: true },
      { text: 'Export du rapport en PDF', included: true },
      { text: 'Multi-candidats / Gestion d\u2019équipe', included: false },
    ],
  },
};

export const RecruiterTeam: Story = {
  args: {
    title: 'Recruteur / RH',
    description: 'Pour trier et analyser des volées de CVs en quelques secondes.',
    price: '49€',
    isPopular: false,
    buttonText: 'Essai gratuit 14 jours',
    buttonVariant: 'primary',
    features: [
      { text: 'Parsing & Matching de CVs en masse', included: true },
      { text: 'Scoring ATS & Filtres personnalisés', included: true },
      { text: 'Export CSV & Intégration ATS (Greenhouse, Welcome)', included: true },
      { text: 'Espace de travail collaboratif (5 seats)', included: true },
      { text: 'API Python dédiée & Support prioritaire', included: true },
    ],
  },
};

export const FreePlan: Story = {
  args: {
    title: 'Candidat Free',
    description: 'Pour découvrir l\u2019analyse ATS.',
    price: 'Gratuit',
    buttonText: 'Commencer',
    features: [{ text: '3 analyses par mois', included: true }],
  },
};

export const CustomQuote: Story = {
  args: {
    title: 'Entreprise',
    description: 'Volume élevé et SLA dédié.',
    price: 'Sur devis',
    period: '/ an',
    buttonVariant: 'outline',
    features: [{ text: 'API illimitée', included: true }],
  },
};

export const SelectPlanInteraction: Story = {
  args: {
    title: 'Candidat Pro',
    description: 'Plan recommandé.',
    price: '9.99€',
    isPopular: true,
    buttonText: 'Choisir ce plan',
    onSelect: fn(),
    features: [{ text: 'Analyses illimitées', included: true }],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Choisir ce plan' }));
    await expect(args.onSelect).toHaveBeenCalled();
  },
};
