# API de Gerenciamento de Livros

Esta é uma API RESTful construída com Node.js e Express para gerenciamento de usuários, livros e comentários.

## Instalação

1. Certifique-se de ter o Node.js instalado em seu computador.
2. Clone este repositório.
3. Instale as dependências executando `npm install`.
4. Configure as variáveis de ambiente no arquivo `.env`, se necessário.
5. Inicie o servidor executando `npm start`.

## Rotas

### Usuários

#### Registro de Usuário

- **POST /register**
  - Cria um novo usuário com username, email e senha.
  - Body: `{ "username": "example", "email": "example@example.com", "password": "password" }`

#### Login de Usuário

- **POST /login**
  - Realiza o login de um usuário com email e senha.
  - Body: `{ "email": "example@example.com", "password": "password" }`

#### Listagem de Todos os Usuários

- **GET /users**
  - Retorna todos os usuários cadastrados.

### Livros

#### Listagem de Todos os Livros

- **GET /books**
  - Retorna todos os livros cadastrados.

#### Detalhes de um Livro

- **GET /books/:bookId**
  - Retorna os detalhes de um livro específico pelo seu ID.

#### Adição de um Livro

- **POST /my-books**
  - Adiciona um novo livro associado ao usuário autenticado.
  - Body: `{ "name": "Book Title", "description": "Book Description" }`

#### Listagem de Livros de um Usuário

- **GET /my-books/:userId**
  - Retorna todos os livros associados a um usuário específico pelo seu ID.

### Comentários

#### Listagem de Comentários de um Livro

- **GET /books/:bookId/comments**
  - Retorna todos os comentários de um livro específico pelo seu ID.

#### Adição de Comentário em um Livro

- **POST /books/:bookId/comments**
  - Adiciona um novo comentário em um livro específico pelo seu ID.
  - Body: `{ "userId": 1, "username": "example", "comment": "This is a comment" }`

## Autenticação

A autenticação é realizada via JWT (JSON Web Token). Para acessar rotas protegidas, é necessário enviar o token de autenticação no header da requisição.

### Exemplo de Header

```plaintext
Authorization: Bearer [seu_token_jwt]
```

---
