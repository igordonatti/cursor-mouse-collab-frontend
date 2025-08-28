## Cursor Mouse Collab — Frontend (Next.js)

Aplicação frontend em Next.js que demonstra colaboração em tempo real via cursores compartilhados. Cada usuário conectado vê o próprio cursor e os cursores dos demais usuários se movendo em tempo real.

Este frontend se comunica com um backend Socket.IO (ex.: NestJS) através de eventos WebSocket. A URL do servidor é configurável por variável de ambiente.

---

### Visão geral

- **Intuito**: permitir que múltiplos usuários vejam, em tempo real, os cursores uns dos outros.
- **Tecnologias**: Next.js 15 (App Router), React 19, TypeScript, Socket.IO Client, Tailwind CSS 4, Lucide Icons.
- **Comunicação**: eventos Socket.IO (conectar, entrada/saída de usuários, broadcast de posição de cursor).

---

### Tecnologias e versões

- Next.js: 15.5.2
- React: 19.1.0 / React DOM: 19.1.0
- socket.io-client: ^4.8.1
- Tailwind CSS: ^4
- TypeScript: ^5

---

### Pré‑requisitos

- Node.js 18.18+ ou 20+
- npm 9+ (ou yarn/pnpm/bun se preferir)

---

### Instalação e execução (desenvolvimento)

1) Instale as dependências:

```bash
npm install
```

2) Configure as variáveis de ambiente (ver seção a seguir).

3) Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4) Acesse `http://localhost:3000` no navegador.

---

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```ini
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3000
```

- Utilize a URL do backend Socket.IO que estará rodando localmente ou em produção.
- Variáveis que começam com `NEXT_PUBLIC_` ficam disponíveis no cliente (não coloque segredos).

---

### Scripts npm

- `npm run dev` — inicia o servidor de desenvolvimento (Turbopack)
- `npm run build` — gera o build de produção (Turbopack)
- `npm run start` — inicia o servidor Next em modo produção
- `npm run lint` — executa o ESLint

---

### Estrutura de pastas (resumo)

```
src/
  app/
    layout.tsx         # Layout raiz (App Router)
    page.tsx           # Página inicial, renderiza o CollaborationSpace
  components/
    collaboration-space/
      CollaborationSpace.tsx  # Componente principal da colaboração
      Cursor.tsx              # Componente visual do cursor
  lib/
    socket.ts           # Cliente Socket.IO configurado
  types/
    index.ts            # Tipos compartilhados (ex.: interface Cursor)
public/
```

---

### Arquitetura e fluxo em tempo real

1) O componente `CollaborationSpace` conecta ao servidor Socket.IO ao montar.
2) Ao conectar, define o cursor do próprio usuário e registra listeners para eventos do servidor.
3) Ao mover o mouse, emite `cursor-move` com `x` e `y` (posição do cursor) e atualiza o estado local para feedback imediato.
4) Atualizações de outros usuários chegam via `cursor-update` e os cursores são atualizados no estado.
5) Ao desmontar, remove listeners e desconecta o socket.

Principais módulos:

- `src/lib/socket.ts` — instancia o cliente Socket.IO usando `NEXT_PUBLIC_WEBSOCKET_URL` (fallback `http://localhost:3000`).
- `src/components/collaboration-space/CollaborationSpace.tsx` — gerencia conexão, estado de cursores e emissão de eventos.
- `src/components/collaboration-space/Cursor.tsx` — renderiza o ícone de cursor e etiqueta com parte do id.
- `src/types/index.ts` — define `interface Cursor`.

---

### Eventos WebSocket (lado do cliente)

Listeners registrados no frontend:

- `connect` — conexão estabelecida; registra `myCursor` (id e cor).
- `existing-users` (payload: `Cursor[]`) — usuários já conectados quando entramos.
- `user-joined` (payload: `Cursor`) — novo usuário conectado.
- `user-left` (payload: `string`) — id do usuário que saiu.
- `cursor-update` (payload: `{ id: string; x: number; y: number }`) — atualização de posição de outro usuário.

Evento emitido pelo frontend:

- `cursor-move` (payload: `{ x: number; y: number }`) — enviado no `onMouseMove` para informar nova posição ao servidor.

> Observação: O backend deve reenviar `cursor-update` para os demais clientes a partir do `cursor-move` recebido.

---

### Boas práticas e convenções

- TypeScript strict habilitado.
- Alias de import: `@/*` mapeia para `src/*`.
- Componentes funcionais e hooks do React 19.
- UI básica com Tailwind CSS 4 e ícones `lucide-react`.

---

### Deploy

- Recomendado: Vercel (Next.js). Configure `NEXT_PUBLIC_WEBSOCKET_URL` nas variáveis de ambiente do projeto na Vercel.
- Certifique-se que o backend Socket.IO esteja acessível publicamente com CORS apropriado.

Build e execução em produção local:

```bash
npm run build
npm run start
```

---

### Solução de problemas (FAQ)

- "O socket não conecta": verifique `NEXT_PUBLIC_WEBSOCKET_URL` e se o backend está rodando (porta, CORS, firewall).
- "Não vejo os cursores dos outros": assegure que o backend esteja emitindo `cursor-update` ao receber `cursor-move`.
- "Minha própria posição não muda": confirme que o `onMouseMove` está disparando e que o estado `myCursor` foi inicializado após `connect`.
- "Porta 3000 ocupada": altere a porta do Next ou do backend e ajuste a URL no `.env.local`.

---

### Contribuição

1) Crie uma branch feature/...
2) Execute `npm run lint` antes do commit/PR.
3) Abra PR descrevendo objetivo e mudanças principais.

---

### Licença

Este repositório (frontend) está destinado a uso interno/estudo. Ajuste a licença conforme necessidade.

