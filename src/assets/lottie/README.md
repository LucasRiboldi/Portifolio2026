# Assets Lottie

Coloque aqui os `.json` de animações Lottie (ex.: exportados do Jitter, LottieFiles, After Effects + Bodymovin).

Uso:

```tsx
import { LottiePlayer } from "@/components/ui/lottie-player"
import loader from "@/assets/lottie/loader.json"

<LottiePlayer animationData={loader} className="size-24" loop />
```

Para JSON servido por URL pública, use `src` em vez de `animationData`.
