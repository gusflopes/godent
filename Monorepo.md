# Iniciando um MonoRepo usando Yarn Workspaces

## Criar o repositório no Github

Vide artigo no blog: [link](http://blog.gusflopes.dev/)

## Iniciar o projeto

Iniciar o projeto normalmente e será necessário alterar o `package.json` para criar as workspaces adicionando as seguintes te linhas no final do arquivo:

```code
"private": true,
  "workspaces": {
    "packages": [
      "backend",
      "frontend/*",
      "mobile",
      "shared/*"
    ]
  }
```

No caso, com essa estrutura estamos prevendo a existência de 1 backend, 1 ou mais frontend web e 1 frontend mobile (será feito em React Native, por isso uma única codebase para iOS e Android), além de um workspace "shared".

## Estrutura do Projeto

Definida a estrutura, vamos criar a estrutura de patas inicial, além de iniciar um projeto em cada pasta usando o `yarn init -y`. Basta usar os seguintes comandos:

```bash
cd backend
yarn init -y
cd ..
cd frontend
yarn init -y
cd ..
cd mobile
yarn init -y
cd ..
```

Neste momento basta criarmos a estrutura inicial, sendo que toda a instalação de dependências será feita na pasta raiz usando o workspaces.

## Iniciando o Backend

Na pasta raiz do projeto nós vamos instalar as dependências conforme o projeto utilizando.

```bash
yarn workspace backend add express dotenv cors
```

### Configurando ESLint e Prettier

Agora vamos instalar o ESLint e Prettier para melhorar a legibilidade do código além de simplificar a formatação. Basta digitar o seguinte comando

```bash
yarn workspace backend add eslint eslint-config-airbnb-base eslint-config-prettier eslint-plugin-import eslint-plugin-prettier prettier -D

cd backend

npx eslint --init
```

Selecionar as configurações e gerar o arquivo `.eslintrc.js`, lembrando de pressionar "N" quando perguntar se deseja instalar utilizando o NPM.

Após a instalação, altere os arquivos `.eslintrc.js`, `.editorconfig` e `.prettierc` que deverão estar da seguinte forma:

.eslintrc.js

```code
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base', 'prettier'
  ],
  plugins: [ 'prettier' ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-param-reassign": "warn", // era off
    "camelcase": "on", // era off
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
  },
};
```

.editorconfig

```code
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

.prettierrc

```code
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

Pode ser necessário fazer algumas alterações no VS Code se ele ainda não estiver configurado para utilizar o Prettier e ESlint, portanto segue abaixo as principais configurações que eu uso nas Settings do VS Code relativos à formatação (Preferences: Open Settings (JSON) ):

```code
    "editor.rulers": [
        80,
        120
    ],
    "editor.parameterHints.enabled": false,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
```

### Nodemon, Sucrase e Scripts

Agora vamos para o projeto propriamente dito, o qual usará duas dependências de desenvolvimento, o Nodemon e o Sucrase. Para instalar, basta digitar o seguinte comando na pasta raiz do projeto:

```
yarn workspace backend add nodemon sucrase -D
```

Em seguida, na pasta `backend`, vamos criar um arquivo chamado `nodemon.json` que deverá possuir o seguinte conteúdo:

```
{
  "execMap": {
    "js": "node -r sucrase/register"
  }
}
```

Em seguida vamos adicionar os scripts do `backend`, geralmente antes das dependências, ao `package.json` do `backend`:

```
  "scripts": {
    "dev": "nodemon src/server.js",
    "dev:debug": "nodemon --inspect src/server.js",
    "build": "sucrase ./src -d ./dist --transforms imports",
    "start": "node dist/server.js"
  },
```

De agora em diante, basta escrever o backend.

Apenas para fazer um teste, vamos escrever um backend simples apenas para responder uma requisição HTTP e devolver uma resposta em JSON, já criando uma estrutura que podemos construir em cima dela posteriormente.

No `backend` vamos criar uma pasta `src` e, dentro da mesma três arquivos: `de dentro da três arquivos:`app.js`,`routes.js`e`server.js`.

**routes.js**

```javascript
import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => res.json({ message: "Hello World" }));

export default routes;
```

**app.js**

```javascript
import "dotenv/config";
import express from "express";
import cors from "cors";

import routes from "./routes";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
```

**server.js**

```javascript
import app from "./app";

app.listen(process.env.APP_PORT || 3333);
```

### Finalizando

Para testar o aplicativo, basta digitar `yarn dev` na pasta **backend** e tentar acessar o link `http://localhost:3333` que você deve receber um JSON com uma mensagem de "Hello World".

## Frontend
