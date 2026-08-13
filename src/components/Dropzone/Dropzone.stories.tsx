import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone } from './Dropzone';

const meta: Meta<typeof Dropzone> = {
  title: 'Components/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  argTypes: {
    maxSizeMB: { control: 'number' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    file: new File([new ArrayBuffer(512 * 1024)], 'cv-amandine-quellec.pdf', {
      type: 'application/pdf',
    }),
  },
};
