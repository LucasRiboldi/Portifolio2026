import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SvAlert, SvProgress, SvEmptyState } from './sv-feedback'

const meta = {
  title: 'UI/SvFeedback',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Alerts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <SvAlert tone="info" title="Dica">Você está no multiverso.</SvAlert>
      <SvAlert tone="success" title="Sucesso">Deploy concluído.</SvAlert>
      <SvAlert tone="warning" title="Atenção">Contraste insuficiente.</SvAlert>
      <SvAlert tone="danger" title="Erro">Falha na conexão.</SvAlert>
    </div>
  ),
}

export const Progress: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <SvProgress value={72} label="Cobertura" tone="success" />
      <SvProgress indeterminate label="Sincronizando…" tone="info" />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <SvEmptyState onoma="WHOOSH!" title="Nada por aqui" description="Nenhum item encontrado." />
    </div>
  ),
}
