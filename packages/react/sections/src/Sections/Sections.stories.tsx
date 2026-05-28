import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Sections, Section, SectionNotFound, Search, Trigger } from '../index'

const meta: Meta<typeof Sections> = {
  title: 'Components/Sections',
  component: Sections,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Sections>

export const Basic: Story = {
  render: () => (
    <Sections defaultPageId="general" className="flex gap-10 p-4">
      <div className="w-48 shrink-0">
        <Search className="mb-4" />
        <nav className="flex flex-col gap-1">
          <Trigger pageId="general">General</Trigger>
          <Trigger pageId="billing">Billing</Trigger>
          <Trigger pageId="security">Security</Trigger>
        </nav>
      </div>
      <div className="flex-1">
        <Section pageId="general" sectionId="general-info" keywords="name email profile">
          <h2 className="text-lg font-semibold mb-2">General Settings</h2>
          <p className="text-gray-600">Manage your name, email, and profile information.</p>
        </Section>
        <Section pageId="billing" sectionId="billing-info" keywords="payment card invoice">
          <h2 className="text-lg font-semibold mb-2">Billing</h2>
          <p className="text-gray-600">Manage your payment methods and invoices.</p>
        </Section>
        <Section pageId="security" sectionId="security-info" keywords="password 2fa authentication">
          <h2 className="text-lg font-semibold mb-2">Security</h2>
          <p className="text-gray-600">Manage your password and two-factor authentication.</p>
        </Section>
        <SectionNotFound className="text-gray-500 italic">No results found.</SectionNotFound>
      </div>
    </Sections>
  ),
}
