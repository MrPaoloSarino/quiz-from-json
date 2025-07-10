import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 400 }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description for the card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Here is some content inside the card. You can put anything here, including forms, lists, or other components.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}; 