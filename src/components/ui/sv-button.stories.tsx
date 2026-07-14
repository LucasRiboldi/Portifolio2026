import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SvButton } from './sv-button'

const meta = {
  title: 'UI/SvButton',
  component: SvButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'outline', 'link', 'fab', 'icon'] },
    color: { control: 'select', options: ['magenta', 'cyan', 'yellow', 'lime', 'violet', 'orange'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Ação', variant: 'primary', color: 'magenta', size: 'md' },
} satisfies Meta<typeof SvButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', color: 'cyan' } }
export const Ghost: Story = { args: { variant: 'ghost', color: 'lime' } }
export const Outline: Story = { args: { variant: 'outline', color: 'violet' } }
export const Loading: Story = { args: { isLoading: true, color: 'orange' } }
export const Disabled: Story = { args: { disabled: true } }
export const WithPop: Story = { args: { pop: 'POW!', color: 'yellow', children: 'Deploy' } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <SvButton variant="primary" color="magenta">Primary</SvButton>
      <SvButton variant="secondary" color="cyan">Secondary</SvButton>
      <SvButton variant="ghost" color="lime">Ghost</SvButton>
      <SvButton variant="outline" color="violet">Outline</SvButton>
      <SvButton variant="link" color="cyan">Link</SvButton>
    </div>
  ),
}
