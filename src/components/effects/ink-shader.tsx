"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Fundo de papel e tinta em WebGL.
 *
 * Um único plano em fullscreen com um shader que soma três coisas que o CSS não
 * faz bem: fibra de papel com respiração lenta, sangria de tinta que se desloca
 * com o scroll, e granulado animado. É fundo — nunca interativo, nunca por cima
 * do conteúdo.
 *
 * Custo controlado por construção: uma malha, um material, sem pós-processamento
 * e sem loop de render quando não há foco. Quem decide *se* isto existe é o
 * `InkBackdrop`, que só o carrega em ecrãs grandes e sem `prefers-reduced-motion`.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uRes;
  uniform vec3  uInk;
  uniform float uOpacity;

  // Ruído de valor clássico: barato o suficiente para correr em fullscreen a
  // cada frame sem tocar no orçamento de render da página.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);

    // Fibra: alta frequência, quase parada. É o que dá superfície ao papel.
    float fiber = fbm(uv * asp * 42.0 + uTime * 0.012);

    // Sangria de tinta: baixa frequência, empurrada pelo scroll — a mancha
    // move-se com a leitura, e não com o relógio, para o fundo pertencer à
    // página em vez de flutuar por cima dela.
    float bleed = fbm(uv * asp * 2.4 + vec2(0.0, uScroll * 0.55) + uTime * 0.03);
    bleed = smoothstep(0.42, 0.86, bleed);

    // Grão de impressão, sempre em movimento e sempre discreto.
    float grain = hash(uv * uRes + fract(uTime) * 91.7) - 0.5;

    float ink = bleed * 0.5 + fiber * 0.12 + grain * 0.06;

    // Vinheta: escurece as bordas, como página iluminada ao centro.
    float vig = smoothstep(1.15, 0.25, length((uv - 0.5) * asp));

    gl_FragColor = vec4(uInk, clamp(ink, 0.0, 1.0) * uOpacity * vig);
  }
`

function InkPlane({ color, opacity }: { color: string; opacity: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { size, viewport } = useThree()

  // Tipado à parte porque `ShaderMaterial.uniforms` é um índice aberto
  // (`{ [k: string]: IUniform }`): ler `u.uTime.value` dali obriga a um
  // `possibly undefined` em cada frame. A referência local mantém a forma real.
  const uniforms = useMemo<{
    uTime: { value: number }
    uScroll: { value: number }
    uRes: { value: THREE.Vector2 }
    uInk: { value: THREE.Color }
    uOpacity: { value: number }
  }>(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uInk: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [color, opacity],
  )

  useFrame((state) => {
    if (!mat.current) return
    const u = uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr)
    // Progresso de leitura normalizado (0→1). Lido do documento e não de um
    // listener próprio: o Lenis já move `scrollY`, e um segundo observador só
    // acrescentaria trabalho por frame.
    const max = document.documentElement.scrollHeight - window.innerHeight
    u.uScroll.value = max > 0 ? window.scrollY / max : 0
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

/**
 * A tela. `dpr` limitado a 1.5 mesmo em ecrãs retina: é ruído de fundo, e
 * renderizá-lo a 3x custaria mais do que a página inteira sem devolver nada
 * visível. `frameloop="always"` porque o grão precisa de correr, mas o R3F
 * pausa sozinho quando o separador perde visibilidade.
 */
export default function InkShader({
  color = "#0a0a0a",
  opacity = 0.4,
}: {
  color?: string
  opacity?: number
}) {
  return (
    <Canvas
      aria-hidden
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      orthographic
      camera={{ position: [0, 0, 1] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <InkPlane color={color} opacity={opacity} />
    </Canvas>
  )
}
