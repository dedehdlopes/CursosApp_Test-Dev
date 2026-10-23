using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<Db>(o => o.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=cursos.db"));
var app = builder.Build();

using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<Db>();
    db.Database.EnsureCreated();
    Seed.Run(db);
}
app.UseDefaultFiles();
app.UseStaticFiles();

// Remove acentos e ignora maiúsculas para a pesquisa
static string N(string s) => new string(s.Normalize(NormalizationForm.FormD)
    .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark).ToArray()).ToLowerInvariant();

var api = app.MapGroup("/api");

// Lista com pesquisa e filtros combináveis
api.MapGet("/cursos", async (Db db, string? busca, string? categoria, string? modalidade, string? status) => {
    var q = (await db.Cursos.AsNoTracking().ToListAsync()).AsEnumerable();
    if (!string.IsNullOrWhiteSpace(busca)) {
        var b = N(busca.Trim());
        q = q.Where(c => N(c.NomeCompleto).Contains(b) || N(c.NomeBreve).Contains(b));
    }
    if (!string.IsNullOrEmpty(categoria)) q = q.Where(c => c.Categoria == categoria);
    if (!string.IsNullOrEmpty(modalidade)) q = q.Where(c => c.Modalidade == modalidade);
    if (!string.IsNullOrEmpty(status)) q = q.Where(c => c.Status == status);
    var itens = q.OrderBy(c => c.NomeCompleto).Select(c => new {
        c.Id, c.NomeCompleto, c.NomeBreve, c.Resumo, c.Categoria, c.Modalidade, c.CargaHoraria,
        c.Status, c.ImagemUrl, c.DataDisponibilizacao
    }).ToList();
    return Results.Ok(new { total = itens.Count, itens });
});

// Valores disponíveis para os filtros
api.MapGet("/filtros", async (Db db) => {
    var l = await db.Cursos.AsNoTracking().ToListAsync();
    return new {
        categorias = l.Select(c => c.Categoria).Distinct().Order(),
        modalidades = l.Select(c => c.Modalidade).Distinct().Order(),
        status = l.Select(c => c.Status).Distinct().Order()
    };
});

// Detalhe do curso
api.MapGet("/cursos/{id:int}", async (int id, Db db) => {
    var c = await db.Cursos.AsNoTracking().Include(x => x.Modulos).ThenInclude(m => m.Aulas).FirstOrDefaultAsync(x => x.Id == id);
    if (c is null) return Results.NotFound();
    return Results.Ok(new {
        c.Id, c.NomeCompleto, c.NomeBreve, c.Descricao, c.Categoria, c.Modalidade, c.CargaHoraria,
        c.PublicoAlvo, c.Status, c.Certificacao, c.ImagemUrl, c.DataDisponibilizacao,
        Modulos = c.Modulos.OrderBy(m => m.Ordem).Select(m => new { m.Ordem, m.Titulo, m.Descricao,
            Aulas = m.Aulas.OrderBy(a => a.Ordem).Select(a => new { a.Id, a.Titulo, a.Conteudo }) })
    });
});

app.Run();
