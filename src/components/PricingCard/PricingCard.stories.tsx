import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingCard } from './PricingCard';

const meta: Meta<typeof PricingCard> = {
  title: 'Components/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
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
