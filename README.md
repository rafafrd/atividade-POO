# 🎓 School CRUD API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![SonarQube](https://img.shields.io/badge/SonarQube-Aprovado-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)

![License](https://img.shields.io/badge/licença-ISC-green?style=flat-square)
![Status](https://img.shields.io/badge/status-ativo-brightgreen?style=flat-square)
![Arquitetura](https://img.shields.io/badge/arquitetura-em%20camadas-blueviolet?style=flat-square)
![Padrão](https://img.shields.io/badge/padrão-Factory%20Method-orange?style=flat-square)
![OOP](https://img.shields.io/badge/paradigma-OOP-informational?style=flat-square)

</div>

> API RESTful para gerenciamento de **Alunos** e **Professores** desenvolvida com **TypeScript**, **Express 5** e **MySQL2**. O projeto segue uma arquitetura em camadas (Controller → Service → Repository → Model) e aplica conceitos de Orientação a Objetos como herança, abstração e o padrão de projeto **Factory Method**.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#️-arquitetura)
- [Modelo de Domínio](#-modelo-de-domínio-oop)
- [Banco de Dados](#️-banco-de-dados)
- [Ciclo de Vida de uma Requisição](#-ciclo-de-vida-de-uma-requisição)
- [Endpoints da API](#-endpoints-da-api)
- [Formato das Respostas](#-formato-das-respostas)
- [Validações de Negócio](#-validações-de-negócio)
- [Tecnologias](#-tecnologias)
- [Qualidade de Código](#-qualidade-de-código)
- [Ferramentas de Teste](#-ferramentas-de-teste)
- [Como Executar](#-como-executar)
- [Padrões de Projeto](#-padrões-de-projeto)

---

## 🔎 Visão Geral

O **School CRUD API** é um sistema backend voltado para o gerenciamento de entidades acadêmicas. A API permite operações completas de **CRUD** (Create, Read, Update, Delete) para alunos e professores, com validações de negócio aplicadas diretamente nas classes de domínio.

O projeto foi construído com foco em:

- **Separação de responsabilidades** entre as camadas
- **Reutilização de código** via herança e abstração
- **Segurança contra SQL Injection** com queries parametrizadas no `mysql2`
- **Validação centralizada** nas entidades de domínio
- **Código limpo e aprovado** pelo SonarQube

---

## 📁 Estrutura do Projeto

```
├── 📁 docs
│   └── 📄 banco.sql                    # Schema do banco de dados MySQL
├── 📁 src
│   ├── 📁 config
│   │   ├── 📁 enum
│   │   │   └── 📄 EnvKey.ts            # Enum com as chaves de variáveis de ambiente
│   │   └── 📄 EnvVar.ts                # Carregamento e acesso às variáveis de ambiente
│   ├── 📁 controllers
│   │   ├── 📄 aluno.controller.ts      # Handlers HTTP para rotas de alunos
│   │   └── 📄 professor.controller.ts  # Handlers HTTP para rotas de professores
│   ├── 📁 database
│   │   └── 📄 db.connection.ts         # Pool de conexão MySQL2
│   ├── 📁 middleware                   # Middlewares Express (ex: validação, erros)
│   ├── 📁 models
│   │   ├── 📄 aluno.model.ts           # Classe Aluno, interface IAlunoRow
│   │   └── 📄 professor.model.ts       # Classe Professor, interface IProfessorRow
│   ├── 📁 repository
│   │   ├── 📄 aluno.repository.ts      # Queries SQL para a tabela alunos
│   │   └── 📄 professor.repository.ts  # Queries SQL para a tabela professores
│   ├── 📁 routes
│   │   ├── 📄 aluno.routes.ts          # Definição das rotas de alunos
│   │   └── 📄 routes.ts                # Roteador raiz (agrega todos os routers)
│   ├── 📁 services
│   │   ├── 📄 aluno.service.ts         # Regras de negócio dos alunos
│   │   └── 📄 professor.service.ts     # Regras de negócio dos professores
│   └── 📄 server.ts                    # Ponto de entrada da aplicação Express
├── ⚙️ .gitignore
├── ⚙️ package.json
└── ⚙️ tsconfig.json
```

---

## 🏗️ Arquitetura

O projeto adota uma **arquitetura em 4 camadas** com fluxo de dependência unidirecional. Cada camada possui uma responsabilidade única e bem definida.

```mermaid
flowchart TD
    Client(["🌐 Cliente HTTP\n(Insomnia / Postman / Browser)"])

    subgraph ExpressLayer["⚡ Camada Express"]
        Router["📍 Router\nroutes.ts + aluno.routes.ts"]
    end

    subgraph ControllerLayer["🎮 Camada Controller"]
        AC["AlunoController\naluno.controller.ts"]
        PC["ProfessorController\nprofessor.controller.ts"]
    end

    subgraph ServiceLayer["⚙️ Camada Service"]
        AS["AlunoService\naluno.service.ts"]
        PS["ProfessorService\nprofessor.service.ts"]
    end

    subgraph RepositoryLayer["🗃️ Camada Repository"]
        AR["AlunoRepository\naluno.repository.ts"]
        PR["ProfessorRepository\nprofessor.repository.ts"]
    end

    subgraph ModelLayer["🧬 Camada Model / Domínio"]
        IPessoa["«interface»\nIPessoa"]
        Pessoa["«abstract»\nPessoa"]
        AM["Aluno"]
        PM["Professor"]
        IPessoa -.->|contrato| Pessoa
        Pessoa -->|herança| AM
        Pessoa -->|herança| PM
    end

    DB[("🗄️ MySQL\nescola_att")]

    Client -->|"HTTP Request"| Router
    Router --> AC & PC
    AC --> AS
    PC --> PS
    AS --> AR
    PS --> PR
    AS --> AM
    PS --> PM
    AR -->|"SQL parametrizado"| DB
    PR -->|"SQL parametrizado"| DB
    DB -->|"ResultSet"| AR & PR
```

### Responsabilidades por Camada

| Camada         | Arquivo(s)        | Responsabilidade                                                    |
| -------------- | ----------------- | ------------------------------------------------------------------- |
| **Controller** | `*.controller.ts` | Receber requisições HTTP, validar entrada, retornar respostas       |
| **Service**    | `*.service.ts`    | Orquestrar regras de negócio, instanciar modelos via Factory Method |
| **Repository** | `*.repository.ts` | Executar queries SQL com parâmetros seguros contra SQL Injection    |
| **Model**      | `*.model.ts`      | Representar entidades com validações internas e encapsulamento      |

---

## 🧬 Modelo de Domínio (OOP)

A camada de domínio utiliza **herança**, **abstração** e **encapsulamento** para modelar as entidades. O padrão **Factory Method** é aplicado como métodos estáticos que controlam a criação de instâncias.

```mermaid
classDiagram
    class IPessoa {
        <<interface>>
        +mostrarDados() String
    }

    class Pessoa {
        <<abstract>>
        #_nome: string
        #_email: string
        +readonly _id?: number
        +readonly _dataCad?: Date
        +get Nome() string
        +get Email() string
        +get Id() number
        +set Nome(value: string)
        +set Email(value: string)
        -_validarNome(value: string) void
        -_validarEmail(value: string) void
    }

    class Aluno {
        -_matricula: string
        -_curso: string
        -_mediaFinal?: number
        +get Matricula() string
        +get Curso() string
        +get MediaFinal() number
        +set Matricula(value)
        +set Curso(value)
        +set MediaFinal(value)
        +mostrarDados() string
        +estaAprovado() boolean
        +$criar(nome, email, matricula, curso) Aluno
        +$editar(nome, email, matricula, curso, id, mediaFinal?) Aluno
        +$deletar(id) Aluno
    }

    class Professor {
        -_disciplina: string
        -_cargaHoraria: number
        +get Disciplina() string
        +get CargaHoraria() number
        +set Disciplina(value)
        +set CargaHoraria(value)
        +mostrarDados() string
        +$criar(nome, email, disciplina, cargaHoraria) Professor
        +$editar(nome, email, id, disciplina, cargaHoraria) Professor
        +$deletar(id) Professor
    }

    IPessoa <|.. Pessoa : implementa
    Pessoa <|-- Aluno : herda
    Pessoa <|-- Professor : herda
```

---

## 🗄️ Banco de Dados

O banco utiliza **MySQL 8** com o schema `escola_att`. As tabelas possuem registro automático de data de cadastro via `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` e restrições de unicidade nos campos de email e matrícula.

### Schema

```sql
CREATE TABLE IF NOT EXISTS alunos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(45)     NOT NULL,
    email       VARCHAR(100)    UNIQUE NOT NULL,
    data_cad    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    matricula   VARCHAR(7)      UNIQUE NOT NULL,
    curso       VARCHAR(50)     NOT NULL,
    mediaFinal  DECIMAL(2, 2)
);

CREATE TABLE IF NOT EXISTS professores (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nome         VARCHAR(45)  NOT NULL,
    email        VARCHAR(100) UNIQUE NOT NULL,
    data_cad     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    disciplina   VARCHAR(50)  NOT NULL,
    cargaHoraria INT          NOT NULL
);
```

### Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    ALUNOS {
        INT id PK "AUTO_INCREMENT"
        VARCHAR_45 nome "NOT NULL"
        VARCHAR_100 email "UNIQUE NOT NULL"
        TIMESTAMP data_cad "DEFAULT CURRENT_TIMESTAMP"
        VARCHAR_7 matricula "UNIQUE NOT NULL"
        VARCHAR_50 curso "NOT NULL"
        DECIMAL mediaFinal "NULLABLE"
    }

    PROFESSORES {
        INT id PK "AUTO_INCREMENT"
        VARCHAR_45 nome "NOT NULL"
        VARCHAR_100 email "UNIQUE NOT NULL"
        TIMESTAMP data_cad "DEFAULT CURRENT_TIMESTAMP"
        VARCHAR_50 disciplina "NOT NULL"
        INT cargaHoraria "NOT NULL"
    }
```

### Restrições do Banco

| Tabela        | Campo          | Tipo           | Restrição                       |
| ------------- | -------------- | -------------- | ------------------------------- |
| `alunos`      | `id`           | `INT`          | `AUTO_INCREMENT`, `PRIMARY KEY` |
| `alunos`      | `nome`         | `VARCHAR(45)`  | `NOT NULL`                      |
| `alunos`      | `email`        | `VARCHAR(100)` | `UNIQUE NOT NULL`               |
| `alunos`      | `data_cad`     | `TIMESTAMP`    | `DEFAULT CURRENT_TIMESTAMP`     |
| `alunos`      | `matricula`    | `VARCHAR(7)`   | `UNIQUE NOT NULL`               |
| `alunos`      | `curso`        | `VARCHAR(50)`  | `NOT NULL`                      |
| `alunos`      | `mediaFinal`   | `DECIMAL(2,2)` | `NULLABLE`                      |
| `professores` | `id`           | `INT`          | `AUTO_INCREMENT`, `PRIMARY KEY` |
| `professores` | `nome`         | `VARCHAR(45)`  | `NOT NULL`                      |
| `professores` | `email`        | `VARCHAR(100)` | `UNIQUE NOT NULL`               |
| `professores` | `data_cad`     | `TIMESTAMP`    | `DEFAULT CURRENT_TIMESTAMP`     |
| `professores` | `disciplina`   | `VARCHAR(50)`  | `NOT NULL`                      |
| `professores` | `cargaHoraria` | `INT`          | `NOT NULL`                      |

---

## 🔄 Ciclo de Vida de uma Requisição

### Criação de Aluno (`POST /alunos`)

```mermaid
sequenceDiagram
    actor Cliente
    participant Router as 📍 Router
    participant Controller as 🎮 AlunoController
    participant Service as ⚙️ AlunoService
    participant Model as 🧬 Aluno (Factory)
    participant Repository as 🗃️ AlunoRepository
    participant DB as 🗄️ MySQL

    Cliente->>Router: POST /alunos
    Note over Cliente,Router: Body: { nome, email, matricula, curso }

    Router->>Controller: criar(req, res)
    Controller->>Controller: Valida campos do body
    alt Campos inválidos
        Controller-->>Cliente: 400 { "error": "Dados inválidos..." }
    end

    Controller->>Service: criar(nome, email, matricula, curso)
    Service->>Model: Aluno.criar(nome, email, matricula, curso)
    Model->>Model: new Aluno() + validarNome() + validarEmail()
    Model-->>Service: instância Aluno validada

    Service->>Repository: create({ nome, email, matricula, curso, mediaFinal: null })
    Repository->>DB: INSERT INTO alunos (...)
    DB-->>Repository: ResultSetHeader { insertId, affectedRows }
    Repository-->>Service: ResultSetHeader

    Service-->>Controller: instância Aluno
    Controller-->>Cliente: 201 { "aluno": { nome, email, ... } }
```

### Atualização de Aluno (`PUT /alunos/:id`)

```mermaid
sequenceDiagram
    actor Cliente
    participant Controller as 🎮 AlunoController
    participant Service as ⚙️ AlunoService
    participant Model as 🧬 Aluno (Factory)
    participant Repository as 🗃️ AlunoRepository
    participant DB as 🗄️ MySQL

    Cliente->>Controller: PUT /alunos/1
    Note over Cliente,Controller: Body: { nome, email, matricula, curso, mediaFinal? }

    Controller->>Controller: Extrai id dos params
    Controller->>Controller: Valida campos do body
    alt Campos inválidos
        Controller-->>Cliente: 400 { "error": "Dados inválidos..." }
    end

    Controller->>Service: editar(nome, email, matricula, curso, id, mediaFinal?)
    Service->>Model: Aluno.editar(nome, email, matricula, curso, id, mediaFinal?)
    Model->>Model: new Aluno() com id + set MediaFinal (valida 0-10)
    Model-->>Service: instância Aluno atualizada

    Service->>Repository: update(id, { nome, email, matricula, curso, mediaFinal })
    Repository->>DB: UPDATE alunos SET ... WHERE id = ?
    DB-->>Repository: ResultSetHeader { affectedRows: 1 }
    Repository-->>Service: ResultSetHeader

    Service-->>Controller: instância Aluno
    Controller-->>Cliente: 200 { "aluno": { ... } }
```

### Fluxo de Deleção (`DELETE /alunos/:id`)

```mermaid
flowchart LR
    A(["Cliente\nDELETE /alunos/1"]) --> B["Controller\nExtrai id do params"]
    B --> C["Service\ndeletar(id)"]
    C --> D["Repository\ndelete(id)"]
    D --> E[("MySQL\nDELETE FROM alunos\nWHERE id = ?")]
    E --> F{"affectedRows"}
    F -->|"= 1"| G(["✅ 200\n{ message: 'Aluno deletado com sucesso' }"])
    F -->|"Erro"| H(["❌ 500\n{ error: '...' }"])
```

---

## 📡 Endpoints da API

### 👨‍🎓 Alunos — `/alunos`

| Método   | Rota            | Descrição                    | Parâmetros               |
| -------- | --------------- | ---------------------------- | ------------------------ |
| `GET`    | `/alunos`       | Lista todos os alunos        | —                        |
| `GET`    | `/alunos/:id`   | Busca aluno por ID           | `id` (param)             |
| `GET`    | `/alunos/nome`  | Busca alunos por nome (LIKE) | `?nome=string` (query)   |
| `GET`    | `/alunos/email` | Busca aluno por email (LIKE) | `?email=string` (query)  |
| `POST`   | `/alunos`       | Cria um novo aluno           | Body JSON                |
| `PUT`    | `/alunos/:id`   | Atualiza dados de um aluno   | `id` (param) + Body JSON |
| `DELETE` | `/alunos/:id`   | Remove um aluno              | `id` (param)             |

### 👨‍🏫 Professores — `/professores`

| Método   | Rota                 | Descrição                         | Parâmetros               |
| -------- | -------------------- | --------------------------------- | ------------------------ |
| `GET`    | `/professores`       | Lista todos os professores        | —                        |
| `GET`    | `/professores/:id`   | Busca professor por ID            | `id` (param)             |
| `GET`    | `/professores/nome`  | Busca professores por nome (LIKE) | `?nome=string` (query)   |
| `GET`    | `/professores/email` | Busca professor por email (LIKE)  | `?email=string` (query)  |
| `POST`   | `/professores`       | Cria um novo professor            | Body JSON                |
| `PUT`    | `/professores/:id`   | Atualiza dados de um professor    | `id` (param) + Body JSON |
| `DELETE` | `/professores/:id`   | Remove um professor               | `id` (param)             |

### Mapa de Rotas

```mermaid
mindmap
  root(("🌐 API\nlocalhost:3000"))
    /alunos
      GET
        Lista todos
        Por ID :id
        Por nome ?nome=
        Por email ?email=
      POST
        Criar aluno
      PUT
        Atualizar :id
      DELETE
        Deletar :id
    /professores
      GET
        Lista todos
        Por ID :id
        Por nome ?nome=
        Por email ?email=
      POST
        Criar professor
      PUT
        Atualizar :id
      DELETE
        Deletar :id
```

---

## 📦 Formato das Respostas

### Sucesso

```json
// GET /alunos → 200
{
  "alunos": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@email.com",
      "data_cad": "2024-03-01T10:00:00.000Z",
      "matricula": "2024001",
      "curso": "ADS",
      "mediaFinal": 8.50
    }
  ]
}

// POST /alunos → 201
{
  "aluno": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "matricula": "2024001",
    "curso": "ADS"
  }
}

// GET /professores/1 → 200
{
  "professor": {
    "id": 1,
    "nome": "Maria Souza",
    "email": "maria@escola.com",
    "data_cad": "2024-01-15T08:30:00.000Z",
    "disciplina": "Matemática",
    "cargaHoraria": 40
  }
}

// DELETE /alunos/1 → 200
{
  "message": "Aluno deletado com sucesso"
}
```

### Erros

```json
// 400 - Dados inválidos no body
{ "error": "Dados inválidos para criação de aluno" }

// 400 - Query parameter inválido
{ "error": "Nome deve ser um texto" }

// 404 - Recurso não encontrado
{ "error": "Aluno não encontrado" }

// 500 - Erro interno com detalhes
{
  "error": "Erro ao selecionar alunos",
  "details": "mensagem do erro original"
}
```

### Códigos HTTP

```mermaid
flowchart LR
    A["Operação"] --> B{Resultado}
    B -->|"Leitura com sucesso"| C["✅ 200 OK"]
    B -->|"Criação com sucesso"| D["✅ 201 Created"]
    B -->|"Body ou query inválidos"| E["⚠️ 400 Bad Request"]
    B -->|"Recurso não existe"| F["⚠️ 404 Not Found"]
    B -->|"Erro no servidor/banco"| G["❌ 500 Internal Server Error"]
```

---

## ✅ Validações de Negócio

As validações são aplicadas diretamente nas **classes de domínio**, garantindo integridade dos dados antes de qualquer operação no banco.

```mermaid
flowchart TD
    Input(["📥 Dados de entrada"]) --> V1

    V1{"nome\n≥ 3 e ≤ 45 chars?"}
    V1 -->|Não| E1(["❌ Nome deve ter\npelo menos 3 caracteres"])
    V1 -->|Sim| V2

    V2{"email válido?\n regex"}
    V2 -->|Não| E2(["❌ Email inválido"])
    V2 -->|Sim| V3

    V3{"Aluno ou\nProfessor?"}

    V3 -->|Aluno| V4
    V4{"mediaFinal\ndefinida?"}
    V4 -->|Sim| V5{"0 ≤ media ≤ 10?"}
    V4 -->|Não| OK1(["✅ Válido — salva null\nno banco"])
    V5 -->|Não| E3(["❌ Média deve ser\nentre 0 e 10"])
    V5 -->|Sim| OK1

    V3 -->|Professor| V6
    V6{"cargaHoraria\n≥ 0?"}
    V6 -->|Não| E4(["❌ Carga horária\nnão pode ser negativa"])
    V6 -->|Sim| OK2(["✅ Válido"])
```

| Entidade    | Campo            | Regra de Validação                                        |
| ----------- | ---------------- | --------------------------------------------------------- |
| `Pessoa`    | `nome`           | Mínimo 3 e máximo 45 caracteres                           |
| `Pessoa`    | `email`          | Formato válido: `usuario@dominio.ext`                     |
| `Aluno`     | `mediaFinal`     | Entre `0` e `10` quando definida; salva `null` se omitida |
| `Aluno`     | `estaAprovado()` | Retorna `true` se `mediaFinal >= 6`                       |
| `Professor` | `cargaHoraria`   | Não pode ser negativa                                     |

---

## 🛠️ Tecnologias

### Dependências de Produção

<div align="center">

![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL2](https://img.shields.io/badge/mysql2-3.18.2-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-17.3.1-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)

</div>

### Dependências de Desenvolvimento

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![ts-node](https://img.shields.io/badge/ts--node-10.9.2-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)
![nodemon](https://img.shields.io/badge/nodemon-3.1.14-76D04B?style=for-the-badge&logo=nodemon&logoColor=white)
![Types Express](https://img.shields.io/badge/@types%2Fexpress-5.0.6-000000?style=for-the-badge&logo=express&logoColor=white)
![Types Node](https://img.shields.io/badge/@types%2Fnode-25.3.3-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

</div>

```mermaid
graph LR
    subgraph Prod["📦 Produção"]
        E["Express 5.2.1\nFramework HTTP"]
        M["mysql2 3.18.2\nDriver MySQL"]
        D["dotenv 17.3.1\nVariáveis de Ambiente"]
    end

    subgraph Dev["🔧 Desenvolvimento"]
        TS["TypeScript 5.9.3\nLinguagem"]
        TN["ts-node 10.9.2\nExecutor TS"]
        NM["nodemon 3.1.14\nLive Reload"]
        TE["@types/express\nTipagens"]
        TND["@types/node\nTipagens"]
    end

    App(["🚀 Aplicação"]) --> Prod
    App --> Dev
```

---

## 🔍 Qualidade de Código

O projeto foi analisado e aprovado pelo **SonarQube** sem nenhuma issue crítica ou bloqueante.

<div align="center">

![Quality Gate](https://img.shields.io/badge/Quality%20Gate-Aprovado-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)
![Bugs](https://img.shields.io/badge/Bugs-0-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)
![Code Smells](https://img.shields.io/badge/Code%20Smells-0-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)
![Vulnerabilities](https://img.shields.io/badge/Vulnerabilities-0-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)
![Duplications](https://img.shields.io/badge/Duplicações-0%25-brightgreen?style=for-the-badge&logo=sonarqube&logoColor=white)

</div>

### Plugin SonarQube (SonarLint)

Este projeto utiliza o **SonarLint** (plugin SonarQube para VS Code) para análise estática em tempo real durante o desenvolvimento. As verificações incluem:

- Detecção de **Code Smells** e más práticas TypeScript
- Identificação de **vulnerabilidades** de segurança (incluindo SQL Injection)
- Verificação de **cobertura de código**
- Análise de **complexidade ciclomática**
- Alertas sobre **duplicação de código**

Para configurar a análise do projeto, crie o arquivo `sonar-project.properties` na raiz:

```properties
sonar.projectKey=school-crud-api
sonar.projectName=School CRUD API
sonar.sources=src
sonar.language=ts
sonar.typescript.tsconfigPath=tsconfig.json
sonar.exclusions=node_modules/**,dist/**
```

```mermaid
flowchart LR
    Code["💻 Código TypeScript"] --> SL["🔍 SonarLint\n(VS Code Plugin)"]
    SL --> R1["✅ Sem Bugs"]
    SL --> R2["✅ Sem Vulnerabilidades"]
    SL --> R3["✅ Sem Code Smells"]
    SL --> R4["✅ 0% Duplicações"]
    R1 & R2 & R3 & R4 --> QG(["🏆 Quality Gate\nAprovado"])
```

---

## 🧪 Ferramentas de Teste

### Insomnia

<div align="center">

![Insomnia](https://img.shields.io/badge/Insomnia-4000BF?style=for-the-badge&logo=insomnia&logoColor=white)

</div>

Recomendado para testes manuais e exploração dos endpoints durante o desenvolvimento.

**Configuração de ambiente no Insomnia:**

```json
{
  "base_url": "http://localhost:3000",
  "aluno_id": "1",
  "professor_id": "1"
}
```

**Exemplo de requisição:**

```
POST {{ base_url }}/alunos
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "matricula": "2024001",
  "curso": "ADS"
}
```

### Postman

<div align="center">

![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

</div>

Compatível com o Postman para testes, documentação automática e scripts de automação.

**Collection sugerida:** Crie um arquivo `School CRUD API.postman_collection.json` com as seguintes pastas:

- `Alunos` → GET, POST, PUT, DELETE
- `Professores` → GET, POST, PUT, DELETE

**Exemplo de script de teste no Postman (aba Tests):**

```javascript
pm.test("Status 201 Created", () => {
  pm.response.to.have.status(201);
});

pm.test("Resposta contém aluno", () => {
  const json = pm.response.json();
  pm.expect(json).to.have.property("aluno");
  pm.expect(json.aluno).to.have.property("nome");
});
```

### Fluxo de Testes

```mermaid
flowchart TD
    Dev(["👨‍💻 Desenvolvedor"]) --> T1 & T2

    subgraph Insomnia["🟣 Insomnia"]
        T1["Testes Exploratórios\nRequisições manuais"]
        T1 --> I1["Validar respostas\nJSON"]
        T1 --> I2["Testar cenários\nde erro 400/404"]
        T1 --> I3["Verificar headers\ne status codes"]
    end

    subgraph Postman["🟠 Postman"]
        T2["Testes Automatizados\nScripts de validação"]
        T2 --> P1["Collections\norganizadas"]
        T2 --> P2["Environments\npor contexto"]
        T2 --> P3["Test Scripts\nassertions JS"]
    end

    I1 & I2 & I3 & P1 & P2 & P3 --> Result(["✅ API Validada"])
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js (LTS)
- MySQL 8+
- npm

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/school-crud-api.git
cd school-crud-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do MySQL

# 4. Execute o schema no banco de dados
mysql -u root -p < docs/banco.sql

# 5. Inicie o servidor em modo desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=escola_att
PORT=3000
```

### Script de Desenvolvimento

O projeto utiliza `nodemon` com `ts-node` para hot-reload automático durante o desenvolvimento:

```json
"dev": "nodemon --watch *.ts ts-node src/server.ts"
```

---

## 📐 Padrões de Projeto

```mermaid
mindmap
  root(("🏛️ Padrões\nAplicados"))
    Factory Method
      Aluno.criar()
      Aluno.editar()
      Aluno.deletar()
      Professor.criar()
      Professor.editar()
      Professor.deletar()
    Repository Pattern
      AlunoRepository
      ProfessorRepository
      Queries parametrizadas
      Isolamento do banco
    Layered Architecture
      Controller
      Service
      Repository
      Model
    OOP
      Herança
        Pessoa → Aluno
        Pessoa → Professor
      Abstração
        Pessoa abstract
        IPessoa interface
      Encapsulamento
        Getters e Setters
        Validações privadas
```

| Padrão                   | Onde é Aplicado                                                                    | Benefício                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Factory Method**       | `Aluno.criar()`, `Aluno.editar()`, `Aluno.deletar()` e equivalentes em `Professor` | Controla a criação de objetos, centraliza validações e evita instâncias inválidas          |
| **Repository Pattern**   | `AlunoRepository`, `ProfessorRepository`                                           | Isola o acesso ao banco, facilita troca de ORM/driver e torna o Service agnóstico ao banco |
| **Layered Architecture** | Toda a estrutura do projeto                                                        | Separação clara de responsabilidades, testabilidade e manutenibilidade                     |
| **Herança e Abstração**  | `Pessoa (abstract)` → `Aluno`, `Professor`                                         | Reutilização de código, validações compartilhadas, contrato via `IPessoa`                  |

---

## 📄 Licença

Distribuído sob a licença **ISC**. Consulte o `package.json` para mais detalhes.

---

<div align="center">
  <sub>Desenvolvido com TypeScript, Express e MySQL2</sub>
</div>
