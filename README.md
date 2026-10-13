# Catálogo Audiovisual — API

API de catálogo audiovisual feita com Node.js, Express, Prisma e SQLite. Permite cadastrar usuários, fazer login e gerenciar obras. As avaliações já têm modelo no banco, mas ainda não possuem rotas próprias.

## Funcionalidades atuais

- Cadastro e login de usuários com senha protegida por bcrypt e token JWT válido por 1 hora.
- Rotas para consultar o usuário autenticado e verificar acesso de administrador.
- CRUD de obras: criar, listar, buscar por ID, atualizar e remover.
- Leitura pública de obras. Criação, atualização e exclusão exigem token de usuário `ADMIN`.
- Validação dos dados de cadastro, login e obras com Zod.
- Tratamento centralizado dos erros encaminhados pelos controllers, com resposta JSON.
- Banco SQLite acessado pelo Prisma e CORS habilitado no Express.

## Requisitos e instalação

Tenha Node.js e npm instalados. Execute os comandos na raiz do projeto:

```bash
npm install
```

Copie `.env.example` para `.env`. No PowerShell:

```powershell
Copy-Item .env.example .env
```

No macOS ou Linux:

```bash
cp .env.example .env
```

Preencha `JWT_SECRET` no `.env` com uma chave própria. A configuração local fica, por exemplo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="substitua-por-uma-chave-longa-e-aleatoria"
PORT=3001
```

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Caminho do banco SQLite usado pelo Prisma e pela API. |
| `JWT_SECRET` | Chave usada para assinar e verificar os tokens. |
| `PORT` | Porta HTTP da API; se não for definida, o código usa `3001`. |

O `.env` e os arquivos `.db` são ignorados pelo Git. Não envie a chave JWT nem o banco local ao repositório.

Com a URL de exemplo acima, crie o arquivo do SQLite, aplique a migração existente e gere o cliente do Prisma:

```bash
node -e "require('node:fs').writeFileSync('dev.db', '', { flag: 'a' })"
npx prisma migrate deploy
npx prisma generate
```

O primeiro comando cria `dev.db` apenas se ele ainda não existir. Se alterar `DATABASE_URL`, ajuste também o caminho desse arquivo. Para desenvolvimento, inicie a API com:

```bash
npm run dev
```

No PowerShell, se a política de execução bloquear `npm` ou `npx`, use `npm.cmd` e `npx.cmd`. Com o servidor ativo, `GET http://localhost:3001/health` deve responder `200` com `{"status":"ok"}`. Use `Ctrl+C` para parar.

> O script `npm start` ainda aponta para `src/server,js` no `package.json` e falha. Até ele ser corrigido, use `npm run dev` ou `node src/server.js`.

## Modelos e organização

| Modelo | Campos principais | Relação |
| --- | --- | --- |
| `Usuario` | `id`, `nome`, `email`, `senha`, `papel` (`USER` ou `ADMIN`) | Pode ter avaliações. |
| `Obra` | `id`, `titulo`, `descricao`, `ano` | Pode ter avaliações. |
| `Avaliacao` | `id`, `nota`, `comentario`, `data`, `usuarioId`, `obraId` | Pertence a um usuário e a uma obra. |

| Local | Responsabilidade |
| --- | --- |
| `src/server.js` | Lê a porta e inicia o servidor. |
| `src/app.js` | Configura JSON, CORS, saúde da API, rotas e o middleware final de erros. |
| `src/routes/` | Define os caminhos, métodos e controles de acesso. |
| `src/schemas/` | Valida os dados recebidos com Zod. |
| `src/middlewares/` | Valida o corpo, verifica JWT, restringe rotas de administrador e trata erros. |
| `src/controllers/` | Lê a requisição e monta a resposta HTTP. |
| `src/services/` | Aplica regras de negócio e consulta o Prisma. |
| `src/lib/prisma.js` | Cria o cliente Prisma com o adaptador SQLite. |
| `prisma/schema.prisma` | Define modelos e relações. |
| `prisma/migrations/` | Contém a migração do banco. |

O fluxo principal é **rota → middleware de validação/autenticação → controller → service → Prisma → SQLite**.
Erros lançados pelos controllers e services são encaminhados ao middleware `src/middlewares/errorHandler.js`.

## Endpoints

Use `http://localhost:3001` como URL base. Se mudar `PORT`, ajuste a URL. Envie corpos JSON com `Content-Type: application/json`.

| Método | Caminho | Acesso | Resposta de sucesso |
| --- | --- | --- | --- |
| `GET` | `/health` | Público | `200` — estado da API. |
| `POST` | `/auth/register` | Público | `201` — usuário criado, sem a senha. |
| `POST` | `/auth/login` | Público | `200` — token JWT. |
| `GET` | `/auth/me` | JWT | `200` — `id` e `papel` em `usuario`. |
| `GET` | `/auth/admin` | JWT de `ADMIN` | `200` — confirmação de acesso. |
| `GET` | `/obras` | Público | `200` — lista de obras. |
| `GET` | `/obras/:id` | Público | `200` — obra e suas avaliações. |
| `POST` | `/obras` | JWT de `ADMIN` | `201` — obra criada. |
| `PUT` | `/obras/:id` | JWT de `ADMIN` | `200` — obra atualizada. |
| `DELETE` | `/obras/:id` | JWT de `ADMIN` | `204` — sem corpo. |

### Autenticação

Cadastre um usuário com `POST /auth/register`:

```json
{
  "nome": "Ana",
  "email": "ana@example.com",
  "senha": "123456"
}
```

`nome` é obrigatório, `email` deve ser válido e `senha` precisa ter pelo menos 6 caracteres. O papel inicial é `USER`. Um e-mail já cadastrado retorna `409`.

Faça login com `POST /auth/login`:

```json
{
  "email": "ana@example.com",
  "senha": "123456"
}
```

A resposta contém `{"token":"..."}`. Nas rotas protegidas, envie o valor recebido no cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

`GET /auth/me` retorna um objeto `usuario` com o ID do cadastro e o papel `USER`. O token expira após 1 hora; faça login novamente quando isso acontecer. Sem token ou com token inválido, a API responde `401`. `GET /auth/admin` responde `403` para um usuário `USER`.

### Obras

Crie uma obra com `POST /obras` e token de `ADMIN`:

```json
{
  "titulo": "Filme de exemplo",
  "descricao": "Uma descrição opcional",
  "ano": 2024
}
```

`titulo` deve ser uma string não vazia. `descricao` é opcional e deve ser uma string. `ano` é opcional e deve ser um número inteiro a partir de 1888. Um corpo inválido recebe `400`.

Use o `id` retornado para consultar `GET /obras/:id`, atualizar com `PUT /obras/:id` ou excluir com `DELETE /obras/:id`. A atualização aceita somente os campos que deseja alterar, por exemplo:

```json
{
  "titulo": "Filme de exemplo — edição",
  "ano": 2025
}
```

`GET /obras` lista as obras em ordem crescente de ID. `GET /obras/:id` também devolve o campo `avaliacoes`, que será uma lista vazia se a obra não tiver avaliações. IDs que não são números inteiros retornam `400`; uma obra inexistente retorna `404`. Ao excluir uma obra, o serviço remove suas avaliações associadas antes de removê-la.

## Respostas de erro

O middleware central responde em JSON aos erros encaminhados a ele. Por exemplo, um login com credenciais incorretas retorna `401`:

```json
{
  "erro": "Email ou senha inválidos"
}
```

Dados inválidos ou JSON malformado retornam `400`; token ausente ou inválido retorna `401`; acesso de `USER` a uma rota de administrador retorna `403`; obra não encontrada retorna `404`; e-mail já cadastrado retorna `409`. Erros inesperados recebem status `500`. Mensagens e detalhes podem variar conforme a origem do erro.

## Roteiro de teste no Insomnia

1. Inicie a API e faça `GET /health`; confira `200`.
2. Faça `POST /auth/register` com o JSON acima; confira `201`. Use outro e-mail se já cadastrou `ana@example.com`.
3. Faça `POST /auth/login`, copie o campo `token` e use `Authorization: Bearer SEU_TOKEN` em `GET /auth/me`; confira `200`.
4. Com esse token de `USER`, faça `GET /auth/admin` e `POST /obras`; ambos devem responder `403`.
5. Para testar as operações de escrita, altere o `papel` desse usuário para `ADMIN` **no banco local**. Uma opção é abrir o Prisma Studio com `npx prisma studio`, editar o registro em `Usuario` e salvar. Não existe rota na API para conceder esse papel.
6. Faça login novamente para receber um token com o papel atualizado. Confira `GET /auth/admin` (`200`).
7. Com o token de `ADMIN`, faça `POST /obras` (`201`), `GET /obras` (`200`), `GET /obras/:id` (`200`), `PUT /obras/:id` (`200`) e `DELETE /obras/:id` (`204`). Depois da exclusão, `GET /obras/:id` deve responder `404`.

No Insomnia, escolha **Body → JSON** para `POST` e `PUT`, e adicione o token em **Headers** ou na aba de autenticação Bearer. Use o ID real devolvido na criação em vez do texto `:id`.

## Limites atuais

- `Avaliacao` existe no schema e pode aparecer em `GET /obras/:id`, mas ainda não há endpoints para criar, listar, atualizar ou remover avaliações.
- O script `npm start` precisa ter o caminho de `src/server.js` corrigido no `package.json`.
