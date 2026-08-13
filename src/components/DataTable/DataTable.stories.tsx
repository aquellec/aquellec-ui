import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './DataTable';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { FileText, ExternalLink } from 'lucide-react';

interface AnalysisHistory {
  id: string;
  candidateName: string;
  jobTitle: string;
  score: number;
  date: string;
  status: 'matched' | 'review' | 'rejected';
}

const mockData: AnalysisHistory[] = [
  { id: '1', candidateName: 'Amandine Q.', jobTitle: 'Front-End Engineer', score: 88, date: '12 Aout 2026', status: 'matched' },
  { id: '2', candidateName: 'Alexandre M.', jobTitle: 'Full-Stack Developer', score: 64, date: '10 Aout 2026', status: 'review' },
  { id: '3', candidateName: 'Sophie L.', jobTitle: 'UI/UX Designer', score: 42, date: '08 Aout 2026', status: 'rejected' },
];

/**
 * Tableau de données B2B avec colonnes custom, pagination et états loading / empty.
 * Idéal pour lister candidatures, historiques d'analyse ou quotas API.
 */
const meta: Meta<typeof DataTable<AnalysisHistory>> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable<AnalysisHistory>>;

export const Default: Story = {
  render: () => (
    <DataTable
      data={mockData}
      keyExtractor={(item) => item.id}
      columns={[
        {
          header: 'Candidat / CV',
          cell: (item) => (
            <div className="flex items-center space-x-2 font-medium text-slate-900">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>{item.candidateName}</span>
            </div>
          ),
        },
        { header: 'Poste visé', accessorKey: 'jobTitle' },
        {
          header: 'Score ATS',
          cell: (item) => (
            <span
              className={
                item.score >= 75
                  ? 'font-bold text-emerald-600'
                  : item.score >= 50
                  ? 'font-bold text-amber-600'
                  : 'font-bold text-rose-600'
              }
            >
              {item.score}%
            </span>
          ),
        },
        {
          header: 'Statut',
          cell: (item) => (
            <Badge
              variant={
                item.status === 'matched'
                  ? 'success'
                  : item.status === 'review'
                  ? 'warning'
                  : 'danger'
              }
              size="sm"
            >
              {item.status === 'matched' ? 'Compatible' : item.status === 'review' ? 'À revoir' : 'Faible'}
            </Badge>
          ),
        },
        { header: 'Date', accessorKey: 'date' },
        {
          header: 'Action',
          cell: () => (
            <Button variant="ghost" size="sm">
              Rapport <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          ),
        },
      ]}
      pagination={{
        currentPage: 1,
        totalPages: 3,
        onPageChange: (page) => console.log('Aller à la page :', page),
      }}
    />
  ),
};

export const LoadingState: Story = {
  render: () => (
    <DataTable<AnalysisHistory>
      data={[]}
      isLoading={true}
      keyExtractor={(item) => item.id}
      columns={[
        { header: 'Candidat' },
        { header: 'Poste' },
        { header: 'Score' },
        { header: 'Date' },
      ]}
    />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <DataTable<AnalysisHistory>
      data={[]}
      emptyMessage="Aucune analyse de CV effectuée pour le moment."
      keyExtractor={(item) => item.id}
      columns={[
        { header: 'Candidat' },
        { header: 'Poste' },
        { header: 'Score' },
        { header: 'Date' },
      ]}
    />
  ),
};
