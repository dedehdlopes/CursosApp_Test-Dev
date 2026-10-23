const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const fmt = d => d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "";
async function api(url) { const r = await fetch(url); if (!r.ok) { const e = new Error(r.status); e.status = r.status; throw e; } return r.json(); }
const ICONE = { "Matemática": "matematica", "Ciências da Natureza": "ciencias-natureza", "Linguagens": "linguagens", "Sustentabilidade": "sustentabilidade" };
const cat = c => `<span class="cat"><img src="/img/icon-${ICONE[c] || "matematica"}-20px.svg" alt="" width="16" height="16">${esc(c)}</span>`;
const ERRO = '<div class="msg erro" role="alert">Não foi possível carregar as informações. Verifique a conexão e tente novamente. <button type="button" id="tentar" class="btn dark">Tentar novamente</button></div>';
const card = c => `<a class="card" href="/curso.html?id=${c.id}" style="--img:url(${esc(c.imagemUrl)})"><div class="ct">${cat(c.categoria)}<h3>${esc(c.nomeCompleto)}</h3><p>${esc(c.resumo)}</p><p class="meta">${esc(c.modalidade)} · ${c.cargaHoraria} h · ${esc(c.status)}</p></div></a>`;

const DEP = [["A experiência do curso foi incrível! As aulas foram muito bem estruturadas e o cronograma foi cuidadosamente planejado.", "Lucas Pereira", "Analista na Empresa X"],
["Concluir o curso foi uma jornada enriquecedora. As aulas eram dinâmicas e o horário foi organizado para maximizar nosso tempo de estudo.", "Mariana Costa", "Gestora na Empresa X"],
["O curso superou minhas expectativas! As aulas eram bem elaboradas e o planejamento do horário ajudou a manter o foco.", "Thiago Almeida", "Técnico na Empresa X"],
["Finalizar o curso foi uma experiência motivadora. As aulas foram muito bem preparadas e o cronograma foi ideal.", "Fernanda Silva", "Analista na Empresa X"],
["A conclusão do curso foi uma etapa gratificante, bem organizada e com horários que facilitaram o aprendizado.", "Gabriel Santos", "Analista na Empresa X"]];
const SETAS = '<div class="setas"><button class="seta" type="button" data-dir="-1" aria-label="Anterior"><img src="/img/arrow-navigation.svg" alt=""></button><button class="seta" type="button" data-dir="1" aria-label="Próximo"><img src="/img/arrow-navigation-1.svg" alt=""></button></div>';
const star = '<img src="/img/star.svg" alt="" width="20" height="20">';
const depSec = cls => `<section class="dep car ${cls}"><div class="wrap"><small>DEPOIMENTOS</small><h2>Quem fez recomenda</h2>
  <div class="trilho" tabindex="0" role="region" aria-label="Depoimentos">${DEP.map(d => `<figure class="dc"><blockquote>“${d[0]}”</blockquote><figcaption><b>${d[1]}</b><span>${d[2]}</span><span class="est" role="img" aria-label="5 de 5 estrelas">${star.repeat(5)}</span></figcaption></figure>`).join("")}</div>${SETAS}</div></section>`;
const FEATS = [["certificacao", "Certificação SESI", "Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI."], ["professores", "Professores especialistas", "Contamos com professores reconhecidos por sua excelência no mercado."], ["suporte", "Suporte contínuo", "Você não está sozinho! Acompanhamento online durante todo o curso."], ["flexibilidade", "Flexibilidade", "Turmas presenciais e online com horários que se adaptam à sua rotina."]];
const feats = (cor, n) => `<div class="feats">${FEATS.slice(0, n).map((f, i) => `<div><img src="/img/0${i + 1}-${f[0]}-${cor}.svg" alt="" width="48" height="48"><h3>${f[1]}</h3><p>${f[2]}</p></div>`).join("")}</div>`;

function layout() {
  const cab = $("#cab"), rod = $("#rod");
  if (cab) cab.innerHTML = `<a class="skip" href="#conteudo">Ir para o conteúdo</a><header class="top"><div class="wrap"><a href="/"><img src="/img/logo-sesi-industria-primary.svg" alt="SESI Indústria – página inicial"></a><nav class="menu" aria-label="Principal"><a href="/">Início</a><a href="/cursos.html">Cursos</a><a href="/#sobre">Sobre</a><a class="btn out" href="/ava.html?id=1">Área do aluno</a></nav></div></header>`;
  if (rod) rod.innerHTML = `<footer class="rod"><div class="wrap"><div class="cols"><div><img src="/img/logo-sesi-industria-white.svg" alt="SESI Indústria" height="24"><p>contato@sesindustria.com.br<br>Av. Paulista, 1313</p></div>
    <div><h3>Navegação</h3><ul><li><a href="/">Início</a></li><li><a href="/cursos.html">Cursos</a></li><li><a href="/#sobre">Sobre</a></li></ul></div>
    <div><h3>Cursos populares</h3><ul><li><a href="/cursos.html">Cultura Organizacional</a></li><li><a href="/cursos.html">Excel Básico ao Avançado</a></li><li><a href="/cursos.html">Gestão do Tempo e Produtividade</a></li><li><a href="/cursos.html">Comunicação Assertiva</a></li></ul></div>
    <div><h3>Suporte</h3><ul><li><a href="#">Termos de Uso</a></li><li><a href="#">Política de Privacidade</a></li><li><a href="#">Central de Ajuda</a></li></ul></div></div>
    <div class="fim"><span><img class="b" src="/img/logo-sesi.svg" alt="SESI" height="16"> Todos os direitos reservados.</span><div><a href="#" aria-label="LinkedIn"><img class="b" src="/img/icon-linkedIn-24px.svg" alt=""></a><a href="#" aria-label="Instagram"><img class="b" src="/img/icon-instagram-24px.svg" alt=""></a><a href="#" aria-label="Facebook"><img class="b" src="/img/icon-facebook-24px.svg" alt=""></a></div></div></div></footer>`;
}
function setas() {
  const red = matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.querySelectorAll(".car").forEach(s => { const t = s.querySelector(".trilho");
    s.querySelectorAll(".seta").forEach(b => b.onclick = () => t.scrollBy({ left: +b.dataset.dir * 300, behavior: red ? "auto" : "smooth" })); });
}

async function home() {
  $("#dep").innerHTML = depSec("escura"); setas();
  const el = $("#destaques");
  const c = async () => { try { el.innerHTML = (await api("/api/cursos")).itens.slice(0, 6).map(card).join(""); } catch { el.innerHTML = ERRO; $("#tentar").onclick = c; } };
  c();
}

async function catalogo() {
  const f = $("#filtros"), lista = $("#lista"), cont = $("#contagem");
  async function carregar() {
    lista.setAttribute("aria-busy", "true");
    lista.innerHTML = '<p class="msg" role="status">Carregando cursos…</p>';
    const p = new URLSearchParams(new FormData(f)); [...p].forEach(([k, v]) => { if (!v.trim()) p.delete(k); });
    try {
      const r = await api("/api/cursos?" + p);
      cont.textContent = `${r.total} ${r.total === 1 ? "curso encontrado" : "cursos encontrados"}`;
      lista.innerHTML = r.total ? r.itens.map(card).join("") : '<p class="msg">Nenhum curso encontrado. Altere a pesquisa ou limpe os filtros.</p>';
    } catch { cont.textContent = ""; lista.innerHTML = ERRO; $("#tentar").onclick = iniciar; }
    lista.removeAttribute("aria-busy");
  }
  async function iniciar() {
    try {
      const fl = await api("/api/filtros");
      for (const [id, vals] of [["categoria", fl.categorias], ["modalidade", fl.modalidades], ["status", fl.status]]) {
        const s = $("#" + id), at = s.value; s.length = 1; vals.forEach(v => s.add(new Option(v, v))); s.value = at;
      }
    } catch { lista.innerHTML = ERRO; $("#tentar").onclick = iniciar; return; }
    carregar();
  }
  let t; $("#busca").addEventListener("input", () => { clearTimeout(t); t = setTimeout(carregar, 300); });
  f.addEventListener("change", carregar); f.addEventListener("submit", e => { e.preventDefault(); carregar(); });
  $("#limpar").onclick = () => { f.reset(); carregar(); $("#busca").focus(); };
  iniciar();
}

async function curso() {
  const el = $("#detalhe"), id = new URLSearchParams(location.search).get("id");
  async function carregar() {
    el.innerHTML = '<div class="wrap"><p class="msg" role="status">Carregando curso…</p></div>';
    try {
      const c = await api("/api/cursos/" + encodeURIComponent(id));
      document.title = `${c.nomeCompleto} – SESI Indústria`;
      const ok = c.status === "Disponível", rot = ok ? "Matricule-se →" : c.status === "Em breve" ? "Em breve" : "Matrículas encerradas";
      const btn = ok ? `<a class="btn dark" href="/ava.html?id=${c.id}">${rot}</a>` : `<span class="btn off" role="note">${rot}</span>`;
      el.innerHTML = `<div class="wrap d-hero"><div>${cat(c.categoria)}<span class="badge">${esc(c.status)}</span><h1>${esc(c.nomeCompleto)}</h1>
          ${c.dataDisponibilizacao ? `<p>Início do curso: <b>${fmt(c.dataDisponibilizacao)}</b></p>` : ""}<p>Certificação: <b>${esc(c.certificacao)}</b></p>
          <p>Modalidade: <b>${esc(c.modalidade)}</b> · Carga horária: <b>${c.cargaHoraria} horas</b></p><p>Público-alvo: <b>${esc(c.publicoAlvo)}</b></p><p>${btn}</p></div>
        <img class="p" src="${esc(c.imagemUrl)}" alt="Imagem de apresentação do curso ${esc(c.nomeBreve)}"></div>
        <div class="wrap">${feats("bege", 4)}</div>
        <div class="wrap sobre"><div><h2>Sobre o curso</h2><p>${esc(c.descricao)}</p></div><div>
          <details open><summary>Módulos</summary><ol>${c.modulos.map(m => `<li><b>${esc(m.titulo)}</b> – ${esc(m.descricao)}</li>`).join("")}</ol></details>
          <details><summary>Aulas online e avaliações</summary><p>Cada módulo tem vídeo-aula, leitura com exercícios e avaliação. O progresso é registrado na Área do aluno.</p></details>
          <details><summary>Dúvidas frequentes</summary><p>Precisa de ajuda? Use o botão “Mandar uma mensagem” ao final da página para falar com a equipe.</p></details></div></div>
        ${depSec("clara")}
        <section class="cta centro"><div class="wrap"><small>Precisa de ajuda para decidir?</small><h2>Fale com a gente</h2><a class="btn light" href="mailto:contato@sesindustria.com.br">Mandar uma mensagem →</a></div></section>
        <div class="fixa"><span>${esc(c.nomeCompleto)}</span>${ok ? `<a class="btn light" href="/ava.html?id=${c.id}">Matricule-se →</a>` : `<span>${rot}</span>`}</div>`;
      document.body.classList.add("tem-fixa"); setas();
    } catch (e) {
      if (e.status === 404) el.innerHTML = '<div class="wrap"><p class="msg">Curso não encontrado. <a href="/cursos.html">Ver todos os cursos</a></p></div>';
      else { el.innerHTML = '<div class="wrap">' + ERRO + "</div>"; $("#tentar").onclick = carregar; }
    }
  }
  carregar();
}

async function ava() {
  const el = $("#ava"), id = new URLSearchParams(location.search).get("id") || "1";
  try {
    const c = await api("/api/cursos/" + encodeURIComponent(id)), key = "ava:" + id;
    let feitas = []; try { feitas = JSON.parse(localStorage.getItem(key) || "[]"); } catch { }
    const aulas = c.modulos.flatMap(m => m.aulas.map((a, i) => ({ ...a, num: `${m.ordem}.${i + 1}` })));
    let atual = aulas[0].id, termo = "";
    document.title = `${c.nomeCompleto} – Área do aluno`;
    el.innerHTML = `<aside class="lat"><a class="volta" href="/curso.html?id=${c.id}" aria-label="Voltar para a página do curso">←</a><div class="cab"><small>CERTIFICAÇÃO</small><h1>${esc(c.nomeCompleto)}</h1>
      <div class="prog"><div class="bar" id="pb" role="progressbar" aria-label="Progresso do curso" aria-valuemin="0" aria-valuemax="100"><i></i></div><span id="pt"></span></div></div>
      <div class="busca"><label class="so" for="q">Buscar aula</label><input id="q" type="search" placeholder="Buscar aula"></div><nav id="nav" aria-label="Aulas do curso"></nav></aside><main class="cont" id="aula"></main>`;
    const nx = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    function desenhar() {
      const pct = Math.round(100 * feitas.length / aulas.length);
      $("#pb").setAttribute("aria-valuenow", pct); $("#pb i").style.width = pct + "%"; $("#pt").textContent = pct + "%";
      $("#nav").innerHTML = c.modulos.map(m => {
        const ls = m.aulas.map((a, i) => ({ ...a, num: `${m.ordem}.${i + 1}` })).filter(a => nx(a.titulo).includes(nx(termo)));
        return `<h2 class="mod">${m.ordem}. ${esc(m.titulo)}</h2><ul>${ls.map(a => `<li><button type="button" class="lic" data-id="${a.id}" ${a.id === atual ? 'aria-current="true"' : ""}><span aria-hidden="true">${feitas.includes(a.id) ? "✔" : a.id === atual ? "▶" : "○"}</span>${a.num} ${esc(a.titulo)}${feitas.includes(a.id) ? '<span class="so"> (concluída)</span>' : ""}</button></li>`).join("")}</ul>`;
      }).join("");
      const a = aulas.find(x => x.id === atual), fez = feitas.includes(a.id), i = aulas.indexOf(a);
      $("#aula").innerHTML = `<img src="/img/banner-ava.jpg" alt=""><h2>${a.num} ${esc(a.titulo)}</h2><p>${esc(a.conteudo)}</p>
        <button type="button" class="btn dark" id="ok">${fez ? "Desmarcar como concluída" : "Marcar como concluída"}</button>
        ${aulas[i + 1] ? ' <button type="button" class="btn out" id="prox">Próxima aula →</button>' : ""}`;
      $("#ok").onclick = () => { feitas = fez ? feitas.filter(x => x !== a.id) : [...feitas, a.id]; try { localStorage.setItem(key, JSON.stringify(feitas)); } catch { } desenhar(); };
      if ($("#prox")) $("#prox").onclick = () => { atual = aulas[i + 1].id; desenhar(); };
    }
    $("#nav").onclick = e => { const b = e.target.closest(".lic"); if (b) { atual = +b.dataset.id; desenhar(); } };
    $("#q").oninput = e => { termo = e.target.value; desenhar(); };
    desenhar();
  } catch { el.innerHTML = '<div class="wrap">' + ERRO + "</div>"; $("#tentar").onclick = ava; }
}
layout();
({ home, catalogo, curso, ava })[document.body.dataset.page]?.();
