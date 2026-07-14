import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { SvCheckbox, SvRadio, SvRadioGroup, SvSwitch, SvRating, SvSlider } from './sv-choice'

const meta = {
  title: 'UI/SvChoice',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Checkbox: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SvCheckbox label="Marcado" defaultChecked />
      <SvCheckbox label="Desmarcado" />
      <SvCheckbox label="Desabilitado" disabled />
    </div>
  ),
}

export const Radio: Story = {
  render: () => (
    <SvRadioGroup name="demo">
      <SvRadio label="Opção A" defaultChecked />
      <SvRadio label="Opção B" />
      <SvRadio label="Opção C" />
    </SvRadioGroup>
  ),
}

export const Switch: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SvSwitch label="Ligado" defaultChecked />
      <SvSwitch label="Desligado" />
    </div>
  ),
}

export const Rating: Story = {
  render: function RatingStory() {
    const [v, setV] = useState(3)
    return <SvRating value={v} onChange={setV} />
  },
}

export const Slider: Story = {
  render: function SliderStory() {
    const [v, setV] = useState(60)
    return <div style={{ width: 320 }}><SvSlider label="Poder" value={v} onChange={(e) => setV(+e.target.value)} /></div>
  },
}
