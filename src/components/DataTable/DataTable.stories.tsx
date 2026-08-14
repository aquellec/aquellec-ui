import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTable } from './DataTable';
import { getScoreTextClass } from '../../lib/score-tier';
import { cn } from '../../lib/cn';
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
  title: 'Data Display/DataTable',
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
            <span className={cn('font-bold', getScoreTextClass(item.score))}>
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

export const PaginationInteraction: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    const onPageChange = fn((nextPage: number) => setPage(nextPage));

    return (
      <DataTable
        data={mockData}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'Candidat', accessorKey: 'candidateName' },
          { header: 'Poste', accessorKey: 'jobTitle' },
          { header: 'Score', accessorKey: 'score' },
          { header: 'Date', accessorKey: 'date' },
        ]}
        pagination={{
          currentPage: page,
          totalPages: 3,
          onPageChange,
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Page/i)).toHaveTextContent('2');
    await expect(canvas.getByRole('button', { name: 'Page précédente' })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Page suivante' })).toBeEnabled();

    await userEvent.click(canvas.getByRole('button', { name: 'Page précédente' }));
    await expect(canvas.getByText(/Page/i)).toHaveTextContent('1');

    await userEvent.click(canvas.getByRole('button', { name: 'Page suivante' }));
    await expect(canvas.getByText(/Page/i)).toHaveTextContent('2');
  },
};

export const PaginationBoundaries: Story = {
  render: () => (
    <DataTable
      data={mockData}
      keyExtractor={(item) => item.id}
      columns={[
        { header: 'Candidat', accessorKey: 'candidateName' },
        { header: 'Poste', accessorKey: 'jobTitle' },
      ]}
      pagination={{
        currentPage: 1,
        totalPages: 1,
        onPageChange: fn(),
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const prevButton = canvas.getByRole('button', { name: 'Page précédente' });
    const nextButton = canvas.getByRole('button', { name: 'Page suivante' });

    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeDisabled();
    await expect(canvas.getByText(/Page/i)).toHaveTextContent('1');

    await userEvent.click(prevButton);
    await userEvent.click(nextButton);
    await expect(canvas.getByText(/Page/i)).toHaveTextContent('1');
  },
};

export const AccessorKeyColumns: Story = {
  render: () => (
    <DataTable
      data={mockData}
      keyExtractor={(item) => item.id}
      columns={[
        { header: 'Candidat', accessorKey: 'candidateName' },
        { header: 'Poste', accessorKey: 'jobTitle' },
        { header: 'Sans valeur' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Amandine Q.')).toBeInTheDocument();
    await expect(canvas.getByText('Front-End Engineer')).toBeInTheDocument();
    await expect(canvas.queryByRole('navigation', { name: /Pagination/i })).not.toBeInTheDocument();
  },
};
