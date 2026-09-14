import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

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
