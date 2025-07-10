import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-semibold tracking-tight text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
    {children}
  </h3>
);

const meta: Meta<typeof CardTitle> = {
  title: 'UI/CardTitle',
  component: CardTitle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="group p-4 bg-white rounded shadow hover:bg-gray-100 transition-colors">
        {Story()}
        <p className="text-xs text-gray-500 mt-2">Hover over this card to see the title color change.</p>
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof CardTitle>;

export const Default: Story = {
  args: {
    children: 'R1',
  },
}; 