import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Stepper, Step, StepGroup, useStepperStore } from '../index'

const Nav = () => {
  const { next, prev } = useStepperStore()
  return (
    <>
      <button type="button" onClick={prev}>Prev</button>
      <button type="button" onClick={next}>Next</button>
    </>
  )
}

const GoTo = ({ id }: { id: string }) => {
  const { goTo } = useStepperStore()
  return <button type="button" onClick={() => goTo(id)}>Go to {id}</button>
}

describe('Stepper', () => {
  describe('initial render', () => {
    it('shows the first step by default', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
        </Stepper>,
      )
      expect(screen.getByText('Step one')).toBeInTheDocument()
      expect(screen.queryByText('Step two')).not.toBeInTheDocument()
    })

    it('shows the step matching defaultId', () => {
      render(
        <Stepper defaultStepId="two">
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
        </Stepper>,
      )
      expect(screen.queryByText('Step one')).not.toBeInTheDocument()
      expect(screen.getByText('Step two')).toBeInTheDocument()
    })

    it('shows the step matching controlled selectedId', () => {
      render(
        <Stepper selectedStepId="two">
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
        </Stepper>,
      )
      expect(screen.queryByText('Step one')).not.toBeInTheDocument()
      expect(screen.getByText('Step two')).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('advances to the next step', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.queryByText('Step one')).not.toBeInTheDocument()
      expect(screen.getByText('Step two')).toBeInTheDocument()
    })

    it('goes back to the previous step', () => {
      render(
        <Stepper defaultStepId="two">
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step one')).toBeInTheDocument()
      expect(screen.queryByText('Step two')).not.toBeInTheDocument()
    })

    it('does not advance past the last step', () => {
      render(
        <Stepper defaultStepId="two">
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step two')).toBeInTheDocument()
    })

    it('does not go back before the first step', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step one')).toBeInTheDocument()
    })

    it('navigates directly to a step via goTo', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
          <Step id="three">Step three</Step>
          <GoTo id="three" />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Go to three' }))
      expect(screen.getByText('Step three')).toBeInTheDocument()
    })
  })

  describe('disabled steps', () => {
    it('skips disabled steps during next navigation', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two" disabled>Step two</Step>
          <Step id="three">Step three</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.queryByText('Step two')).not.toBeInTheDocument()
      expect(screen.getByText('Step three')).toBeInTheDocument()
    })

    it('does not navigate to a disabled step via goTo', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two" disabled>Step two</Step>
          <GoTo id="two" />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Go to two' }))
      expect(screen.getByText('Step one')).toBeInTheDocument()
    })

    it('does not call onSelect when navigating to a disabled step in controlled mode', () => {
      const onSelect = vi.fn()
      render(
        <Stepper selectedStepId="one" onSelect={onSelect}>
          <Step id="one">Step one</Step>
          <Step id="two" disabled>Step two</Step>
          <GoTo id="two" />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Go to two' }))
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('navigates next from a disabled step to the next enabled step', () => {
      render(
        <Stepper defaultStepId="two">
          <Step id="one">Step one</Step>
          <Step id="two" disabled>Step two</Step>
          <Step id="three">Step three</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step three')).toBeInTheDocument()
    })

    it('navigates prev from a disabled step to the previous enabled step', () => {
      render(
        <Stepper defaultStepId="two">
          <Step id="one">Step one</Step>
          <Step id="two" disabled>Step two</Step>
          <Step id="three">Step three</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step one')).toBeInTheDocument()
    })
  })

  describe('controlled mode', () => {
    it('calls onSelect when the active step changes', () => {
      const onSelect = vi.fn()
      render(
        <Stepper selectedStepId="one" onSelect={onSelect}>
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(onSelect).toHaveBeenCalledWith('two')
    })
  })

  describe('StepGroup', () => {
    it('hides group children when active step is outside the group', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <StepGroup id="group-a" title="Group A">
            <Step id="two">Step two</Step>
          </StepGroup>
        </Stepper>,
      )
      expect(screen.queryByText('Step two')).not.toBeInTheDocument()
    })

    it('shows group children when active step is inside the group', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <StepGroup id="group-a" title="Group A">
            <Step id="two">Step two</Step>
          </StepGroup>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step two')).toBeInTheDocument()
    })

    it('navigates through nested group steps in order', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <StepGroup id="group-a" title="Group A">
            <Step id="two">Step two</Step>
            <Step id="three">Step three</Step>
          </StepGroup>
          <Step id="four">Step four</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step two')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step three')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step four')).toBeInTheDocument()
    })

    it('navigates back through nested group steps', () => {
      render(
        <Stepper defaultStepId="four">
          <Step id="one">Step one</Step>
          <StepGroup id="group-a" title="Group A">
            <Step id="two">Step two</Step>
            <Step id="three">Step three</Step>
          </StepGroup>
          <Step id="four">Step four</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step three')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step two')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step one')).toBeInTheDocument()
    })
  })

  describe('flows', () => {
    it('user completes a wizard with flat steps from start to finish', () => {
      render(
        <Stepper>
          <Step id="basic-info">Basic info</Step>
          <Step id="configuration">Configuration</Step>
          <Step id="review">Review</Step>
          <Nav />
        </Stepper>,
      )
      expect(screen.getByText('Basic info')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Configuration')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Review')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Review')).toBeInTheDocument()
    })

    it('user navigates forward through grouped steps then back to the start', () => {
      render(
        <Stepper>
          <Step id="basic-info">Basic info</Step>
          <StepGroup id="details" title="Details">
            <Step id="name">Name</Step>
            <Step id="description">Description</Step>
          </StepGroup>
          <Step id="review">Review</Step>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Name')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Description')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Review')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Description')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Name')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Basic info')).toBeInTheDocument()
    })

    it('user jumps ahead then goes back step by step', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two">Step two</Step>
          <Step id="three">Step three</Step>
          <GoTo id="three" />
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Go to three' }))
      expect(screen.getByText('Step three')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step two')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
      expect(screen.getByText('Step one')).toBeInTheDocument()
    })

    it('user is blocked from jumping to a disabled step and continues normally', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <Step id="two" disabled>Step two</Step>
          <Step id="three">Step three</Step>
          <GoTo id="two" />
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Go to two' }))
      expect(screen.getByText('Step one')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step three')).toBeInTheDocument()
    })

    it('renders a step wrapped in a non-stepper element', () => {
      render(
        <Stepper>
          <div><Step id="one">Step one</Step></div>
          <div><Step id="two">Step two</Step></div>
          <Nav />
        </Stepper>,
      )
      expect(screen.getByText('Step one')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step two')).toBeInTheDocument()
    })

    it('renders steps inside a StepGroup wrapped in a non-stepper element', () => {
      render(
        <Stepper>
          <Step id="one">Step one</Step>
          <div>
            <StepGroup id="group-a" title="Group A">
              <div>
                <Step id="two">Step two</Step>
                <Step id="three">Step three</Step>
              </div>
            </StepGroup>
          </div>
          <Nav />
        </Stepper>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step two')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Step three')).toBeInTheDocument()
    })

    it('user completes nested groups across multiple levels', () => {
      render(
        <Stepper>
          <Step id="start">Start</Step>
          <StepGroup id="outer" title="Outer">
            <StepGroup id="inner" title="Inner">
              <Step id="inner-one">Inner one</Step>
              <Step id="inner-two">Inner two</Step>
            </StepGroup>
            <Step id="outer-last">Outer last</Step>
          </StepGroup>
          <Step id="end">End</Step>
          <Nav />
        </Stepper>,
      )
      expect(screen.getByText('Start')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Inner one')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Inner two')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('Outer last')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
      expect(screen.getByText('End')).toBeInTheDocument()
    })
  })
})
