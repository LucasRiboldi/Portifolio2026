// A rota "/" é a porta da frente: o script no <head> (src/app/layout.tsx)
// redireciona antes do paint — sempre para /portal, a tela de escolha de perfil.
// Este componente é só o fallback para navegadores sem JS.
export default function FrontDoor() {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", gap: "1rem" }}>
      <p>Escolha seu multiverso:</p>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <a href="/portal">Portal</a>
        <a href="/criativo">Criativo</a>
        <a href="/desenvolvedor">Desenvolvedor</a>
        <a href="/anfitriao">Anfitrião</a>
      </nav>
    </div>
  )
}
