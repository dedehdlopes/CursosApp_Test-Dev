# Documentação das tecnologias aplicadas

Este documento descreve cada tecnologia usada no Catálogo de Cursos, por que foi escolhida, onde aparece no código e como é usada. Complementa o `README.md`.

## 1. Visão geral

| Camada | Tecnologia | Licença | Onde |
|---|---|---|---|
| Linguagem / plataforma | C# 12 e .NET 8 | MIT | todo o back-end |
| Servidor web e API | ASP.NET Core 8 (Minimal API) | MIT | `Program.cs` |
| Acesso a dados (ORM) | Entity Framework Core 8 | MIT | `Data.cs`, `Program.cs` |
| Banco de dados | SQLite | domínio público | `cursos.db` |
| Front-end | HTML5, CSS3, JavaScript (ES2020+) | padrões abertos | `wwwroot/` |
| Tipografia | Open Sans (fornecida no Figma) | SIL OFL 1.1 | `wwwroot/fonts/` |
| Publicação | Docker (build em múltiplos estágios) | Apache 2.0 | `Dockerfile` |
| Versionamento | Git e GitHub | GPL-2.0 (Git) | repositório |
| Apoio ao desenvolvimento | Claude (IA) | — | `USO_DE_IA.md` |

Banco de dados, linguagem, framework e ORM são de código aberto, atendendo ao requisito do enunciado.

## 2. Arquitetura e fluxo de dados

Um único projeto ASP.NET Core faz duas coisas: serve os arquivos estáticos do front-end e expõe a API REST em `/api`.

```
Navegador ──(1) GET /cursos.html────────▶ Static Files (wwwroot)
Navegador ──(2) fetch /api/cursos?... ──▶ Minimal API (Program.cs)
                                            │ EF Core (LINQ)
                                            ▼
                                       SQLite (cursos.db)
Navegador ◀──(3) JSON (camelCase)─────────┘
```

1. O navegador carrega o HTML, CSS e JS.
2. O JavaScript chama a API com `fetch`, enviando busca e filtros na query string.
3. A API consulta o banco via EF Core e devolve JSON; o JavaScript monta a interface.

Por ser a mesma origem (mesmo host e porta), não é necessário configurar CORS.

## 3. C# e .NET 8

**O que é:** linguagem tipada e plataforma multiplataforma da Microsoft. O projeto usa .NET 8 (versão de suporte de longo prazo), com `Nullable` e `ImplicitUsings` habilitados no `CursosApp.csproj`.

**Por que:** é a tecnologia exigida pelo enunciado e entrega bom desempenho, tipagem forte e ferramentas maduras.

**Recursos usados:**
- *Top-level statements* em `Program.cs`, sem classe `Program` explícita.
- *Records* anônimos nas respostas da API (`new { c.Id, c.NomeCompleto, ... }`).
- `DateOnly?` para a data de disponibilização (aceita valor nulo quando não se aplica).
- LINQ para filtrar, ordenar e projetar dados.
- Funções locais e tuplas (`params (string t, string d)[]`) no seed dos cursos.

## 4. ASP.NET Core 8 (Minimal API)

**O que é:** framework web do .NET. A *Minimal API* define endpoints com poucas linhas, sem controllers.

**Por que:** a API é pequena (3 endpoints de leitura); a abordagem mínima reduz código e facilita a leitura.

**Como é usado em `Program.cs`:**
- `WebApplication.CreateBuilder` e injeção de dependência (`AddDbContext<Db>`).
- `UseDefaultFiles()` + `UseStaticFiles()`: servem `index.html` na raiz e os demais arquivos de `wwwroot`.
- `MapGroup("/api")`: agrupa os endpoints sob o prefixo `/api`.
- Parâmetros de query ligados automaticamente aos argumentos da função (`string? busca, string? categoria ...`).
- `Results.Ok(...)` e `Results.NotFound()` para os códigos HTTP 200 e 404.
- A serialização JSON usa `camelCase` por padrão, o que o JavaScript espera (`nomeCompleto`, `cargaHoraria`).

**Endpoints:**

| Método | Rota | Função |
|---|---|---|
| GET | `/api/cursos?busca=&categoria=&modalidade=&status=` | lista com pesquisa e filtros combináveis; retorna `{ total, itens }` |
| GET | `/api/cursos/{id}` | detalhe do curso com módulos e aulas; 404 se não existir |
| GET | `/api/filtros` | valores distintos de categoria, modalidade e status |

**Pesquisa sem acento:** a função `N(...)` normaliza o texto (`NormalizationForm.FormD`, remove marcas de acentuação e converte para minúsculas). Assim "matematica" encontra "Matemática". A filtragem é feita em memória após carregar os cursos, o que é adequado para um catálogo pequeno; em um catálogo grande, o ideal seria filtrar no banco.

## 5. Entity Framework Core 8

**O que é:** ORM que mapeia classes C# para tabelas e converte consultas LINQ em SQL.

**Por que:** evita SQL manual, cria o esquema a partir do modelo e mantém o código tipado.

**Pacote:** `Microsoft.EntityFrameworkCore.Sqlite` 8.0.10.

**Modelo (`Data.cs`):**
- Entidades `Curso`, `Modulo` e `Aula`, com relações 1:N (um curso tem vários módulos; um módulo tem várias aulas), reconhecidas por convenção (`CursoId`, `ModuloId`).
- `Db : DbContext` expõe `DbSet<Curso>` e `DbSet<Modulo>`.

**Recursos usados:**
- `AsNoTracking()` nas consultas somente leitura, por desempenho.
- `Include(...).ThenInclude(...)` para carregar curso, módulos e aulas em uma consulta.
- `EnsureCreated()` na inicialização: cria o banco e as tabelas se não existirem.
- `Seed.Run(db)`: insere os 7 cursos fictícios apenas se a tabela estiver vazia.

**Observação:** `EnsureCreated` não gera migrations. Para evoluir o esquema em produção, o caminho recomendado é adotar migrations (`dotnet ef migrations add ...`).

## 6. SQLite

**O que é:** banco relacional embutido, em um único arquivo (`cursos.db`), de domínio público.

**Por que:** não exige servidor, instalação ou configuração, o que torna o projeto fácil de executar e de avaliar. Atende ao requisito de banco de código aberto.

**Configuração:** a conexão padrão é `Data Source=cursos.db`. Para mudar o caminho, defina a variável de ambiente `ConnectionStrings__Default`. Para zerar os dados, apague o arquivo e reinicie.

**Limitação:** em ambientes de contêiner o disco costuma ser efêmero, então o banco é recriado e repopulado a cada novo deploy. Para dados persistentes, trocaria-se por PostgreSQL (também de código aberto), alterando apenas o provedor do EF Core e a connection string.

## 7. HTML5

**Onde:** `index.html`, `cursos.html`, `curso.html`, `ava.html`.

**Uso:**
- Elementos semânticos: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`/`blockquote`.
- Formulário de busca com `role="search"`, `label` associado a cada campo e `input type="search"`.
- `<details>`/`<summary>` para os acordeões (acessíveis por teclado, sem JavaScript).
- Atributos ARIA pontuais: `aria-live`, `aria-busy`, `aria-current`, `role="alert"`, `role="progressbar"`, `role="region"` nos carrosséis.
- `lang="pt-BR"` e *meta viewport* para responsividade.

## 8. CSS3

**Onde:** `wwwroot/css/style.css`.

**Recursos:**
- *Custom properties* (`--red`, `--dark`, `--peach`, `--ink`) para a paleta do Figma.
- `@font-face` carregando a Open Sans local, com `font-display: swap`.
- **CSS Grid** (`auto-fill`/`auto-fit` + `minmax`) para a lista de cursos, os diferenciais e o rodapé.
- **Flexbox** no cabeçalho, filtros e barras de ação.
- **Scroll snap** (`scroll-snap-type`) nos carrosséis, com rolagem horizontal nativa e acessível.
- Gradientes sobre imagem (`linear-gradient` + `var(--img)`) nos cartões de curso.
- *Media query* `max-width: 800px` que reorganiza o layout em uma coluna.
- `prefers-reduced-motion` para respeitar quem reduz animações.
- `:focus-visible` para um contorno de foco claro; classe `.so` para textos visíveis apenas a leitores de tela.

## 9. JavaScript (ES2020+)

**Onde:** `wwwroot/js/app.js`, um único arquivo sem bibliotecas ou frameworks.

**Organização:** o `<body>` de cada página define `data-page` (`home`, `catalogo`, `curso`, `ava`) e o script executa a função correspondente. `layout()` injeta o cabeçalho e o rodapé comuns.

**Recursos:**
- `fetch` + `async/await` e a função `api()` que trata respostas não 2xx como erro.
- `URLSearchParams` e `FormData` para montar a query de busca e filtros a partir do formulário.
- *Debounce* de 300 ms na digitação da busca.
- Template literals para gerar o HTML, com a função `esc()` que escapa `& < > " '` para evitar injeção de HTML.
- Estados de interface: carregando, erro (com botão "Tentar novamente"), vazio e sucesso com contagem de resultados.
- `localStorage` (com `try/catch`) guarda o progresso das aulas na Área do aluno, por curso.
- Delegação de eventos na lista de aulas e `scrollBy` nos carrosséis (respeitando `prefers-reduced-motion`).

## 10. Open Sans

Fonte fornecida junto ao protótipo do Figma, distribuída sob a licença SIL OFL 1.1 (arquivo `wwwroot/fonts/OFL.txt`). A variante variável (`OpenSans.ttf`) cobre os pesos de 300 a 800 em um único arquivo.

## 11. Docker

**Onde:** `Dockerfile`.

**Uso:** build em dois estágios.
1. Imagem `dotnet/sdk:8.0` restaura, compila e publica (`dotnet publish -c Release`).
2. Imagem `dotnet/aspnet:8.0`, menor, apenas executa o resultado.

A variável `ASPNETCORE_URLS=http://+:8080` expõe a porta 8080. Plataformas como Render, Railway e Azure App Service constroem a imagem a partir do repositório.

Sem Docker, a publicação alternativa é `dotnet publish -c Release -o publish` e o envio da pasta `publish` ao servidor com o runtime .NET 8.

## 12. Git e GitHub

Controle de versão e entrega do código. O `.gitignore` exclui `bin/`, `obj/`, `publish/` e `*.db`, evitando versionar artefatos de build e o banco gerado.

## 13. Inteligência Artificial

O Claude (Anthropic) foi usado como apoio para gerar a base do código e adequá-lo ao enunciado e ao Figma. Finalidade, prompts, validação e erros encontrados estão em `USO_DE_IA.md`.

## 14. Decisões e alternativas

| Decisão | Motivo | Alternativa |
|---|---|---|
| Minimal API em vez de MVC/controllers | API pequena, menos código | Controllers com `[ApiController]` |
| Um projeto servindo API e front-end | execução e publicação simples; sem CORS | front-end separado (React/Angular) |
| JavaScript puro | sem etapa de build, fácil de avaliar | framework com bundler |
| SQLite | zero configuração | PostgreSQL ou MySQL |
| `EnsureCreated` + seed | inicialização imediata | migrations do EF Core |
| Filtro em memória | catálogo pequeno e busca sem acento | filtro no banco com paginação |
