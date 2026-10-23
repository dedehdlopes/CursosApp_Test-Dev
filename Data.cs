using Microsoft.EntityFrameworkCore;

public class Curso {
    public int Id { get; set; }
    public string NomeCompleto { get; set; } = "";
    public string NomeBreve { get; set; } = "";
    public string Resumo { get; set; } = "";
    public string Descricao { get; set; } = "";
    public string Categoria { get; set; } = "";
    public string Modalidade { get; set; } = "";
    public int CargaHoraria { get; set; }
    public string PublicoAlvo { get; set; } = "";
    public string Status { get; set; } = "";
    public string Certificacao { get; set; } = "SESI";
    public string ImagemUrl { get; set; } = "";
    public DateOnly? DataDisponibilizacao { get; set; }
    public List<Modulo> Modulos { get; set; } = new();
}
public class Modulo {
    public int Id { get; set; }
    public int CursoId { get; set; }
    public int Ordem { get; set; }
    public string Titulo { get; set; } = "";
    public string Descricao { get; set; } = "";
    public List<Aula> Aulas { get; set; } = new();
}
public class Aula {
    public int Id { get; set; }
    public int ModuloId { get; set; }
    public int Ordem { get; set; }
    public string Titulo { get; set; } = "";
    public string Conteudo { get; set; } = "";
}
public class Db : DbContext {
    public Db(DbContextOptions<Db> o) : base(o) { }
    public DbSet<Curso> Cursos => Set<Curso>();
    public DbSet<Modulo> Modulos => Set<Modulo>();
}

public static class Seed {
    public static void Run(Db db) {
        if (db.Cursos.Any()) return;
        var intro = new[] { "Introdução", "Boas práticas", "Extras" };
        var aulasMod = new[] { "Vídeo-aula", "Leitura e exercícios", "Avaliação do módulo" };
        void Add(string nome, string breve, string cat, string mod, int h, string status, DateOnly? data, string publico,
                 string resumo, string desc, string img, params (string t, string d)[] mods) {
            var ms = new List<Modulo> { new Modulo { Ordem = 1, Titulo = "Introdução",
                Descricao = "Apresentação do curso, organização dos estudos e materiais extras.",
                Aulas = intro.Select((t, i) => new Aula { Ordem = i + 1, Titulo = t,
                    Conteudo = "Se você está se aprofundando neste tema, crie um espaço de estudo sem distrações, estabeleça uma rotina, interaja com colegas e instrutores nos fóruns e revise o conteúdo com regularidade." }).ToList() } };
            ms.AddRange(mods.Select((m, i) => new Modulo { Ordem = i + 2, Titulo = m.t, Descricao = m.d,
                Aulas = aulasMod.Select((a, j) => new Aula { Ordem = j + 1, Titulo = a, Conteudo = m.d }).ToList() }));
            db.Cursos.Add(new Curso { NomeCompleto = nome, NomeBreve = breve, Categoria = cat, Modalidade = mod, CargaHoraria = h,
                Status = status, DataDisponibilizacao = data, PublicoAlvo = publico, Resumo = resumo, Descricao = desc,
                ImagemUrl = img, Modulos = ms });
        }
        Add("Matemática para a Precisão: Medidas e Escalas na Metalurgia", "Matemática da Precisão", "Matemática", "EaD", 40, "Disponível", new(2026, 1, 5),
            "Profissionais e estudantes da área metalúrgica.",
            "Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem.",
            "Explore nosso curso de Matemática para a Precisão! Este programa foi desenvolvido para capacitar profissionais com as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.",
            "/img/hero-image.jpg",
            ("Grandezas e unidades", "Sistema métrico, conversões e instrumentos de medição."),
            ("Proporções e escalas", "Leitura de desenhos técnicos e cálculo de escalas."),
            ("Tolerâncias e ajustes", "Cálculo de tolerâncias em peças usinadas."));
        Add("Geometria e Modelagem no Design Têxtil", "Geometria Têxtil", "Matemática", "Presencial", 30, "Disponível", new(2026, 2, 2),
            "Designers, modelistas e técnicos da indústria têxtil.",
            "Explora formas geométricas, simetria e padrões matemáticos presentes em tecidos e estampas.",
            "Aprenda a aplicar geometria na criação de moldes, encaixes e estampas, reduzindo desperdício de material.",
            "/img/video-thumb.jpg",
            ("Formas e simetria", "Figuras planas, simetrias e repetição de padrões."),
            ("Moldes e encaixes", "Construção de moldes e otimização do corte."),
            ("Estampas", "Padrões contínuos e rapport de estampas."));
        Add("Estatística e Controle de Qualidade na Produção", "Estatística da Qualidade", "Matemática", "EaD", 36, "Em breve", new(2026, 12, 7),
            "Técnicos e analistas de qualidade.",
            "Leitura e interpretação de dados de controle de qualidade e produtividade.",
            "Use estatística descritiva e gráficos de controle para monitorar processos e reduzir defeitos na produção.",
            "/img/banner-ava.jpg",
            ("Estatística descritiva", "Média, mediana, desvio-padrão e histogramas."),
            ("Gráficos de controle", "Construção e interpretação de cartas de controle."),
            ("Capacidade do processo", "Índices Cp e Cpk e melhoria contínua."));
        Add("Física do Movimento e da Energia na Metalurgia", "Física na Metalurgia", "Ciências da Natureza", "Presencial", 48, "Encerrado", new(2025, 8, 4),
            "Operadores e técnicos de fornos e prensas.",
            "Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas.",
            "Compreenda os princípios físicos por trás das máquinas e processos térmicos da metalurgia.",
            "/img/hero-image.jpg",
            ("Forças e atrito", "Leis de Newton aplicadas a máquinas."),
            ("Calor e temperatura", "Transferência de calor em fornos."),
            ("Energia e trabalho", "Eficiência energética em prensas e motores."));
        Add("Química Sustentável no Acabamento Industrial", "Química Sustentável", "Ciências da Natureza", "EaD", 32, "Disponível", new(2026, 3, 9),
            "Técnicos de acabamento e tratamento de superfícies.",
            "Estudo das reações envolvidas em processos de acabamento com menor impacto ambiental.",
            "Conheça alternativas químicas mais seguras e sustentáveis para limpeza, pintura e revestimento de peças.",
            "/img/video-thumb.jpg",
            ("Reações e materiais", "Reações de oxidação e proteção de superfícies."),
            ("Substituição de insumos", "Produtos menos tóxicos e seus resultados."),
            ("Descarte e reuso", "Tratamento de efluentes e reaproveitamento."));
        Add("Gestão de Resíduos e Economia Circular na Indústria", "Economia Circular", "Sustentabilidade", "EaD", 24, "Em breve", new(2027, 2, 1),
            "Gestores, supervisores e equipes de meio ambiente.",
            "Práticas para reduzir, reaproveitar e destinar corretamente resíduos industriais.",
            "Planeje a gestão de resíduos com foco em redução de custos e conformidade ambiental.",
            "/img/banner-ava.jpg",
            ("Diagnóstico de resíduos", "Inventário e classificação de resíduos."),
            ("Reaproveitamento", "Reuso, reciclagem e simbiose industrial."),
            ("Indicadores ambientais", "Metas e acompanhamento de resultados."));
        Add("Comunicação Técnica e Leitura de Manuais Industriais", "Comunicação Técnica", "Linguagens", "Presencial", 20, "Disponível", new(2026, 4, 13),
            "Operadores, técnicos e líderes de equipe.",
            "Leitura de manuais, redação de relatórios e comunicação clara no chão de fábrica.",
            "Desenvolva leitura técnica e escrita objetiva para registrar ocorrências e transmitir instruções com segurança.",
            "/img/hero-image.jpg",
            ("Leitura de manuais", "Estratégias para localizar e interpretar instruções."),
            ("Relatórios técnicos", "Estrutura e linguagem de relatórios de ocorrência."),
            ("Comunicação em equipe", "Passagem de turno e comunicação assertiva."));
        db.SaveChanges();
    }
}
