# Uso de Inteligência Artificial

**Ferramenta:** Claude (Anthropic), em chat.

**Objetivo:** gerar a base da aplicação (API em C#/.NET, SQLite, front-end) e adequá-la aos requisitos do processo seletivo.

**Prompts relevantes**
1. Pedido inicial de página de cursos em C#/.NET com API, banco aberto, landing page e AVA. *Aproveitado:* estrutura Minimal API + EF Core + SQLite e front-end em `wwwroot`. *Descartado:* landing com início/sobre, matrícula e AVA (não fazem parte do enunciado).
2. Envio do enunciado e pedido de adequação. *Aproveitado:* modelo de dados, endpoint de pesquisa/filtros, estados de interface, README. *Descartado/alterado:* nomes humorísticos de cursos ("para Idiotas", "em 5 minutos"), trocados por nomes profissionais.

3. Envio de capturas do Figma e do ZIP de assets, pedindo adequação do front-end. *Aproveitado:* estrutura das telas, cores, componentes, ícones e fontes. *Descartado:* a primeira interface genérica, criada antes de ver o protótipo.

**Validação** *(complete com o que você realmente fez)*: executar `dotnet run`; testar `/api/cursos` com cada filtro e combinações; pesquisar com e sem acento; limpar filtros; forçar erro (parar a API ou usar id inexistente); testar em tela estreita e navegação por teclado; ler o código gerado.

**Exemplo de erro identificado:** na primeira versão, o comando de criação das pastas usou expansão de chaves que o shell não suportou, e `css/` e `js/` não foram criadas, deixando o site sem estilo e sem script. Outro erro: o JavaScript lia `c.Id` e `c.titulo` enquanto a API devolve JSON em camelCase (`id`, `titulo`).

**Correção:** as pastas foram criadas corretamente e os arquivos regerados; o JavaScript passou a usar os nomes em camelCase da API.

**Outro exemplo de inadequação:** a primeira interface foi criada sem o protótipo e não seguia o Figma (cores, tipografia, componentes e telas diferentes). Foi refeita a partir das capturas e dos assets oficiais.
