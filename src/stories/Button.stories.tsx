import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/ui/button';
import { Rocket } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Link: Story = { args: { variant: 'link' } };
export const Large: Story = { args: { size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
export const Icon: Story = {
  args: {
    size: 'icon',
    children: <Rocket />,
    'aria-label': 'Rocket',
  },
}; 