# Panificadora e Conveniência Bacanga — Landing Page

Landing page institucional da **Panificadora e Conveniência Bacanga**, padaria real
localizada na Vila Bacanga, em São Luís do Maranhão.

> Pães fresquinhos todos os dias. ☕ Café e lanches rápidos — Rua da Felicidade, Vila Bacanga.

## Sobre o negócio

| Campo | Informação |
| --- | --- |
| Nome | Panificadora e Conveniência Bacanga |
| Categoria | Padaria · Panificadora · Conveniência · Lanchonete |
| Endereço | Próximo ao Mateus Supermercado — R. da Felicidade, 139-189, Vila Bacanga, São Luís/MA, CEP 65080-800 |
| Telefone | (98) 3228-2162 |
| Instagram | [@panificadorabacanga](https://www.instagram.com/panificadorabacanga/) |
| Facebook | [Panificadora e Conveniência Bacanga](https://www.facebook.com/Panificadora-e-Conveni%C3%AAncia-Bacanga-213733119564607/) |
| Avaliação | 4,4 ★ — 153 avaliações no Google |
| Faixa de preço | R$ 1–20 por pessoa |

**Horários** (perfil oficial no Google, `America/Fortaleza`):

- Segunda a sábado: 05:45 – 12:00 e 14:00 – 19:30
- Domingo: 06:00 – 12:00

## Seções da página

1. **Topbar** — endereço, telefone e nota do Google
2. **Hero** — fachada real da loja, CTA de WhatsApp, selo "aberto agora" calculado em tempo real no fuso do Maranhão
3. **Faixa de vantagens** — assado várias vezes ao dia, conveniência, café, faixa de preço
4. **O que você encontra aqui** — 4 destaques (padaria, salgados, café/conveniência, doces)
5. **Vitrine** — galeria em mosaico com fotos reais do estabelecimento e da rua
6. **Nossa história** — textos institucionais reais do perfil da empresa + depoimento
7. **Avaliações** — 6 depoimentos reais publicados no Google
8. **Horários & localização** — tabela com o dia atual destacado, mapa embutido e rota
9. **CTA Instagram/WhatsApp** — Instagram, Facebook e telefone
10. **Rodapé** — dados completos da empresa
11. **Botão flutuante de WhatsApp** no mobile

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19 + SSR) com roteamento por arquivos
- Tailwind CSS v4 — paleta da marca derivada do letreiro real da loja (vermelho `#be2a2c`, dourado `#c9962c`, marrom `#2e1b12`, creme `#fdf9f2`)
- Tipografia: [Fraunces](https://fonts.google.com/specimen/Fraunces) (títulos) + Inter (texto)
- `lucide-react` para ícones
- SEO: meta tags Open Graph e dados estruturados `schema.org/Bakery` (endereço, geo, horários, nota)

## Imagens

As fotos em `public/images/` são **do próprio estabelecimento**, obtidas a partir de
registros públicos do negócio (perfil no Google, Street View do logradouro e listagens
públicas). Foram recortadas para remover sobreposições de marca de terceiros.

O perfil do Instagram é *login-walled* e não permite extração automática de mídia — para
usar as fotos oficiais do perfil (incluindo novidades da vitrine), exporte-as
manualmente ou pela API do Instagram Graph e substitua os arquivos em `public/images/`.

## Desenvolvimento

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # build de produção (SSR/Nitro)
npm run lint
npm run format
```

### Onde editar o conteúdo

Todo o conteúdo (endereço, telefone, horários, avaliações, galeria, links) está
centralizado em [`src/lib/business.ts`](src/lib/business.ts). A página em si é
[`src/routes/index.tsx`](src/routes/index.tsx).

---

Projeto conectado ao [Lovable](https://lovable.dev). Evite reescrever o histórico já
publicado (force push, rebase ou amend) — os commits enviados à `main` sincronizam de
volta com o editor.
