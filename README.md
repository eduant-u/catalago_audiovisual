# Catálogo Audiovisual — API

Este projeto é uma API em **Node.js + Express**. Ela usa **SQLite** como banco de dados, **Prisma** para acessar as tabelas e **JWT** para identificar quem está logado.

Por enquanto, dá para cadastrar usuários, fazer login e acessar rotas protegidas. As tabelas de **obras** e **avaliações** já estão definidas no Prisma, mas ainda não existem rotas para criar ou consultar esses dados.

## Como rodar no seu computador

Você precisa ter o Node.js e o npm instalados. Na pasta do projeto, rode:

```bash
npm install
cp .env.example .env
```

Abra o arquivo `.env` e preencha `JWT_SECRET` com uma chave de sua escolha. Ele deve ficar parecido com isto:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="uma-chave-secreta-para-testes-locais"
PORT=3001
```

Depois, crie as tabelas a partir da migração existente, gere o cliente do Prisma e inicie o servidor:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Se o PowerShell bloquear `npm` ou `npx` por causa da política de execução, use `npm.cmd` e `npx.cmd` nos comandos acima.

Se aparecer `Servidor rodando na porta 3001`, a API está pronta. Para conferir, abra `http://localhost:3001/health` no navegador: a resposta deve ser `{"status":"ok"}`. Para parar o servidor, pressione `Ctrl+C` no terminal.

> O arquivo `.env` contém configurações locais e não deve ser enviado para o Git. Se mudar `PORT`, troque também a porta nos exemplos abaixo.

## Onde fica cada coisa

| Arquivo ou pasta | Para que serve |
| --- | --- |
| `src/server.js` | Lê a porta e inicia o servidor. |
| `src/app.js` | Configura o Express, aceita JSON e conecta as rotas. |
| `src/routes/` | Define os endereços e métodos das requisições. |
| `src/schemas/` | Define quais dados cada requisição deve receber. |
| `src/middlewares/` | Valida dados, confere o token e restringe o acesso de administrador. |
| `src/controllers/` | Recebe a requisição e monta a resposta. |
| `src/services/` | Contém as regras de cadastro e login e acessa o banco. |
| `src/lib/prisma.js` | Cria a conexão do Prisma com o SQLite. |
| `prisma/schema.prisma` | Define os modelos `Usuario`, `Obra` e `Avaliacao`. |
| `prisma/migrations/` | Guarda as alterações já aplicadas à estrutura do banco. |

Em uma requisição de cadastro, por exemplo, o caminho é: **rota → validação → controller → service → Prisma → banco de dados**. Para criar uma nova funcionalidade, normalmente você define a rota, valida os dados recebidos, implementa o controller e coloca as regras e consultas ao banco no service. Depois, conecte a nova rota em `src/app.js`.

## Como testar no Insomnia

Deixe `npm run dev` rodando. No Insomnia, crie uma coleção e adicione as requisições abaixo. Use `http://localhost:3001` como endereço base. Nas requisições `POST`, escolha **Body → JSON** e cole o corpo indicado.

### 1. Verificar se a API está no ar

**GET** `http://localhost:3001/health`

Resposta esperada: `200 OK` com `{"status":"ok"}`.

### 2. Cadastrar um usuário

**POST** `http://localhost:3001/auth/register`

```json
{
  "nome": "Ana",
  "email": "ana@example.com",
  "senha": "123456"
}
```

Resposta esperada: `201 Created`, com `id`, `nome`, `email` e `papel` (`USER`). A senha não aparece na resposta. Use outro e-mail se já tiver feito esse cadastro; e-mail repetido retorna `409`.

### 3. Fazer login e copiar o token

**POST** `http://localhost:3001/auth/login`

```json
{
  "email": "ana@example.com",
  "senha": "123456"
}
```

Resposta esperada: `200 OK` com um campo `token`. Copie **somente o valor** desse campo. O token expira em **1 hora**; quando expirar, faça login de novo.

### 4. Testar uma rota protegida

**GET** `http://localhost:3001/auth/me`

No Insomnia, abra **Headers** e adicione:

```text
Authorization: Bearer COLE_O_TOKEN_AQUI
```

Resposta esperada: `200 OK`, com o `id` e o `papel` do usuário. Sem token ou com token vencido, a API retorna `401`.

### 5. Testar a rota de administrador

**GET** `http://localhost:3001/auth/admin`

Use o mesmo header `Authorization` do passo anterior. Um usuário recém-cadastrado tem papel `USER`, então a resposta esperada é `403 Forbidden`. Para testar o sucesso dessa rota no banco local, rode `npx prisma studio`, abra a tabela **Usuario**, mude o campo `papel` desse usuário para `ADMIN`, salve e **faça login novamente** para receber um token com o novo papel. Aí a rota retorna `200 OK`.

## Resumo das rotas atuais

| Método | Rota | Precisa de token? | O que faz |
| --- | --- | --- | --- |
| GET | `/health` | Não | Confirma que a API está no ar. |
| POST | `/auth/register` | Não | Cadastra um usuário. |
| POST | `/auth/login` | Não | Confere e-mail e senha e devolve um token. |
| GET | `/auth/me` | Sim | Mostra `id` e `papel` de quem está logado. |
| GET | `/auth/admin` | Sim, de administrador | Confirma o acesso de administrador. |

As rotas de obras e avaliações ainda precisam ser implementadas. Os modelos no banco são um ponto de partida, mas não há endpoints para testá-los no Insomnia neste momento.
