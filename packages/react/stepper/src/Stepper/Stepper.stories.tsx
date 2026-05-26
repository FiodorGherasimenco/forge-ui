import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Stepper, Step, StepGroup, useStepperStore, flattenStepIds } from '../index'

function StepIndicator() {
  const store = useStepperStore()
  const active = React.useSyncExternalStore(store.subscribe, () => store.getActiveStepId())
  const tree = store.getTree()
  const leaves = flattenStepIds(tree);
  const activeIdx = leaves.findIndex((id) => id === active)

  const topLevel = tree.map((node) => ({
    id: node.id,
    title: node.title ?? node.id,
    leaves: flattenStepIds([node]),
  }))

  return (
    <div className="flex items-start mb-8">
      {topLevel.map((node, i) => {
        const isCompleted = node.leaves.every((id) => leaves.indexOf(id) < activeIdx)
        const isActive = node.leaves.includes(active)
        const isLast = i === topLevel.length - 1

        return (
          <React.Fragment key={node.id}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button
                onClick={() => store.goTo(node.leaves[0])}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isCompleted
                    ? 'bg-blue-100 border-blue-400 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </button>
              <span className={`text-xs font-medium text-center max-w-20 ${
                isActive ? 'text-blue-700' : isCompleted ? 'text-blue-500' : 'text-gray-400'
              }`}>
                {node.title}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mt-4 mx-2 transition-colors ${
                isCompleted ? 'bg-blue-400' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function StepNav() {
  const store = useStepperStore()
  const activeId = React.useSyncExternalStore(store.subscribe, () => store.getActiveStepId())
  const leaves = flattenStepIds(store.getTree())
  const idx = leaves.findIndex((id) => id === activeId)
  const isFirst = idx <= 0
  const isLast = idx < 0 || idx === leaves.length - 1

  return (
    <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
      <button
        disabled={isFirst}
        onClick={() => store.prev()}
        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Back
      </button>
      <button
        disabled={isLast}
        onClick={() => store.next()}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  )
}

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Basic: Story = {
  render: () => (
    <Stepper defaultStepId="step1">
      <StepIndicator />
      <Step id="step1" title="Personal Info" className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Personal Info</h2>
        <p className="text-gray-600">Enter your personal details.</p>
      </Step>
      <Step id="step2" title="Address" className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Address</h2>
        <p className="text-gray-600">Enter your address.</p>
      </Step>
      <Step id="step3" title="Review" className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Review</h2>
        <p className="text-gray-600">Review your submission.</p>
      </Step>
      <StepNav />
    </Stepper>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Stepper defaultStepId="welcome">
      <StepIndicator />
      <Step id="welcome" title="Welcome" className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Welcome</h2>
        <p className="text-gray-600">Let's get you set up. This will only take a few minutes.</p>
      </Step>
      <StepGroup id="account" title="Account Setup">
        <h3 className="text-base font-semibold text-gray-700 mb-3">Account Setup</h3>
        <Step id="account-create" title="Create Account" className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Create Account</h2>
          <p className="text-gray-600">Choose a username and password.</p>
        </Step>
        <Step id="account-verify" title="Verify Email" className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Verify Email</h2>
          <p className="text-gray-600">Check your inbox for a verification link.</p>
        </Step>
      </StepGroup>
      <StepGroup id="profile" title="Profile">
        <h3 className="text-base font-semibold text-gray-700 mb-3">Profile</h3>
        <Step id="profile-details" title="Your Details" className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Your Details</h2>
          <p className="text-gray-600">Tell us a bit about yourself.</p>
        </Step>
        <StepGroup id="profile-prefs" title="Preferences">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Preferences</h4>
          <Step id="profile-prefs-notifications" title="Notifications" className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <p className="text-gray-600">Set your notification preferences.</p>
          </Step>
          <Step id="profile-prefs-privacy" title="Privacy" className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Privacy</h2>
            <p className="text-gray-600">Configure your privacy settings.</p>
          </Step>
        </StepGroup>
        <Step id="profile-avatar" title="Avatar" className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Avatar</h2>
          <p className="text-gray-600">Upload a profile picture.</p>
        </Step>
      </StepGroup>
      <Step id="review" title="Review" className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Review</h2>
        <p className="text-gray-600">Review everything before submitting.</p>
      </Step>
      <StepNav />
    </Stepper>
  ),
}
