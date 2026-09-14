import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Reveal — fade + slide quando entra na viewport                      */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Atraso da animação em ms (aplicado quando o elemento fica visível). */
  delay?: number;
  /** Deslocamento inicial em pixels (vertical). */
  y?: number;
  /**
   * Anima na montagem mesmo que o elemento já esteja na viewport
   * (usar no hero para a entrada da página).
   */
  animateOnMount?: boolean;
};

/**
 * Wrapper de "scroll reveal": o conteúdo fica oculto e faz fade + slide
 * quando entra na viewport. SSR-safe (renderiza visível no servidor) e
 * respeita `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 26,
  animateOnMount = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Visível por padrão: se o JS não rolar (ou o movimento for reduzido),
  // nada fica escondido.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    if (animateOnMount) {
      // Esconde e revela no frame seguinte → entrada suave do hero.
      setVisible(false);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    // Elementos já visíveis na carga não piscam; os demais animam no scroll.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;

    setVisible(false);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animateOnMount]);

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : `translateY(${y}px)`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax — desloca o conteúdo de acordo com a posição no scroll     */
/* ------------------------------------------------------------------ */

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Deslocamento máximo em px quando o wrapper está no topo/rodapé da viewport. */
  maxPx?: number;
};

/**
 * Medir o wrapper (que não recebe transform) e mover o conteúdo interno
 * evita o feedback loop de medir um elemento transformado.
 * O conteúdo interno deve ter "folga" (ex.: `scale-[1.15]` na imagem)
 * para a borda não aparecer com o deslocamento.
 */
export function Parallax({ children, className = "", maxPx = 40 }: ParallaxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i || prefersReducedMotion()) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = o.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -80 || r.top > vh + 80) return; // fora da tela: pular
      const center = r.top + r.height / 2;
      // -1 (wrapper no topo) … +1 (wrapper no rodapé)
      const progress = (center - vh / 2) / (vh / 2 + r.height / 2);
      i.style.transform = `translate3d(0, ${(progress * maxPx).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [maxPx]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt — inclinação 3D que segue o mouse + spotlight (vars --mx/--my) */
/* ------------------------------------------------------------------ */

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Inclinação máxima em graus. */
  max?: number;
};

export function Tilt({ children, className = "", max = 6 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setStyle({
        transform: `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(
          px * max
        ).toFixed(2)}deg) translateY(-5px)`,
        transition: "transform 80ms linear",
        "--mx": `${((px + 0.5) * 100).toFixed(1)}%`,
        "--my": `${((py + 0.5) * 100).toFixed(1)}%`,
      } as CSSProperties);
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)",
      transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
    });
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={style} className={className}>
      {children}
    </div>
  );
}
