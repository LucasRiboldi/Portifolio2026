import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SvInput } from './sv-input'

const meta = {
  title: 'UI/SvInput',
  component: SvInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'date', 'search', 'phone', 'cpf', 'cep'] },
  },
  args: { label: 'Campo', placeholder: 'Digite aqui…', type: 'text' },
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
} satisfies Meta<typeof SvInput>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {}
export const Password: Story = { args: { label: 'Senha', type: 'password', placeholder: '••••••••' } }
export const CPF: Story = { args: { label: 'CPF', type: 'cpf', placeholder: '000.000.000-00' } }
export const Search: Story = { args: { label: 'Busca', type: 'search', placeholder: 'Buscar…' } }
export const Error: Story = { args: { label: 'E-mail', error: 'Formato inválido.', defaultValue: 'xyz' } }
export const Success: Story = { args: { label: 'E-mail', success: 'Tudo certo!', defaultValue: 'a@b.com' } }
export const Disabled: Story = { args: { disabled: true, placeholder: 'Indisponível' } }
