# Vagas API

Esta API foi desenvolvida para o projeto da residência do _CEPEDI_ em Desenvolvimento Mobile. A API gerencia informações sobre usuários e vagas de emprego, sendo conectada a um aplicativo móvel. O banco de dados utilizado é o _SQLite_.

## Tecnologias Utilizadas

- _Node.js_: Ambiente de execução JavaScript.
- _Express.js_: Framework para criação da API.
- _SQLite_: Banco de dados utilizado.
- _JWT (JSON Web Token)_: Autenticação e autorização.
- _Axios_: Para requisições HTTP do lado do cliente.

## Instalação

1. Clone o repositório para sua máquina local:

   ```bash
   git clone https://github.com/Antonio-HOS/vagas-api.git
   ```

2. Navegue até o diretorio do projeto

   ```bash
   cd vagas-api
   ```

3. Instale as dependências

   ```bash
    npm install --legacy-peer-deps
   ```

4. Inicie o servidor
   ```bash
    npm start
   ```

## Documentação da API

A documentação interativa da API está disponível no Swagger, onde você pode visualizar e testar todas as rotas da API. Para acessar a documentação, basta acessar:
`/api-docs`

## Repositório do Front-End

O repositório do front-end da aplicação, que se conecta a essa API, está disponível no GitHub. Caso queira ver ou contribuir para o desenvolvimento do front-end, acesse o repositório abaixo:

[Repositório do Front-End](https://github.com/Antonio-HOS/restic36-app-vagacerta.git)

## Rotas Disponíveis

### Rota /user/login

**Descrição:**
Realiza a autenticação de um usuário e retorna um token JWT.

**Método:**
POST

**URL:**
/user/login

**Corpo da Requisição (Body):**

- **email:** (string) Endereço de email do usuário.
- **senha:** (string) Senha do usuário.

**Exemplo de Corpo da Requisição:**

```json
{
  "email": "[endereço de e-mail removido]",
  "senha": "minhaSenhaForte"
}
```

**Resposta:**

```json
{
  "token": "jwt_token_aqui"
}
```

### GET/user/

**Descrição:**
Retorna todos os usuários.

**Método:**
GET

**URL:**
/user

**Resposta:**

```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@example.com"
  },
  {
    "id": 2,
    "nome": "Maria Souza",
    "email": "maria.souza@example.com"
  }
]
```

### POST/user/

**Descrição:**
Deleta um usuário.

**Método:**
POST

**URL:**
/user

**Corpo da requisicao:**

```json
{
  "nome": "Carlos Pereira",
  "email": "carlos.pereira@example.com",
  "senha": "senhaSegura"
}
```

### DELETE/user/:id

**Descrição:**
Cria um usuário.

**Método:**
DELETE

**URL:**
/user/:id

**Reposta:**

```json
{
  "message": "Usuário deletado com sucesso"
}
```

### GET/vagas

**Descrição:**
Retorna todas as vagas de emprego.

**Método:**
GET

**URL:**
/vagas

**Resposta:**

```json
[
  {
    "id": 1,
    "titulo": "Desenvolvedor Frontend",
    "descricao": "Vaga para desenvolvedor frontend com experiência em React.",
    "dataCadastro": "2024-12-02",
    "telefone": "77 991000000",
    "status": "ativo",
    "empresa": "CEPEDI"
  },
  {
    "id": 2,
    "titulo": "Desenvolvedor Backend",
    "descricao": "Vaga para desenvolvedor backend com experiência em Node.js.",
    "dataCadastro": "2024-12-02",
    "telefone": "77 991000000",
    "status": "ativo",
    "empresa": "NAVD"
  }
]
```

### POST/vagas

**Descrição:**
Cria uma nova vaga.

**Método:**
POST

**URL:**
/vagas

**Corpo da requisição:**

```json
{
  "titulo": "Desenvolvedor Backend",
  "descricao": "Vaga para desenvolvedor backend com experiência em Node.js.",
  "dataCadastro": "2024-12-02",
  "telefone": "77 991000000",
  "status": "ativo",
  "empresa": "NAVD"
}
```

### PUT/vagas/:id

**Descrição:**
atualiza uma vaga

**Método:**
PUT

**URL:**
/vagas/:id

**Corpo da requisicao:**

```json
{
  "titulo": "Desenvolvedor Backend",
  "descricao": "Vaga para desenvolvedor backend com experiência em Node.js.",
  "dataCadastro": "2024-12-02",
  "telefone": "77 991000000",
  "status": "ativo",
  "empresa": "NAVD"
}
```

### DELETE/vagas/:id

**Descrição:**
Deleta uma vaga.

**Método:**
DELETE

**URL:**
/vagas/:id

**Reposta:**

```json
{
  "message": "Vaga deletada com sucesso"
}
```

### Certifique de ter seguido todos os passos de instalação e de execução
