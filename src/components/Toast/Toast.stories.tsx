import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { withPageTitle } from '../../../.storybook/story-shell';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button';

/**
 * Transient notification: confirmation, quota warning, error.
 * `role="alert"` for the `error` variant, `role="status"` otherwise.
 */
const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  decorators: [withPageTitle('Toast')],
  /*
    Mirrors the defaults declared by the component, so the controls open on the
    real state instead of an empty selection. Story args still take precedence.
  */
  args: { variant: 'info' },
  argTypes: {
    variant: { control: 'select', options: ['success', 'error', 'warning', 'info', 'ai'] },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  render: (args) => {
    const t = useI18n();
    return <Toast {...args} closeLabel={t.components.toastClose} title={t.toast.success.title} description={t.toast.success.description} />;
  },
  args: { variant: 'success', onClose: fn() },
};

export const AIProcessing: Story = {
  render: (args) => {
    const t = useI18n();
    return <Toast {...args} closeLabel={t.components.toastClose} title={t.toast.ai.title} description={t.toast.ai.description} />;
  },
  args: { variant: 'ai', onClose: fn() },
};

export const WarningLimit: Story = {
  render: (args) => {
    const t = useI18n();
    return <Toast {...args} closeLabel={t.components.toastClose} title={t.toast.warning.title} description={t.toast.warning.description} />;
  },
  args: { variant: 'warning' },
};

export const ErrorState: Story = {
  render: (args) => {
    const t = useI18n();
    return <Toast {...args} closeLabel={t.components.toastClose} title={t.toast.error.title} description={t.toast.error.description} />;
  },
  args: { variant: 'error' },
};

export const Info: Story = {
  render: (args) => {
    const t = useI18n();
    return <Toast {...args} closeLabel={t.components.toastClose} title={t.toast.info.title} description={t.toast.info.description} />;
  },
  args: { variant: 'info' },
};

export const TitleOnly: Story = {
  render: (args) => {
    const t = useI18n();
    return <Toast {...args} closeLabel={t.components.toastClose} title={t.toast.titleOnly.title} />;
  },
  args: { variant: 'success' },
};

export const CloseInteraction: Story = {
  render: () => {
    const t = useI18n();
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return <p>{t.toast.dismissed}</p>;
    }

    return (
      <Toast
        variant="warning"
        title={t.toast.warning.title}
        description={t.toast.warning.description}
        closeLabel={t.components.toastClose}
        onClose={() => setVisible(false)}
      />
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: t.components.toastClose }));
    await expect(canvas.getByText(t.toast.dismissed)).toBeInTheDocument();
  },
};

/** The `error` variant must switch to `role="alert"`, so it is announced immediately. */
export const ErrorAlertRole: Story = {
  render: (args) => {
    const t = useI18n();
    return <Toast {...args} closeLabel={t.components.toastClose} title={t.toast.error.title} />;
  },
  args: { variant: 'error', onClose: fn() },
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(canvas.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: t.components.toastClose }));
    await expect(args.onClose).toHaveBeenCalled();
  },
};

function ToastQueueDemo() {
  const t = useI18n();
  const { push } = useToast();

  return (
    <Button
      variant="primary"
      onClick={() =>
        push({
          variant: 'success',
          title: t.toast.queue.title,
          description: t.toast.queue.description,
        })
      }
    >
      {t.toast.queue.trigger}
    </Button>
  );
}

export const ProviderQueue: Story = {
  render: () => {
    const t = useI18n();
    return (
      <ToastProvider
        defaultDuration={0}
        regionLabel={t.components.toastRegion}
        closeLabel={t.components.toastClose}
      >
        <ToastQueueDemo />
      </ToastProvider>
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const t = getDictionary(globals.locale);

    await userEvent.click(canvas.getByRole('button', { name: t.toast.queue.trigger }));
    await expect(body.getByRole('region', { name: t.components.toastRegion })).toBeInTheDocument();
    await expect(body.getByText(t.toast.queue.title)).toBeInTheDocument();
  },
};
