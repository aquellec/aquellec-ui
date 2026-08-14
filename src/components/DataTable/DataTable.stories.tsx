import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ExternalLink, Package } from 'lucide-react';
import { getDictionary, useI18n, type Dictionary } from '../../../.storybook/i18n';
import { DataTable, type Column } from './DataTable';
import { Badge } from '../Badge';
import { Button } from '../Button';

/**
 * Tableau de données avec colonnes personnalisées, pagination et états
 * chargement / vide. L'exemple porte sur un catalogue produit, mais la forme
 * des données est entièrement générique (`Column<T>`).
 */
interface Product {
  id: string;
  name: string;
  category: keyof Dictionary['table']['categories'];
  status: keyof Dictionary['table']['statuses'];
  price: string;
  updatedAt: string;
}

const products: Product[] = [
  { id: '1', name: 'Aurora Headphones', category: 'audio', status: 'active', price: '129,00', updatedAt: '2026-08-12' },
  { id: '2', name: 'Nimbus Keyboard', category: 'accessories', status: 'review', price: '89,00', updatedAt: '2026-08-10' },
  { id: '3', name: 'Vertex Monitor 27"', category: 'displays', status: 'archived', price: '349,00', updatedAt: '2026-08-08' },
];

const statusVariant = {
  active: 'success',
  review: 'warning',
  archived: 'danger',
} as const;

/** Colonnes complètes, construites depuis le dictionnaire actif. */
function fullColumns(t: Dictionary): Column<Product>[] {
  return [
    {
      header: t.table.columns.name,
      cell: (item) => (
        <div className="flex items-center space-x-2 font-medium text-slate-900">
          <Package className="h-4 w-4 text-brand-600" aria-hidden="true" />
          <span>{item.name}</span>
        </div>
      ),
    },
    { header: t.table.columns.category, cell: (item) => t.table.categories[item.category] },
    {
      header: t.table.columns.status,
      cell: (item) => (
        <Badge variant={statusVariant[item.status]} size="sm">
          {t.table.statuses[item.status]}
        </Badge>
      ),
    },
    { header: t.table.columns.price, cell: (item) => <span className="font-medium">{item.price} €</span> },
    { header: t.table.columns.updated, accessorKey: 'updatedAt' },
    {
      header: t.table.columns.action,
      cell: () => (
        <Button variant="ghost" size="sm">
          {t.table.rowAction} <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
        </Button>
      ),
    },
  ];
}

/** Colonnes réduites, pour les scénarios de pagination. */
function compactColumns(t: Dictionary): Column<Product>[] {
  return [
    { header: t.table.columns.name, accessorKey: 'name' },
    { header: t.table.columns.category, cell: (item) => t.table.categories[item.category] },
    { header: t.table.columns.updated, accessorKey: 'updatedAt' },
  ];
}

const meta: Meta<typeof DataTable<Product>> = {
  title: 'Data Display/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable<Product>>;

export const Default: Story = {
  render: () => {
    const t = useI18n();
    return (
      <DataTable
        data={products}
        keyExtractor={(item) => item.id}
        columns={fullColumns(t)}
        pagination={{ currentPage: 1, totalPages: 3, onPageChange: fn() }}
      />
    );
  },
};

export const LoadingState: Story = {
  render: () => {
    const t = useI18n();
    return (
      <DataTable<Product>
        data={[]}
        isLoading
        keyExtractor={(item) => item.id}
        columns={compactColumns(t)}
      />
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const t = useI18n();
    return (
      <DataTable<Product>
        data={[]}
        emptyMessage={t.table.emptyMessage}
        keyExtractor={(item) => item.id}
        columns={compactColumns(t)}
      />
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(canvas.getByText(t.table.emptyMessage)).toBeInTheDocument();
  },
};

export const PaginationInteraction: Story = {
  render: () => {
    const t = useI18n();
    const [page, setPage] = useState(2);
    const onPageChange = fn((nextPage: number) => setPage(nextPage));

    return (
      <DataTable
        data={products}
        keyExtractor={(item) => item.id}
        columns={compactColumns(t)}
        pagination={{ currentPage: page, totalPages: 3, onPageChange }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Les libellés de pagination viennent du composant, pas des stories :
    // ils restent en français tant que DataTable n'expose pas ses textes.
    const previous = canvas.getByRole('button', { name: 'Page précédente' });
    const next = canvas.getByRole('button', { name: 'Page suivante' });

    await expect(canvas.getByText(/Page/i)).toHaveTextContent('2');
    await expect(previous).toBeEnabled();
    await expect(next).toBeEnabled();

    await userEvent.click(previous);
    await expect(canvas.getByText(/Page/i)).toHaveTextContent('1');

    await userEvent.click(next);
    await expect(canvas.getByText(/Page/i)).toHaveTextContent('2');
  },
};

export const PaginationBoundaries: Story = {
  render: () => {
    const t = useI18n();
    return (
      <DataTable
        data={products}
        keyExtractor={(item) => item.id}
        columns={compactColumns(t)}
        pagination={{ currentPage: 1, totalPages: 1, onPageChange: fn() }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previous = canvas.getByRole('button', { name: 'Page précédente' });
    const next = canvas.getByRole('button', { name: 'Page suivante' });

    await expect(previous).toBeDisabled();
    await expect(next).toBeDisabled();

    await userEvent.click(previous);
    await userEvent.click(next);
    await expect(canvas.getByText(/Page/i)).toHaveTextContent('1');
  },
};

/** Colonne sans `accessorKey` ni `cell` : la cellule doit rester vide, sans erreur. */
export const AccessorKeyColumns: Story = {
  render: () => {
    const t = useI18n();
    return (
      <DataTable
        data={products}
        keyExtractor={(item) => item.id}
        columns={[
          { header: t.table.columns.name, accessorKey: 'name' },
          { header: t.table.columns.price, accessorKey: 'price' },
          { header: t.table.columns.empty },
        ]}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Aurora Headphones')).toBeInTheDocument();
    await expect(canvas.getByText('Nimbus Keyboard')).toBeInTheDocument();
    await expect(canvas.queryByRole('navigation', { name: /Pagination/i })).not.toBeInTheDocument();
  },
};
