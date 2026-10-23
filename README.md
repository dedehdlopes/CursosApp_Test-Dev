# Catálogo de Cursos – SESI Indústria (atividade prática CTED)

## Objetivo
Aplicação web para consultar, pesquisar, filtrar e ver detalhes de cursos de um ambiente educacional (Moodle fictício), seguindo o protótipo do Figma. Não há integração com Moodle nem cadastro/edição de cursos.

## Tecnologias
ASP.NET Core 8 (Minimal API), Entity Framework Core 8, SQLite (código aberto), HTML/CSS/JavaScript puro, fonte Open Sans (fornecida), Docker.

## Arquitetura
Projeto único ASP.NET Core que serve o front-end estático (`wwwroot`) e a API REST (`/api`). O front-end consome a API com `fetch`; a API consulta o SQLite via EF Core. Pesquisa e filtros são aplicados na API (sem distinção de acentos e maiúsculas).

## Estrutura de pastas
- `Program.cs` – configuração e endpoints · `Data.cs` – modelos, DbContext e seed
- `wwwroot/index.html` landing · `cursos.html` catálogo com busca/filtros · `curso.html` detalhes · `ava.html` Área do aluno
- `wwwroot/css`, `js`, `img` (imagens/ícones do Figma, JPG otimizados), `fonts`
- `docs/index.html` – documentação navegável (estilo MDN) · `docs/TECNOLOGIAS.md` – detalhamento das tecnologias
- `Dockerfile`, `.gitignore`

## Execução
Requer .NET 8 SDK. Na pasta do projeto: `dotnet run` e abrir a URL exibida (ex.: http://localhost:5000).

## Configuração do banco
SQLite em `cursos.db`, criado e populado automaticamente na primeira execução (`EnsureCreated` + seed em `Data.cs`). Outro caminho: variável `ConnectionStrings__Default`. Para zerar, apague `cursos.db`.

## Endpoints
- `GET /api/cursos?busca=&categoria=&modalidade=&status=` → `{ total, itens[] }` (filtros combináveis e opcionais)
- `GET /api/cursos/{id}` → detalhe com módulos e aulas (404 se não existir)
- `GET /api/filtros` → categorias, modalidades e status existentes

## Modelo de dados
- **Curso**: Id, NomeCompleto, NomeBreve, Resumo, Descricao, Categoria, Modalidade, CargaHoraria (h), PublicoAlvo, Status, Certificacao, ImagemUrl, DataDisponibilizacao (opcional)
- **Modulo**: Id, CursoId, Ordem, Titulo, Descricao · **Aula**: Id, ModuloId, Ordem, Titulo, Conteudo
- Dados fictícios: 7 cursos, 4 categorias, 2 modalidades (EaD, Presencial), 3 status (Disponível, Em breve, Encerrado), cargas de 20 a 48 h.

## Responsividade
Layout fluido (CSS Grid/Flex), carrosséis com rolagem e *scroll-snap*, grids `auto-fit/auto-fill`, e uma única coluna abaixo de 800 px (hero, detalhe, AVA e rodapé).

## Acessibilidade
HTML semântico, link "Ir para o conteúdo", rótulos nos campos, foco visível, contagem e estados em regiões `aria-live`, erros com `role="alert"`, carrosséis acessíveis por teclado (`tabindex`, botões rotulados), acordeões com `<details>`, status e progresso também em texto/`progressbar`, `alt` nas imagens informativas, respeito a `prefers-reduced-motion`.

## Publicação
1. `dotnet publish -c Release -o publish` e compactar a pasta `publish` em ZIP.
2. Com Docker (Render, Azure App Service, Railway…): conectar o repositório; o `Dockerfile` expõe a porta 8080. O banco é recriado a cada start.

## Limitações conhecidas
- Design baseado em capturas do Figma (não no arquivo): espaçamentos e detalhes podem diferir levemente.
- Só havia 3 fotos fornecidas: elas se repetem nos cursos. O vídeo do hero/detalhe não foi fornecido (imagem estática).
- "Matricule-se" abre a Área do aluno (demonstração, sem login); o progresso fica no `localStorage` do navegador.
- Links de rodapé (termos, redes sociais) são ilustrativos. Sem migrations (`EnsureCreated`), paginação e testes automatizados.
