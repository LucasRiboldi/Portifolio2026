import { Button }
from "@/components/ui/button";

import { Container }
from "@/components/layout/container";

export function Hero() {

  return (
    <section
      className="
      relative
      py-32
      "
    >
      <Container>

        <div
          className="
          max-w-4xl
          "
        >

          <h1
            className="
            text-6xl
            font-bold
            "
          >
            Desenvolvedor,
            criador de ferramentas
            e projetos digitais.
          </h1>

          <p
            className="
            mt-6
            text-xl
            text-muted
            "
          >
            Portfólio, SaaS,
            GitHub, IA e artigos.
          </p>

          <div
            className="
            mt-10
            flex gap-4
            "
          >

            <Button>
              Ver Projetos
            </Button>

            <Button
              variant="secondary"
            >
              GitHub
            </Button>

          </div>

        </div>

      </Container>
    </section>
  );
}
