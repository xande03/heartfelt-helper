import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Cake,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Facebook,
  Flame,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Navigation,
  Phone,
  Quote,
  Sandwich,
  ShoppingBasket,
  Sparkles,
  Star,
  Sun,
  Wallet,
  Wheat,
  X,
} from "lucide-react";

import { Parallax, Reveal, Tilt } from "../components/motion";
import { business, formatSlots, getOpenStatus, links, type OpenStatus } from "../lib/business";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Panificadora e Conveniência Bacanga — Padaria em São Luís, MA",
      },
      {
        name: "description",
        content:
          "Pães fresquinhos todos os dias na Vila Bacanga, São Luís/MA. Padaria, conveniência, café e lanches rápidos. R. da Felicidade, 139-189 — peça pelo WhatsApp (98) 3228-2162.",
      },
      { rel: "preconnect", href: "https://www.google.com" },
      { name: "theme-color", content: "#be2a2c" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Panificadora e Conveniência Bacanga" },
      {
        property: "og:description",
        content: "Pães fresquinhos, café e lanches rápidos na Vila Bacanga, São Luís/MA.",
      },
      { property: "og:image", content: "/images/fachada-hero.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

/* ------------------------------------------------------------------ */
/* Helpers de UI                                                       */
/* ------------------------------------------------------------------ */

const HIGHLIGHT_ICONS = {
  bread: Wheat,
  snack: Sandwich,
  coffee: Coffee,
  cake: Cake,
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] text-brand-red uppercase">
      <span className="h-px w-8 bg-brand-red/40" />
      {children}
    </p>
  );
}

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${value} de 5 estrelas`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(value) ? "fill-brand-gold text-brand-gold" : "text-brand-brown/25 dark:text-white/15"}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function StatusPill({ status, dark = false }: { status: OpenStatus | null; dark?: boolean }) {
  const open = status?.open;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        dark
          ? "bg-white/10 text-brand-cream backdrop-blur-sm"
          : "bg-brand-sand text-brand-brown dark:bg-white/10 dark:text-ink"
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
            open ? "bg-emerald-400" : "bg-brand-red"
          } opacity-75`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-emerald-500" : "bg-brand-red"}`}
        />
      </span>
      {status ? `${status.label} · ${status.detail}` : "Ver horários"}
    </span>
  );
}

/** Itens do menu (estáticos — nível de módulo para deps estáveis em effects). */
const NAV_ITEMS = [
  { href: "#destaques", label: "A casa" },
  { href: "#produtos", label: "Produtos" },
  { href: "#vitrine", label: "Vitrine" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#horarios", label: "Horários" },
  { href: "#contato", label: "Contato" },
];

/** Faixa "letreiro de padaria" — itens que saem do forno, rolando em loop. */
const MARQUEE_ITEMS = [
  "Pão francês quentinho",
  "Bomba da casa",
  "Pastel folheado",
  "Queijadinha",
  "Petit four de cebola",
  "Donuts",
  "Café passado na hora",
  "Sucos e refrigerantes",
  "Bolos e confeitaria",
  "Conveniência completa",
];

function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="marquee overflow-hidden border-y border-white/10 bg-brand-red py-3"
    >
      <div className="marquee-track flex w-max items-center gap-9">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-9">
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={item}
                className="flex items-center gap-9 text-[12px] font-semibold tracking-[0.18em] whitespace-nowrap text-brand-cream uppercase"
              >
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

function LandingPage() {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pillOffset, setPillOffset] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const navRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Calculado no cliente para evitar divergência de hidratação (SSR × fuso)
  useEffect(() => {
    setStatus(getOpenStatus());
    const t = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Nav: barra de progresso + parallax da ilha (segue o scroll com atraso)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 8);
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        // A ilha "nada" alguns px acima conforme rola (transição dá o atraso)
        setPillOffset(Math.max(-10, -window.scrollY * 0.04));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll-spy: marca a seção visível (a ilha destaca o grupo ativo)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const ids = ["topo", ...NAV_ITEMS.map((n) => n.href.slice(1))];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === "topo" ? null : `#${e.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // Indicador deslizante: desloca a "pílula" até o link ativo
  useEffect(() => {
    const measure = () => {
      const el = active
        ? navRef.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`)
        : null;
      if (!el) {
        setIndicator({ left: 0, width: 0, visible: false });
        return;
      }
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // Lightbox: teclado + trava de scroll
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((v) => (v === null ? v : (v + 1) % business.gallery.length));
      if (e.key === "ArrowLeft")
        setLightbox((v) =>
          v === null ? v : (v - 1 + business.gallery.length) % business.gallery.length,
        );
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  // Tema claro/escuro: aplica a classe .dark no <html> (o script inline
  // já cuida do primeiro paint) e persiste a escolha do usuário.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("bacanga-theme");
    } catch {
      stored = null;
    }
    const initial: "light" | "dark" =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.classList.toggle("dark", initial === "dark");
    setTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next: "light" | "dark" = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("bacanga-theme", next);
    } catch {
      /* storage indisponível — segue sem persistir */
    }
    setTheme(next);
  };

  const todayIndex = status?.todayIndex ?? new Date().getDay();

  const lightboxItem = lightbox === null ? null : (business.gallery[lightbox] ?? null);

  return (
    <div className="min-h-screen bg-surface font-sans text-brand-brown antialiased selection:bg-brand-red selection:text-white dark:text-ink">
      {/* Tema: aplica .dark no <html> antes do primeiro paint (evita flash) */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{var t=localStorage.getItem("bacanga-theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}',
        }}
      />

      {/* Dados estruturados para o Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Bakery",
            name: business.name,
            description: business.description,
            image: "/images/fachada-hero.jpg",
            telephone: business.phone.raw,
            priceRange: business.priceRange,
            address: {
              "@type": "PostalAddress",
              streetAddress: `${business.address.street} - ${business.address.district}`,
              addressLocality: business.address.city,
              addressRegion: business.address.state,
              postalCode: business.address.zip,
              addressCountry: "BR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: business.address.lat,
              longitude: business.address.lng,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: business.rating.value,
              reviewCount: business.rating.count,
            },
            openingHoursSpecification: business.hours.map((h) => {
              const first = h.slots[0] ?? ["06:00", "12:00"];
              const last = h.slots[h.slots.length - 1] ?? first;
              return {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: h.day,
                opens: first[0],
                closes: last[1],
              };
            }),
          }),
        }}
      />

      {/* ============================ TOPO ============================ */}
      <div className="relative z-50 bg-brand-brown text-brand-cream">
        <div className="mx-auto flex max-w-6xl 2xl:max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 text-[11px] tracking-wide sm:text-xs">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-brand-gold" strokeWidth={2} />
            {business.address.street} · {business.address.district}, {business.address.city}–
            {business.address.state}
          </span>
          <div className="flex items-center gap-5">
            <a
              href={links.tel}
              className="inline-flex items-center gap-2 transition-colors hover:text-brand-gold"
            >
              <Phone className="h-3.5 w-3.5 text-brand-gold" strokeWidth={2} />
              {business.phone.display}
            </a>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
              <strong className="font-semibold">
                {business.rating.value.toString().replace(".", ",")}
              </strong>
              <span className="text-brand-cream/60">({business.rating.count} avaliações)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============================ NAV (ILHA-PÍLULA) ============================ */}
      {/* Barra de progresso de leitura */}
      <span
        aria-hidden
        className="fixed top-0 left-0 z-50 h-[3px] rounded-r-full bg-gradient-to-r from-brand-red to-brand-gold"
        style={{ width: `${progress * 100}%` }}
      />
      <header className="sticky top-6 z-40 mx-auto w-full max-w-[74rem] 2xl:max-w-7xl px-4 sm:px-5">
        {/* Parallax: a ilha se move alguns px com atraso em relação ao scroll */}
        <div
          className="mx-auto w-full will-change-transform transition-transform duration-700 ease-out"
          style={{ transform: `translateY(${pillOffset}px)` }}
        >
          <div
            className={`flex items-center justify-between gap-3 rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-500 hover:-translate-y-[2px] ring-1 ring-brand-gold/30 ${
              scrolled
                ? "border-brand-brown/10 bg-surface/90 shadow-[0_18px_44px_-18px_rgba(46,27,18,0.5)]"
                : "border-white/50 bg-surface/75 shadow-[0_12px_34px_-18px_rgba(46,27,18,0.35)]"
            }`}
          >
            {/* Logo + nome (condensa ao rolar) */}
            <a
              href="#topo"
              className="flex shrink-0 items-center gap-2.5 rounded-full pl-1 pr-2 transition-all duration-500"
            >
              <img
                src="/images/logo.png"
                alt={`Brasão ${business.name}`}
                className={`rounded-full object-cover ring-2 ring-brand-gold/50 transition-all duration-500 ${
                  scrolled ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11"
                }`}
              />
              <span className="hidden leading-none min-[380px]:block">
                <span
                  className={`block font-display font-semibold tracking-tight transition-all duration-500 ${
                    scrolled ? "text-[13px]" : "text-[15px] sm:text-base"
                  }`}
                >
                  Panificadora <span className="text-brand-red">Bacanga</span>
                </span>
                <span
                  className={`mt-0.5 block text-[9px] font-medium tracking-[0.18em] text-brand-brown-soft uppercase transition-opacity duration-500 ${
                    scrolled ? "opacity-40" : "opacity-100"
                  }`}
                >
                  Conveniência · São Luís
                </span>
              </span>
            </a>

            {/* Links agrupados + indicador deslizante (scroll-spy) */}
            <nav ref={navRef} className="relative hidden items-center gap-1 p-1 lg:flex">
              <span
                aria-hidden
                className={`absolute top-1 bottom-1 rounded-full bg-brand-red-soft transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  indicator.visible ? "opacity-100" : "opacity-0"
                }`}
                style={{ left: indicator.left, width: indicator.width }}
              />
              {NAV_ITEMS.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  data-nav={n.href}
                  className={`relative z-10 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    active === n.href
                      ? "text-brand-red"
                      : "text-brand-brown-soft hover:text-brand-red"
                  }`}
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {/* Status ao vivo, agrupado na ilha */}
              {status && (
                <span
                  title={status.detail ? `${status.label} · ${status.detail}` : status.label}
                  className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-brand-brown ring-1 ring-brand-brown/10 xl:flex dark:bg-white/10 dark:text-ink"
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                        status.open ? "bg-emerald-400" : "bg-brand-red"
                      } opacity-70`}
                    />
                    <span
                      className={`relative inline-flex h-2 w-2 rounded-full ${
                        status.open ? "bg-emerald-500" : "bg-brand-red"
                      }`}
                    />
                  </span>
                  {status.open ? "Aberto agora" : "Fechado"}
                </span>
              )}

              <a
                href={links.whatsappMsg}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir no WhatsApp"
                className="hidden h-auto w-auto items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-whatsapp-dark hover:shadow-md active:scale-95 sm:inline-flex lg:h-10 lg:w-10 lg:justify-center lg:px-0 xl:h-auto xl:w-auto xl:px-4"
              >
                <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2.2} />
                <span className="hidden xl:inline">Pedir no WhatsApp</span>
              </a>
              <button
                type="button"
                aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-brown/15 text-brand-brown transition-all hover:bg-white/60 active:scale-90 dark:text-ink dark:hover:bg-white/10"
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5" strokeWidth={2} />
                ) : (
                  <Moon className="h-4.5 w-4.5" strokeWidth={2} />
                )}
              </button>
              <button
                type="button"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-brown/15 text-brand-brown transition-all active:scale-90 lg:hidden dark:text-ink"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile: card flutuante com entrada animada */}
        {menuOpen && (
          <nav className="menu-pop absolute inset-x-0 top-full z-50 mx-auto mt-3 w-[min(92vw,26rem)] rounded-[1.75rem] border border-brand-brown/10 bg-surface/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
            {NAV_ITEMS.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                  active === n.href
                    ? "bg-brand-red-soft text-brand-red"
                    : "text-brand-brown-soft hover:bg-brand-sand"
                }`}
              >
                {n.label}
              </a>
            ))}
            <a
              href={links.whatsappMsg}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-whatsapp-dark active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" /> Pedir no WhatsApp
            </a>
          </nav>
        )}
      </header>

      {/* ============================ HERO ============================ */}
      <section id="topo" className="relative isolate overflow-hidden bg-brand-brown">
        <Parallax maxPx={60} className="absolute inset-0">
          <img
            src="/images/fachada-hero.jpg"
            alt={`Fachada da ${business.name} na Rua da Felicidade, Vila Bacanga`}
            fetchPriority="high"
            className="h-full w-full scale-[1.15] object-cover object-center"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-brown/85 via-brand-brown/70 to-brand-brown/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,150,44,0.22),transparent_55%)]" />
        <Wheat
          aria-hidden
          strokeWidth={1}
          className="animate-float-slow pointer-events-none absolute top-24 -right-10 h-44 w-44 -rotate-12 text-brand-gold/10"
        />
        <Coffee
          aria-hidden
          strokeWidth={1}
          className="animate-float pointer-events-none absolute bottom-28 -left-8 h-36 w-36 rotate-12 text-brand-gold/10"
        />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

        <div className="relative mx-auto max-w-6xl 2xl:max-w-7xl px-5 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <Reveal animateOnMount delay={0}>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <StatusPill status={status} dark />
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-cream backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                  Desde sempre na Vila Bacanga
                </span>
              </div>
            </Reveal>

            <Reveal animateOnMount delay={120}>
              <h1 className="font-display text-[clamp(1.75rem,8.8vw,2.6rem)] leading-[1.03] font-semibold tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.6rem]">
                O pão quentinho
                <span className="block text-brand-gold italic">sai do forno todo dia.</span>
              </h1>
            </Reveal>

            <Reveal animateOnMount delay={240}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-cream/80 sm:text-lg">
                {business.description}
              </p>
            </Reveal>

            <Reveal animateOnMount delay={340}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={links.whatsappMsg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-red/25 transition-all hover:-translate-y-0.5 hover:bg-brand-red-dark sm:text-base"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
                  Fazer meu pedido
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={links.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-brand-cream/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-brand-cream backdrop-blur-sm transition-colors hover:bg-white/15 sm:text-base"
                >
                  <Navigation className="h-4.5 w-4.5" strokeWidth={2} />
                  Como chegar
                </a>
              </div>
            </Reveal>

            <Reveal animateOnMount delay={460}>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/15 pt-7">
                <div className="flex items-center gap-3">
                  <div className="font-display text-3xl font-semibold text-white">
                    {business.rating.value.toString().replace(".", ",")}
                  </div>
                  <div>
                    <Stars value={business.rating.value} />
                    <p className="mt-1 text-[11px] text-brand-cream/60">
                      {business.rating.count} avaliações no Google
                    </p>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-white/15 sm:block" />
                <div>
                  <div className="font-display text-3xl font-semibold text-white">
                    #{business.ranking.position}
                  </div>
                  <p className="mt-1 text-[11px] text-brand-cream/60">
                    de {business.ranking.total.toLocaleString("pt-BR")} lugares para comer em{" "}
                    {business.ranking.city}
                  </p>
                </div>
                <div className="hidden h-10 w-px bg-white/15 sm:block" />
                <div>
                  <div className="font-display text-3xl font-semibold text-white">05:45</div>
                  <p className="mt-1 text-[11px] text-brand-cream/60">
                    abrimos de segunda a sábado
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================= LETREIRO / MARQUEE ========================= */}
      <Marquee />

      {/* ========================= FAIXA DE VANTAGENS ========================= */}
      <section className="border-b border-brand-brown/10 bg-brand-sand">
        <div className="mx-auto grid max-w-6xl 2xl:max-w-7xl grid-cols-2 gap-px px-5 py-6 sm:grid-cols-4">
          {[
            { icon: Flame, label: "Assado várias vezes ao dia" },
            { icon: ShoppingBasket, label: "Conveniência completa" },
            { icon: Coffee, label: "Café e lanches rápidos" },
            { icon: Wallet, label: business.priceRange },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 px-1 py-2">
              <Icon className="h-5 w-5 shrink-0 text-brand-red" strokeWidth={1.9} />
              <span className="text-[13px] font-medium text-brand-brown-soft">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ DESTAQUES ============================ */}
      <section id="destaques" className="scroll-mt-20 bg-surface px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          <Reveal className="max-w-2xl">
            <SectionLabel>O que você encontra aqui</SectionLabel>
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-[2.75rem]">
              Uma padaria, uma conveniência e o seu{" "}
              <span className="text-brand-red italic">café de todo dia.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-brand-brown-soft sm:text-base">
              {business.about}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {business.highlights.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[h.icon as keyof typeof HIGHLIGHT_ICONS] ?? Wheat;
              return (
                <Reveal key={h.title} delay={i * 90} className="h-full">
                  <Tilt max={6} className="h-full">
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-brown/10 bg-surface-card p-6 transition-all duration-300 hover:border-brand-red/25 hover:shadow-[0_18px_40px_-18px_rgba(46,27,18,0.28)]">
                      {/* Spotlight que segue o cursor (vars --mx/--my do Tilt) */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),rgba(190,42,44,0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <span className="relative z-10 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red-soft text-brand-red transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-brand-red group-hover:text-white">
                        <Icon className="h-6 w-6" strokeWidth={1.8} />
                      </span>
                      <h3 className="relative z-10 font-display text-xl font-semibold tracking-tight">
                        {h.title}
                      </h3>
                      <p className="relative z-10 mt-2.5 flex-1 text-sm leading-relaxed text-brand-brown-soft">
                        {h.text}
                      </p>
                      <ul className="relative z-10 mt-5 flex flex-wrap gap-1.5">
                        {h.tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-full bg-brand-sand px-2.5 py-1 text-[11px] font-medium text-brand-brown-soft"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Tilt>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ PRODUTOS ============================ */}
      <section
        id="produtos"
        className="scroll-mt-20 border-t border-brand-brown/5 bg-surface-card px-5 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          <Reveal className="max-w-2xl">
            <SectionLabel>Sai do forno todos os dias</SectionLabel>
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-[2.75rem]">
              Nossos <span className="text-brand-red italic">produtos</span>, do pão ao café.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-brand-brown-soft sm:text-base">
              Fotos reais do nosso balcão. O que você vê aqui é o que sai da nossa cozinha todos os
              dias — e quando acaba, é só chamar no WhatsApp que a gente assa mais.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {business.products.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 110} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-brown/10 bg-surface-card shadow-[0_10px_30px_-24px_rgba(46,27,18,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-red/25 hover:shadow-[0_24px_50px_-22px_rgba(46,27,18,0.38)]">
                  <div className="relative h-56 overflow-hidden bg-brand-sand sm:h-64 dark:bg-white/5">
                    <img
                      src={p.img}
                      alt={p.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full p-3 object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-brand-brown uppercase backdrop-blur-sm dark:bg-brand-brown/80 dark:text-ink">
                      <Sparkles className="h-3 w-3 text-brand-gold" />
                      {p.badge}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-brown-soft">
                      {p.desc}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {p.items.map((t) => (
                        <li
                          key={t}
                          className="rounded-full bg-brand-sand px-2.5 py-1 text-[11px] font-medium text-brand-brown-soft"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal
            delay={200}
            className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-brand-brown/10 pt-8"
          >
            <p className="text-sm text-brand-brown-soft">
              Fotos reais da nossa casa ·{" "}
              <span className="font-semibold text-brand-brown dark:text-ink">
                encomendas e novidades pelo WhatsApp
              </span>
            </p>
            <a
              href={links.whatsappMsg}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-red"
            >
              Pedir pelo WhatsApp
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============================ VITRINE ============================ */}
      <section id="vitrine" className="scroll-mt-20 bg-brand-sand px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <SectionLabel>A vitrine de hoje</SectionLabel>
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-[2.75rem]">
                Fotos da nossa casa, do balcão e do{" "}
                <span className="text-brand-red italic">forno.</span>
              </h2>
            </div>
            <a
              href={links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-red"
            >
              Ver mais fotos no Google
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>

          <div className="mt-12 grid auto-rows-[210px] grid-cols-2 gap-4 sm:auto-rows-[250px] lg:grid-cols-4">
            {business.gallery.map((g, i) => (
              <Reveal
                key={g.src}
                delay={(i % 4) * 70}
                className={
                  g.span === "big" ? "col-span-2 row-span-2" : g.span === "wide" ? "col-span-2" : ""
                }
              >
                <figure
                  className="group relative h-full cursor-zoom-in overflow-hidden rounded-3xl bg-brand-brown/5"
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/75 via-brand-brown/10 to-transparent opacity-90" />
                  <figcaption className="absolute bottom-0 left-0 px-5 py-4 font-display text-base font-medium text-white sm:text-lg">
                    {g.label}
                  </figcaption>
                  <span className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-white" />
                  </span>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PROPOSIITO ============================ */}
      <section className="scroll-mt-20 bg-surface px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl 2xl:max-w-7xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionLabel>Nosso propósito</SectionLabel>
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-[2.75rem]">
              Feita para servir a Vila Bacanga,{" "}
              <span className="text-brand-red italic">todos os dias.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-brand-brown-soft sm:text-base">
              Nossa missão é simples: manter a mesa da vizinhança farta. Acender o forno de
              madrugada, encher a prateleira, passar o café na hora e atender cada um como quem
              recebe em casa — para que quem passa pela Rua da Felicidade sempre encontre pão
              quentinho, preço justo e boas-vindas.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-brown-soft sm:text-base">
              A competência se constrói no balcão, dia após dia: assar várias vezes por dia para o
              pão francês nunca terminar, folhear cada pastel no ponto certo, cuidar da vitrine e
              manter a conveniência completa. É esse padrão, repetido sem falhar, que faz a
              comunidade voltar — e indicar a gente para todo mundo.
            </p>
            <p className="mt-6 border-l-2 border-brand-gold/60 pl-4 text-[15px] leading-relaxed text-brand-brown-soft italic">
              E a referência que carregamos vai além das avaliações: está nas famílias que vêm desde
              que eram crianças, no balcão que conhece o nome de quem passa — e na fé que nos lembra
              que dar pão é um ato de generosidade.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="grid h-full grid-cols-2 gap-4">
              {[
                {
                  value: business.rating.value.toString().replace(".", ","),
                  suffix: "★",
                  label: `estrelas no Google · ${business.rating.count} avaliações`,
                },
                {
                  value: `#${business.ranking.position}`,
                  suffix: "",
                  label: `de ${business.ranking.total.toLocaleString("pt-BR")} lugares para comer em ${business.ranking.city}`,
                },
                {
                  value: "05:45",
                  suffix: "",
                  label: "abrimos de segunda a sábado",
                },
                {
                  value: "Sempre",
                  suffix: "",
                  label: "no coração da Vila Bacanga",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col justify-center rounded-3xl border border-brand-brown/10 bg-surface-card p-6"
                >
                  <div className="font-display text-3xl font-semibold tracking-tight text-brand-brown dark:text-ink">
                    {s.value}
                    {s.suffix && <span className="text-brand-gold">{s.suffix}</span>}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-brand-brown-soft">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ HISTÓRIA ============================ */}
      <section className="relative overflow-hidden bg-brand-brown px-5 py-20 text-brand-cream sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(190,42,44,0.30),transparent_55%)]" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-6xl 2xl:max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] text-brand-gold uppercase">
              <span className="h-px w-8 bg-brand-gold/40" />
              Nossa história
            </p>
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-white sm:text-[2.75rem]">
              Um pedaço da Vila Bacanga que virou{" "}
              <span className="text-brand-gold italic">tradição.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-brand-cream/75 sm:text-base">
              Quem passa pela Rua da Felicidade, ao lado do Mateus Supermercado, sente o cheiro
              antes de ver a fachada vermelha. É o pão saindo do forno. É a mesma receita, o mesmo
              balcão de vidro e o mesmo atendimento que faz a vizinhança voltar todos os dias.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-cream/75 sm:text-base">
              Aqui tem quem chega às 5h45 da manhã pelo pão francês quentinho, quem para às 9h para
              um café, e quem passa à tarde para encher a dispensa. Somos padaria, lanchonete e
              conveniência — tudo numa esquina só.
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-5 border-t border-white/15 pt-8 sm:grid-cols-3 sm:gap-6">
              <div>
                <dt className="text-[11px] tracking-wider text-brand-cream/50 uppercase">
                  Café da manhã
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">
                  a partir das 05:45
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-wider text-brand-cream/50 uppercase">
                  Domingo
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">
                  06:00 – 12:00
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-wider text-brand-cream/50 uppercase">
                  Permanência
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">
                  ~15 min
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={140} className="relative">
            <Parallax
              maxPx={35}
              className="h-[26rem] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl sm:h-[34rem]"
            >
              <img
                src="/images/rua-do-bairro.jpg"
                alt="Rua da Felicidade com a fachada da Panificadora Bacanga"
                loading="lazy"
                decoding="async"
                className="-mt-[9%] h-[118%] w-full object-cover"
              />
            </Parallax>
            <div className="animate-float absolute -bottom-6 -left-4 hidden max-w-[15rem] rounded-2xl bg-surface p-5 shadow-xl sm:block lg:-left-10">
              <Quote className="h-5 w-5 text-brand-red" />
              <p className="mt-2 font-display text-[15px] leading-snug font-medium text-brand-brown italic dark:text-ink">
                “Frequento desde que eu era criança e a cada dia eles se superam.”
              </p>
              <p className="mt-3 text-[11px] font-semibold tracking-wider text-brand-brown-soft uppercase">
                Suenelima · Google
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ AVALIAÇÕES ============================ */}
      <section id="avaliacoes" className="scroll-mt-20 bg-surface px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <SectionLabel>Quem já provou</SectionLabel>
              <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-[2.75rem]">
                {business.rating.value.toString().replace(".", ",")} estrelas em{" "}
                {business.rating.count} <span className="text-brand-red italic">avaliações.</span>
              </h2>
            </div>
            <div className="rounded-2xl border border-brand-brown/10 bg-surface-card px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="font-display text-5xl leading-none font-semibold text-brand-red">
                  {business.rating.value.toString().replace(".", ",")}
                </div>
                <div>
                  <Stars value={business.rating.value} className="mb-1.5" />
                  <p className="text-xs text-brand-brown-soft">
                    Avaliações públicas no <strong className="font-semibold">Google</strong>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {business.reviews.slice(0, 3).map((r, i) => (
              <Reveal key={`${r.name}-${i}`} delay={(i % 3) * 90} className="h-full">
                <blockquote
                  className={`flex h-full flex-col rounded-3xl border border-brand-brown/10 bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:border-brand-red/20 hover:shadow-[0_16px_36px_-20px_rgba(46,27,18,0.3)] ${
                    i % 2 === 0 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Stars value={r.stars} />
                    {r.badge && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-brand-brown-soft/70 uppercase">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {r.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-brown-soft">
                    “{r.text}”
                  </p>
                  <footer className="mt-5 flex items-center gap-3 border-t border-brand-brown/8 pt-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-red-soft font-display text-sm font-semibold text-brand-red">
                      {r.name.charAt(0)}
                    </span>
                    <span>
                      <cite className="block text-[13px] font-semibold not-italic">{r.name}</cite>
                      <span className="text-[11px] text-brand-brown-soft/70">{r.when}</span>
                    </span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={links.reviews}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-red"
            >
              Ler todas as avaliações no Google
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================ HORÁRIOS ============================ */}
      <section id="horarios" className="scroll-mt-20 bg-brand-sand px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl 2xl:max-w-7xl gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionLabel>Horários & localização</SectionLabel>
            <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight sm:text-[2.75rem]">
              Estamos <span className="text-brand-red italic">pertinho</span> de você.
            </h2>

            <div className="mt-8 mb-6">
              <StatusPill status={status} />
            </div>

            <div className="overflow-hidden rounded-3xl border border-brand-brown/10 bg-surface-card">
              <ul className="divide-y divide-brand-brown/8">
                {business.hours.map((h, i) => {
                  const isToday = i === todayIndex;
                  return (
                    <li
                      key={h.day}
                      className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${
                        isToday ? "bg-brand-red-soft/60" : ""
                      }`}
                    >
                      <span
                        className={`flex items-center gap-2 ${
                          isToday
                            ? "font-semibold text-brand-brown dark:text-ink"
                            : "text-brand-brown-soft"
                        }`}
                      >
                        {isToday && <Clock className="h-3.5 w-3.5 text-brand-red" />}
                        {h.day}
                        {isToday && (
                          <span className="rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                            hoje
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-right tabular-nums ${
                          isToday
                            ? "font-semibold text-brand-brown dark:text-ink"
                            : "text-brand-brown-soft"
                        }`}
                      >
                        {formatSlots(h.slots)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="mt-3 text-xs text-brand-brown-soft/80">
              {business.priceRange} · Pico de movimento das 05h às 13h
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-card text-brand-red ring-1 ring-brand-brown/10">
                  <MapPin className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <div className="text-sm leading-relaxed">
                  <p className="font-semibold">{business.address.street}</p>
                  <p className="text-brand-brown-soft">
                    {business.address.complement} — {business.address.district}
                    <br />
                    {business.address.city} – {business.address.state}, CEP {business.address.zip}
                  </p>
                  <p className="mt-1 text-[11px] tracking-wide text-brand-brown-soft/70">
                    Plus Code: {business.address.plusCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-card text-brand-red ring-1 ring-brand-brown/10">
                  <Phone className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <div className="text-sm leading-relaxed">
                  <a href={links.tel} className="font-semibold hover:text-brand-red">
                    {business.phone.display}
                  </a>
                  <p className="text-brand-brown-soft">Telefone e pedidos pelo WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-card text-brand-red ring-1 ring-brand-brown/10">
                  <Wallet className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <div className="text-sm leading-relaxed">
                  <p className="font-semibold">Formas de pagamento</p>
                  <p className="text-brand-brown-soft">{business.payments.join(" · ")}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160} className="flex h-full flex-col gap-5">
            <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-brand-brown/10 bg-brand-brown/5 shadow-sm">
              {/* Foto real como plano de fundo — garante algo visível caso o mapa não carregue */}
              <img
                src="/images/vitrine-interior.jpg"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-[2px]"
              />
              <iframe
                title={`Mapa — ${business.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="relative h-full min-h-[22rem] w-full border-0"
                src={`https://www.google.com/maps?q=${business.address.lat},${business.address.lng}&hl=pt-BR&z=17&output=embed`}
              />
            </div>
            <a
              href={links.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-brown px-6 py-4 text-sm font-semibold text-brand-cream transition-colors hover:bg-brand-brown/90"
            >
              <Navigation className="h-4.5 w-4.5" strokeWidth={2} />
              Traçar rota até a Bacanga
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============================ INSTAGRAM / CTA ============================ */}
      <section id="contato" className="scroll-mt-20 bg-surface px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-red px-7 py-14 sm:px-14 sm:py-16">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(201,150,44,0.35),transparent_55%)]" />
              <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] text-white/70 uppercase">
                    <span className="h-px w-8 bg-white/40" />
                    Siga e peça
                  </p>
                  <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-white sm:text-[2.6rem]">
                    Pão fresquinho todos os dias — acompanhe no Instagram.
                  </h2>
                  <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/80">
                    Novidades da vitrine, quitutes do dia e encomendas pelo WhatsApp. É só chamar
                    que a gente já começa a preparar.
                  </p>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <a
                      href={links.whatsappMsg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-red transition-transform hover:-translate-y-0.5"
                    >
                      <MessageCircle className="h-4.5 w-4.5" strokeWidth={2.2} />
                      {business.phone.display}
                    </a>
                    <a
                      href={links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                    >
                      <Instagram className="h-4.5 w-4.5" />
                      {business.instagram.handle}
                    </a>
                    <a
                      href={links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                    >
                      <Facebook className="h-4.5 w-4.5" />
                      Facebook
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    "/images/balcao-paes.jpg",
                    "/images/salgados.jpg",
                    "/images/vitrine-interior.jpg",
                    "/images/salao.jpg",
                  ].map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={
                        [
                          "Cestos de pão fresco no balcão",
                          "Salgados assados na vitrine",
                          "Vitrine de vidro da padaria vista de dentro",
                          "Salão com mesas da lanchonete",
                        ][i]
                      }
                      loading="lazy"
                      decoding="async"
                      style={{ animationDelay: `${i * 1.3}s` }}
                      className={`animate-float-slow h-36 w-full rounded-2xl object-cover ring-1 ring-white/20 sm:h-40 ${
                        i % 2 === 1 ? "translate-y-4" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ VERSÍCULO ============================ */}
      <section
        aria-label="Versículo bíblico"
        className="border-t border-brand-brown/10 bg-surface px-5 py-16 sm:py-20"
      >
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-sand">
            <Wheat className="h-5.5 w-5.5 text-brand-gold" strokeWidth={1.6} />
          </span>
          <blockquote className="mt-6 font-display text-xl leading-snug font-medium text-brand-brown italic sm:text-2xl dark:text-ink">
            “Eu sou o pão da vida; aquele que vem a mim não terá fome, e quem crê em mim nunca terá
            sede.”
          </blockquote>
          <cite className="mt-5 block text-[11px] font-semibold tracking-[0.22em] text-brand-red uppercase not-italic">
            João 6:35
          </cite>
        </Reveal>
      </section>

      {/* ============================ RODAPÉ ============================ */}
      <footer className="border-t border-brand-brown/10 bg-surface px-5 py-14">
        <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.png"
                  alt=""
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-gold/50"
                />
                <span className="font-display text-lg font-semibold tracking-tight">
                  Panificadora e Conveniência <span className="text-brand-red">Bacanga</span>
                </span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-brown-soft">
                {business.category}. {business.tagline}. Atendemos a Vila Bacanga e região, em São
                Luís do Maranhão.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <Stars value={business.rating.value} />
                <span className="text-xs text-brand-brown-soft">
                  {business.rating.value.toString().replace(".", ",")} · {business.rating.count}{" "}
                  avaliações no Google
                </span>
              </div>
              <p className="mt-4 text-xs text-brand-brown-soft/70">
                Feito com café passado na hora e pão saindo do forno. ☕
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.18em] text-brand-brown uppercase dark:text-ink">
                Endereço
              </h3>
              <address className="mt-4 space-y-1 text-sm leading-relaxed text-brand-brown-soft not-italic">
                <p>{business.address.street}</p>
                <p>{business.address.complement}</p>
                <p>
                  {business.address.district} — {business.address.city}/{business.address.state}
                </p>
                <p>CEP {business.address.zip}</p>
              </address>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.18em] text-brand-brown uppercase dark:text-ink">
                Contato
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-brand-brown-soft">
                <li>
                  <a
                    href={links.tel}
                    className="inline-flex items-center gap-2 hover:text-brand-red"
                  >
                    <Phone className="h-3.5 w-3.5" /> {business.phone.display}
                  </a>
                </li>
                <li>
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-brand-red"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-brand-red"
                  >
                    <Instagram className="h-3.5 w-3.5" /> {business.instagram.handle}
                  </a>
                </li>
                <li>
                  <a
                    href={links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-brand-red"
                  >
                    <Facebook className="h-3.5 w-3.5" /> Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-brand-brown/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-brand-brown-soft/80">
              © {new Date().getFullYear()} {business.name} · São Luís – MA. Todos os direitos
              reservados.
            </p>
            <p className="text-xs text-brand-brown-soft/60">
              Dados, endereço e horários conforme o perfil oficial do negócio no Google.
            </p>
          </div>
        </div>
      </footer>

      {/* ============================ LIGHTBOX (VITRINE) ============================ */}
      {lightboxItem !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.alt}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-brown/95 p-4 backdrop-blur-sm sm:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-brand-cream transition-colors hover:bg-white/25 sm:top-6 sm:right-6"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((v) =>
                v === null ? v : (v - 1 + business.gallery.length) % business.gallery.length,
              );
            }}
            className="absolute left-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-brand-cream transition-colors hover:bg-white/25 sm:left-6 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Próxima foto"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((v) => (v === null ? v : (v + 1) % business.gallery.length));
            }}
            className="absolute right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-brand-cream transition-colors hover:bg-white/25 sm:right-6 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <figure className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              className="max-h-[76vh] w-auto rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
            />
            <figcaption className="mt-4 text-center font-display text-lg font-medium text-brand-cream italic">
              {lightboxItem.label}
              <span className="mt-1 block text-[11px] font-sans not-italic tracking-wider text-brand-cream/50 uppercase">
                {(lightbox ?? 0) + 1} / {business.gallery.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}

      {/* Botão flutuante de WhatsApp (mobile) */}
      <a
        href={links.whatsappMsg}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed right-5 bottom-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl shadow-black/20 transition-all hover:scale-105 hover:bg-whatsapp-dark sm:hidden"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
      </a>
    </div>
  );
}
