
# Users API

Este projeto tem como objetivo realizar um CRUD de usuários.



## Stack utilizada

+ **Back-end:** Node.js, Express, Typescript, Prisma e Jest.


## Aprendizados

+ Com a construção desse projeto, consegui aprender a realizar testes com Jest e criar uma documentação simples utilizando Swagger.


## Conceitos utilizados

+ SOLID
+ Injeção de Dependência
+ Repository Pattern
## Entidades

```bash
User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```
## Documentação

+ A documentação pode ser acessada na rota **/docs** da aplicação.


## Arquitetura

![Arquitetura](https://imgur.com/Iv6meQl.png)
## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/dlzzdev/users-typescript-api.git
```

Entre no diretório do projeto

```bash
  cd users-typescript-api
```

Instale as dependências

```bash
  npm install
```

Gere o Prisma Client

```bash
  npx prisma generate
```

Faça uma migração para gerar as tabelas no banco de dados

```bash
  npx prisma migrate dev
```

Inicie o servidor

```bash
  npm run start
```


## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```

