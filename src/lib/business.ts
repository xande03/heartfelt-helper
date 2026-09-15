/**
 * Dados reais da empresa — Panificadora e Conveniência Bacanga
 *
 * Fontes: perfil no Google (Maps/Business), Instagram @panificadorabacanga,
 * Facebook oficial, Restaurant Guru, Sluurpy e avaliações públicas no Google.
 */

export const business = {
  name: "Panificadora e Conveniência Bacanga",
  shortName: "Bacanga",
  tagline: "Pães fresquinhos todos os dias",
  category: "Padaria · Panificadora · Conveniência · Lanchonete",
  priceRange: "R$ 1–20 por pessoa",

  description:
    "Panificadora e Conveniência onde você pode encontrar desde o seu café da manhã até suprimentos para seu lar. Conheça nossos deliciosos pães e quitutes da padaria, e entre para abastecer sua dispensa com muitas variedades de produtos.",

  about:
    "Atendimento diferenciado e com todo suporte para você e sua família se sentirem em casa. Tomar um café, fazer um lanche e levar o pão quentinho para a mesa — tudo isso no coração da Vila Bacanga.",

  address: {
    street: "R. da Felicidade, 139-189",
    complement: "Próximo ao Mateus Supermercado",
    district: "Vila Bacanga",
    city: "São Luís",
    state: "MA",
    zip: "65080-800",
    country: "Brasil",
    full: "Próximo ao Mateus Supermercado - R. da Felicidade, 139-189 - Vila Bacanga, São Luís - MA, 65080-800, Brasil",
    plusCode: "CMVP+GQ Vila Bacanga, São Luís - MA",
    lat: -2.5561404,
    lng: -44.3131127,
  },

  phone: { display: "(98) 3228-2162", raw: "+559832282162" },
  whatsapp: { raw: "559832282162", display: "(98) 3228-2162" },

  instagram: {
    handle: "@panificadorabacanga",
    url: "https://www.instagram.com/panificadorabacanga/",
  },
  facebook: {
    name: "Panificadora e Conveniência Bacanga",
    url: "https://www.facebook.com/Panificadora-e-Conveni%C3%AAncia-Bacanga-213733119564607/",
  },

  rating: { value: 4.4, count: 153, scale: 5 },
  ranking: { position: 202, total: 10917, city: "São Luís" },

  /** Horário oficial (perfil do Google). 0 = domingo … 6 = sábado */
  hours: [
    { day: "Domingo", short: "Dom", slots: [["06:00", "12:00"]] },
    {
      day: "Segunda-feira",
      short: "Seg",
      slots: [
        ["05:45", "12:00"],
        ["14:00", "19:30"],
      ],
    },
    {
      day: "Terça-feira",
      short: "Ter",
      slots: [
        ["05:45", "12:00"],
        ["14:00", "19:30"],
      ],
    },
    {
      day: "Quarta-feira",
      short: "Qua",
      slots: [
        ["05:45", "12:00"],
        ["14:00", "19:30"],
      ],
    },
    {
      day: "Quinta-feira",
      short: "Qui",
      slots: [
        ["05:45", "12:00"],
        ["14:00", "19:30"],
      ],
    },
    {
      day: "Sexta-feira",
      short: "Sex",
      slots: [
        ["05:45", "12:00"],
        ["14:00", "19:30"],
      ],
    },
    {
      day: "Sábado",
      short: "Sáb",
      slots: [
        ["05:45", "12:00"],
        ["14:00", "19:30"],
      ],
    },
  ] as const,

  payments: ["Dinheiro", "Pix", "Cartões de crédito", "Cartões de débito"],

  /**
   * Categorias de produtos — fotos reais do estabelecimento (Google Business).
   * `items` citados nas descrições oficiais e nas avaliações públicas.
   */
  products: [
    {
      img: "/images/paes-frango-desfiado.jpg",
      alt: "Pão de frango desfiado recém-saído do forno",
      title: "Pães & bolos",
      badge: "Sai do forno",
      desc: "Pão francês quentinho, pão suíço de frango, roscas e bolos assados várias vezes ao dia.",
      items: ["Pão francês", "Pão suíço", "Rosca", "Bolos"],
    },
    {
      img: "/images/salgados-folhados.jpg",
      alt: "Salgados folhados dourados saindo da chapa",
      title: "Salgados & lanches",
      badge: "Quentinhos",
      desc: "A melhor bomba e o pastel folheado da cidade, com sanduíches e pizzas feitas na hora.",
      items: ["Bomba", "Pastel folheado", "Sanduíches", "Pizzas"],
    },
    {
      img: "/images/bolo-de-laranja.jpg",
      alt: "Bolo de laranja com calda brilhante e rodelas de laranja",
      title: "Vitrine & doces",
      badge: "Da vitrine",
      desc: "Queijadinha, petit four de cebola, donuts e doces caseiros saindo quentinhos da vitrine.",
      items: ["Queijadinha", "Petit four", "Donuts", "Doces caseiros"],
    },
    {
      img: "/images/salao.jpg",
      alt: "Salão com mesas da lanchonete",
      title: "Café & conveniência",
      badge: "Na hora",
      desc: "Café passado na hora, sucos, refrigerantes e tudo para abastecer a dispensa da casa.",
      items: ["Café passado", "Sucos", "Refrigerantes", "Despensa"],
    },
  ] as const,

  /** Itens citados em avaliações reais e nas descrições oficiais do negócio */
  highlights: [
    {
      icon: "bread",
      title: "Padaria quentinha",
      text: "Pão francês, pão suíço de frango, roscas e bolos saindo do forno várias vezes ao dia.",
      tags: ["Pão francês", "Pão suíço", "Bolos"],
    },
    {
      icon: "snack",
      title: "Salgados & lanches",
      text: "A melhor bomba e o pastel folheado da cidade, além de sanduíches e pizzas feitas na hora.",
      tags: ["Bomba", "Pastel folheado", "Sanduíches"],
    },
    {
      icon: "coffee",
      title: "Café & conveniência",
      text: "Café passado na hora, sucos, refrigerantes e tudo para abastecer a dispensa da sua casa.",
      tags: ["Café", "Sucos", "Bebidas"],
    },
    {
      icon: "cake",
      title: "Doces & confeitaria",
      text: "Queijadinha, petit four de cebola, donuts e doces caseiros que saem quentinhos da vitrine.",
      tags: ["Queijadinha", "Petit four", "Donuts"],
    },
  ],

  /** Avaliações reais publicadas no Google */
  reviews: [
    {
      name: "Vinícius Balby",
      when: "há 2 anos",
      badge: "Local Guide",
      stars: 5,
      text: "Funcionárias muito atenciosas. A melhor bomba e pastel folheado da cidade! Queijadinha e petit four de cebola também são excepcionais. Pão francês muito bom.",
    },
    {
      name: "Suenelima",
      when: "há 5 meses",
      badge: "",
      stars: 5,
      text: "Maravilhosa, frequento desde que eu era criança e a cada dia eles se superam!",
    },
    {
      name: "Martha Paula",
      when: "há 4 meses",
      badge: "Local Guide",
      stars: 5,
      text: "Atendimento rápido, comida saborosa e com preço justo.",
    },
    {
      name: "Sidicley Farias",
      when: "há 1 ano",
      badge: "Local Guide",
      stars: 5,
      text: "Além de matar saudades de algumas variedades, tem um excelente atendimento.",
    },
    {
      name: "Luiz Neto",
      when: "avaliação no Google",
      badge: "",
      stars: 4,
      text: "Ambiente confortável, lanches top e preços excelentes.",
    },
    {
      name: "T A MORAES",
      when: "avaliação no Google",
      badge: "",
      stars: 5,
      text: "Os pães e bolos são os melhores da Ilha.",
    },
  ],

  /**
   * Galeria com fotos reais do estabelecimento e do entorno
   * (Rua da Felicidade / Vila Bacanga).
   * `span`: "big" ocupa 2×2 células da grade, "wide" ocupa 2 colunas.
   */
  gallery: [
    {
      src: "/images/rua-do-bairro.jpg",
      alt: "Fachada da Panificadora e Conveniência Bacanga vista da Rua da Felicidade",
      label: "Nossa esquina",
      span: "big" as const,
    },
    {
      src: "/images/salgados.jpg",
      alt: "Salgados assados na vitrine",
      label: "Salgados",
      span: "",
    },
    {
      src: "/images/balcao-paes.jpg",
      alt: "Cestos de pão no balcão da padaria",
      label: "Pão do dia",
      span: "",
    },
    {
      src: "/images/fachada-hero.jpg",
      alt: "Fachada e letreiro da Panificadora Bacanga",
      label: "Nossa casa",
      span: "wide" as const,
    },
    {
      src: "/images/vitrine-interior.jpg",
      alt: "Balcão de vidro e vitrine de salgados vistos de dentro",
      label: "Vitrine",
      span: "",
    },
    { src: "/images/salao.jpg", alt: "Salão com mesas da lanchonete", label: "Salão", span: "" },
    {
      src: "/images/fachada-toldo.jpg",
      alt: "Toldo e letreiro da entrada da loja",
      label: "Entrada",
      span: "wide" as const,
    },
  ],
} as const;

export const links = {
  whatsapp: `https://wa.me/${business.whatsapp.raw}`,
  whatsappMsg: `https://wa.me/${business.whatsapp.raw}?text=${encodeURIComponent(
    "Olá! Vi o site da Panificadora Bacanga e gostaria de fazer um pedido.",
  )}`,
  tel: `tel:${business.phone.raw}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Panificadora e Conveniência Bacanga, R. da Felicidade, 139-189, Vila Bacanga, São Luís - MA",
  )}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${business.address.lat},${business.address.lng}`,
  reviews:
    "https://www.google.com/search?kgmid=/g/11h32zjbk3&hl=pt-BR#lrd=0x7f68f3d2b98d2d3:0xba64ea5ffa5aa217,3,,,",
  instagram: business.instagram.url,
  facebook: business.facebook.url,
};

/* ------------------------------------------------------------------ */
/* Status "aberto agora" calculado no fuso do Maranhão (UTC-3)         */
/* ------------------------------------------------------------------ */

const TZ = "America/Fortaleza";

function nowInMaranhao() {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(new Date());

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    dom: 0,
    seg: 1,
    ter: 2,
    qua: 3,
    qui: 4,
    sex: 5,
    sáb: 6,
    sab: 6,
  };
  const wd = get("weekday").toLowerCase().replace(".", "");

  return {
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    date: new Date(),
    weekday: weekdayMap[wd] ?? new Date().getDay(),
  };
}

const toMinutes = (hhmm: string) => {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
};

export type OpenStatus = {
  open: boolean;
  label: string;
  detail: string;
  todaySlots: readonly (readonly [string, string])[];
  todayIndex: number;
};

const hoursFor = (weekday: number) => business.hours[weekday] ?? business.hours[1];

export function getOpenStatus(): OpenStatus {
  const { minutes, weekday } = nowInMaranhao();
  const today = hoursFor(weekday);
  const slots = today.slots;

  for (const [start, end] of slots) {
    if (minutes >= toMinutes(start) && minutes < toMinutes(end)) {
      return {
        open: true,
        label: "Aberto agora",
        detail: `Fecha às ${end}`,
        todaySlots: slots,
        todayIndex: weekday,
      };
    }
  }

  // Encontra a próxima abertura hoje
  const next = slots.find(([start]) => minutes < toMinutes(start));
  if (next) {
    return {
      open: false,
      label: "Fechado agora",
      detail: `Abre às ${next[0]}`,
      todaySlots: slots,
      todayIndex: weekday,
    };
  }

  // Próximo dia com funcionamento
  for (let i = 1; i <= 7; i++) {
    const d = (weekday + i) % 7;
    const nextDay = hoursFor(d);
    if (nextDay.slots.length) {
      const sameDay = d === weekday;
      return {
        open: false,
        label: "Fechado agora",
        detail: sameDay
          ? `Abre às ${nextDay.slots[0][0]}`
          : `Abre ${nextDay.short} às ${nextDay.slots[0][0]}`,
        todaySlots: slots,
        todayIndex: weekday,
      };
    }
  }

  return {
    open: false,
    label: "Fechado agora",
    detail: "",
    todaySlots: slots,
    todayIndex: weekday,
  };
}

export const formatSlots = (slots: readonly (readonly [string, string])[]) =>
  slots.length ? slots.map(([a, b]) => `${a} – ${b}`).join(" · ") : "Fechado";
