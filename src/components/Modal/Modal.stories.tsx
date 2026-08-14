import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Sparkles } from 'lucide-react';
import { withPageTitle } from '../../../.storybook/story-shell';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Modal } from './Modal';
import { Button } from '../Button';
import { Badge } from '../Badge';

/**
 * Dialogue modal accessible : rapport, confirmation, formulaire court.
 * Dismissed with Escape, by clicking the overlay or the close button; title
 * wired through `aria-labelledby`, focus trapped and restored on close.
 */
const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
  decorators: [withPageTitle('Modal')],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const InteractiveExample: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-4">
        <Button variant="ai" onClick={() => setIsOpen(true)}>
          <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
          {t.modal.report.trigger}
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          maxWidth="lg"
          closeLabel={t.components.modalClose}
          title={t.modal.report.title}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                {t.modal.report.secondary}
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
                {t.modal.report.primary}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p>
              {t.modal.report.intro}{' '}
              <strong className="text-slate-800">{t.modal.report.campaign}</strong> :
            </p>
            <div className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50 p-3">
              <h3 className="text-xs font-semibold text-slate-700">{t.modal.report.checklist}</h3>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="success" icon="check">
                  {t.modal.report.items.deliverability}
                </Badge>
                <Badge variant="success" icon="check">
                  {t.modal.report.items.formatting}
                </Badge>
                <Badge variant="success" icon="check">
                  {t.modal.report.items.links}
                </Badge>
                <Badge variant="danger" icon="cross">
                  {t.modal.report.items.images}
                </Badge>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const t = getDictionary(globals.locale);

    await userEvent.click(canvas.getByRole('button', { name: new RegExp(t.modal.report.trigger, 'i') }));
    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await expect(body.getByText(t.modal.report.title)).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: t.modal.report.secondary }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CloseWithEscape: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeLabel={t.components.modalClose}
        title={t.modal.confirm.title}
      >
        {t.modal.confirm.body}
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CloseOnOverlayClick: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeLabel={t.components.modalClose}
        title={t.modal.overlay.title}
      >
        {t.modal.overlay.body}
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await expect(body.getByRole('dialog')).toBeInTheDocument();
    const overlay = body.getByRole('dialog').parentElement?.firstElementChild as HTMLElement;
    await userEvent.click(overlay);
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const FocusTrapInteraction: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeLabel={t.components.modalClose}
        title={t.modal.keyboard.title}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              {t.modal.keyboard.cancel}
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
              {t.modal.keyboard.submit}
            </Button>
          </>
        }
      >
        {t.modal.keyboard.body}
      </Modal>
    );
  },
  play: async ({ globals }) => {
    const body = within(document.body);
    const t = getDictionary(globals.locale);

    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await expect(body.getByRole('button', { name: t.components.modalClose })).toHaveFocus();

    await userEvent.tab();
    await expect(body.getByRole('button', { name: t.modal.keyboard.cancel })).toHaveFocus();

    await userEvent.tab();
    await expect(body.getByRole('button', { name: t.modal.keyboard.submit })).toHaveFocus();

    await userEvent.tab();
    await expect(body.getByRole('button', { name: t.components.modalClose })).toHaveFocus();

    await userEvent.tab({ shift: true });
    await expect(body.getByRole('button', { name: t.modal.keyboard.submit })).toHaveFocus();
  },
};

export const WithoutTitle: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        ariaLabel={t.modal.untitled.ariaLabel}
      >
        {t.modal.untitled.body}
      </Modal>
    );
  },
  play: async ({ globals }) => {
    const body = within(document.body);
    const t = getDictionary(globals.locale);
    const dialog = body.getByRole('dialog');

    await expect(dialog).toHaveAccessibleName(t.modal.untitled.ariaLabel);
    await expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
  },
};

export const CloseWithHeaderButton: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeLabel={t.components.modalClose}
        title={t.modal.headerClose.title}
      >
        {t.modal.headerClose.body}
      </Modal>
    );
  },
  play: async ({ globals }) => {
    const body = within(document.body);
    const t = getDictionary(globals.locale);

    await userEvent.click(body.getByRole('button', { name: t.components.modalClose }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const NoFocusableElements: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="xl"
        ariaLabel={t.modal.noFocusable.ariaLabel}
      >
        <p>{t.modal.noFocusable.body}</p>
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CompoundComponents: Story = {
  render: () => {
    const t = useI18n();
    const [isOpen, setIsOpen] = useState(true);
    const titleId = useId();

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="md" labelledBy={titleId}>
        <Modal.Header
          title={t.modal.compound.title}
          titleId={titleId}
          closeLabel={t.components.modalClose}
          onClose={() => setIsOpen(false)}
        />
        <Modal.Body>{t.modal.compound.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
            {t.modal.compound.confirm}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  },
  play: async ({ globals }) => {
    const body = within(document.body);
    const t = getDictionary(globals.locale);

    await expect(body.getByText(t.modal.compound.title)).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: t.modal.compound.confirm }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
