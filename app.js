import { DIAS, SECOES } from "./data.js";
import * as nuvem from "./firebase.js";

const $ = sel => document.querySelector(sel);
const CHAVE = "biblia-em-um-ano:v1";
const CHAVE_NOTAS = "biblia-em-um-ano:notas";
const CHAVE_TEMA = "biblia-em-um-ano:tema";

/* ============================================================
   Estado
   ============================================================ */
let estado = lerLocal();           // { v, lidos, inicio }: o que você já leu
let notasLocais = lerNotasLocais(); // notas guardadas só neste aparelho
let salvoOk = true;

let usuario = null;                // pessoa logada no Google
let grupoId = null;
let grupo = null;
let membros = [];                  // progresso de todo mundo do grupo
let notasNuvem = [];
let paradores = [];                // funções para parar de ouvir o Firebase
let primeiraLeitura = true;
let envioPendente = false;
let timerEnvio;

const nuvemAtiva = () => Boolean(usuario && grupoId);

/* ----- Leitura e validação do que está salvo ----- */
function validarLidos(lidos) {
  const limpo = {};
  for (const [dia, mask] of Object.entries(lidos || {})) {
    const d = DIAS[Number(dia) - 1];
    if (d && Number.isInteger(mask) && mask > 0) limpo[dia] = mask & d.cheio;
  }
  return limpo;
}

function validar(obj) {
  if (!obj || obj.v !== 1 || typeof obj.lidos !== "object" || !obj.lidos) return null;
  const inicio = typeof obj.inicio === "string" && /^\d{4}-\d{2}-\d{2}$/.test(obj.inicio) ? obj.inicio : null;
  return { v: 1, lidos: validarLidos(obj.lidos), inicio };
}

function lerLocal() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return (bruto && validar(JSON.parse(bruto))) || { v: 1, lidos: {}, inicio: null };
  } catch (e) {
    salvoOk = false;
    return { v: 1, lidos: {}, inicio: null };
  }
}

function lerNotasLocais() {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_NOTAS) || "[]");
    return Array.isArray(lista) ? lista : [];
  } catch (e) {
    return [];
  }
}

function salvarLocal() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
    salvoOk = true;
  } catch (e) {
    salvoOk = false;
  }
  $("#storageWarn").hidden = salvoOk;
}

function salvarNotasLocais() {
  try { localStorage.setItem(CHAVE_NOTAS, JSON.stringify(notasLocais)); } catch (e) { /* sem espaço: segue sem salvar */ }
}

const mascara = n => estado.lidos[n] || 0;
const diaConcluido = n => mascara(n) === DIAS[n - 1].cheio;
const diasConcluidosDe = lidos => DIAS.filter(d => (lidos[d.n] || 0) === d.cheio).length;

/* ----- Enviar progresso para a nuvem ----- */
function salvarProgresso() {
  salvarLocal();
  if (!nuvemAtiva()) return;
  envioPendente = true;
  clearTimeout(timerEnvio);
  timerEnvio = setTimeout(enviarProgresso, 500);
}

function enviarProgresso() {
  if (!nuvemAtiva()) return;
  envioPendente = false;
  nuvem.salvarProgresso(grupoId, usuario, estado).catch(erroNuvem);
}

function erroNuvem(erro) {
  console.error(erro);
  aviso("Não foi possível sincronizar agora. Seu progresso está salvo neste aparelho.");
}

/* ============================================================
   Desenho da página
   ============================================================ */
const cartoes = {};
const raizDias = $("#days");

function htmlCartao(dia) {
  const itens = dia.leituras.map((l, i) => `
    <li class="item">
      <label class="read${l.sabedoria ? " sap" : ""}">
        <input type="checkbox" data-dia="${dia.n}" data-i="${i}">
        <span class="ref">${l.rotulo}</span>
        ${l.narrativo ? '<span class="dot" title="Livro narrativo"></span><span class="sr-only">(livro narrativo)</span>' : ""}
      </label>
      <span class="who" data-who="${dia.n}:${i}"></span>
      <button type="button" class="note-btn" data-act="note" data-dia="${dia.n}" data-i="${i}" data-nota="${dia.n}:${i}" aria-label="Notas de ${l.rotulo}">Nota</button>
    </li>`).join("");
  return `
    <article class="day" id="dia-${dia.n}" data-dia="${dia.n}">
      <div class="day-head">
        <h3>Dia ${dia.n}</h3>
        <span class="day-tag" hidden>Hoje</span>
        <button type="button" class="day-btn" data-act="day" data-dia="${dia.n}">Marcar dia</button>
      </div>
      <ul class="reads">${itens}</ul>
    </article>`;
}

const CRUZ = '<svg viewBox="0 0 20 28" aria-hidden="true"><path fill="currentColor" d="M8.4 0h3.2v9H20v3.2h-8.4V28H8.4V12.2H0V9h8.4z"/></svg>';

function montarSecoes() {
  raizDias.innerHTML = SECOES.map(s => {
    const dias = DIAS.filter(d => d.secao === s);
    return `
    <section class="era" id="${s.id}" style="--era:${s.cor}" aria-labelledby="${s.id}-t">
      <header class="era-head">
        <div class="era-mark" aria-hidden="true">${s.tipo === "era" ? s.num : CRUZ}</div>
        <h2 id="${s.id}-t">${s.nome}</h2>
        <p>${s.desc}</p>
        <div class="era-meta">
          <span>Dias ${s.de} a ${s.ate}</span>
          <span class="bar" aria-hidden="true"><i></i></span>
          <span data-prog></span>
        </div>
      </header>
      <div class="grid">${dias.map(htmlCartao).join("")}</div>
    </section>`;
  }).join("");

  raizDias.querySelectorAll(".day").forEach(el => { cartoes[el.dataset.dia] = el; });

  $("#chips").innerHTML = SECOES.map(s => `
    <a class="chip" href="#${s.id}" style="--era:${s.cor}" data-chip="${s.id}">
      <b>${s.tipo === "era" ? s.num + ". " + s.nome : s.nome.replace("Marco messiânico: Evangelho de ", "Marco: ")}</b>
      <span data-chip-prog></span>
    </a>`).join("");
}

/* ----- Rosácea de progresso ----- */
const CX = 200, CY = 200, R_IN = 82, R_OUT = 156, R_NUM = 178;
const ERAS = SECOES.filter(s => s.tipo === "era");

function ponto(raio, ang) { return [CX + raio * Math.cos(ang), CY + raio * Math.sin(ang)]; }

function setor(r0, r1, a0, a1) {
  const f = n => n.toFixed(2);
  const [x0, y0] = ponto(r1, a0), [x1, y1] = ponto(r1, a1), [x2, y2] = ponto(r0, a1), [x3, y3] = ponto(r0, a0);
  return `M${f(x0)} ${f(y0)}A${r1} ${r1} 0 0 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r0} ${r0} 0 0 0 ${f(x3)} ${f(y3)}Z`;
}

function angulosEra(i) {
  const grau = Math.PI / 180;
  return [(-90 + i * 30 + 1.6) * grau, (-90 + (i + 1) * 30 - 1.6) * grau];
}

function montarRosa() {
  const partes = ERAS.map((s, i) => {
    const [a0, a1] = angulosEra(i);
    const [tx, ty] = ponto(R_NUM, (a0 + a1) / 2);
    return `
      <a href="#${s.id}" aria-label="${s.num}. ${s.nome}">
        <path class="wedge-track" d="${setor(R_IN, R_OUT, a0, a1)}"/>
        <path class="wedge-fill" data-fill="${s.id}" fill="${s.cor}" d=""/>
        <text class="num" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}">${s.num}</text>
      </a>`;
  }).join("");
  $("#rose").innerHTML = `
    <g class="turn">
      <circle class="ring" cx="${CX}" cy="${CY}" r="${R_IN - 8}"/>
      <circle class="ring" cx="${CX}" cy="${CY}" r="${R_OUT + 8}" opacity=".45"/>
      ${partes}
    </g>
    <text class="pct" id="rosePct" x="${CX}" y="${CY + 14}">0%</text>
    <text class="pct-label" x="${CX}" y="${CY + 40}">do plano lido</text>`;
}

/* ----- Atualizar a tela conforme o progresso ----- */
function atualizarDia(n) {
  const el = cartoes[n];
  const m = mascara(n);
  const completo = diaConcluido(n);
  el.classList.toggle("done", completo);
  el.querySelectorAll("input[data-i]").forEach(cb => { cb.checked = Boolean(m & (1 << Number(cb.dataset.i))); });
  el.querySelector(".day-btn").textContent = completo ? "Desmarcar dia" : "Marcar dia";
}

function proximoDia() { return DIAS.find(d => !diaConcluido(d.n)) || null; }

function diaDeHoje() {
  if (!estado.inicio) return null;
  const [a, m, d] = estado.inicio.split("-").map(Number);
  const inicio = new Date(a, m - 1, d);
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  return Math.round((hoje - inicio) / 864e5) + 1;
}

function atualizarTudo() {
  let diasLidos = 0, leiturasLidas = 0, leiturasTotal = 0;
  const porSecao = {};
  SECOES.forEach(s => { porSecao[s.id] = { feitos: 0, total: s.ate - s.de + 1 }; });

  DIAS.forEach(d => {
    leiturasTotal += d.leituras.length;
    const m = mascara(d.n);
    for (let i = 0; i < d.leituras.length; i++) if (m & (1 << i)) leiturasLidas++;
    if (diaConcluido(d.n)) { diasLidos++; porSecao[d.secao.id].feitos++; }
  });

  SECOES.forEach(s => {
    const { feitos, total } = porSecao[s.id];
    const sec = document.getElementById(s.id);
    sec.querySelector(".bar > i").style.width = (feitos / total * 100) + "%";
    sec.querySelector("[data-prog]").textContent = `${feitos} de ${total} dias`;
    document.querySelector(`[data-chip="${s.id}"] [data-chip-prog]`).textContent = `${feitos}/${total} dias`;
  });

  ERAS.forEach((s, i) => {
    const p = porSecao[s.id].feitos / porSecao[s.id].total;
    const [a0, a1] = angulosEra(i);
    document.querySelector(`[data-fill="${s.id}"]`)
      .setAttribute("d", p > 0 ? setor(R_IN, R_IN + (R_OUT - R_IN) * p, a0, a1) : "");
  });
  $("#rosePct").textContent = Math.round(diasLidos / 365 * 100) + "%";
  $("#rose").setAttribute("aria-label", `Rosácea de progresso: ${diasLidos} de 365 dias concluídos`);

  $("#facts").innerHTML = `
    <div><dt>de 365 dias</dt><dd>${diasLidos}</dd></div>
    <div><dt>de ${leiturasTotal} leituras</dt><dd>${leiturasLidas}</dd></div>`;

  atualizarProximo(diasLidos);
  atualizarHoje();
  aplicarFiltro();
}

function atualizarProximo(diasLidos) {
  const prox = proximoDia();
  const caixa = $("#next");
  if (!prox) {
    caixa.innerHTML = `<h2>Plano concluído</h2><p class="small">Você leu a Bíblia inteira. Pode rever qualquer dia pela lista abaixo.</p>`;
    return;
  }
  const comecando = diasLidos === 0 && !Object.keys(estado.lidos).length;
  caixa.innerHTML = `
    <p class="small">${prox.secao.nome}</p>
    <h2>${comecando ? "Comece pelo dia 1" : `Continue no dia ${prox.n}`}</h2>
    <ul>${prox.leituras.map(l => `<li>${l.rotulo}</li>`).join("")}</ul>
    <div class="actions">
      <button class="btn primary" type="button" data-act="goto" data-dia="${prox.n}">Ir para o dia</button>
      <button class="btn" type="button" data-act="markNext" data-dia="${prox.n}">Marcar como lido</button>
    </div>`;
}

function atualizarHoje() {
  document.querySelectorAll(".day-tag").forEach(t => { t.hidden = true; });
  const status = $("#status");
  const hoje = diaDeHoje();
  if (hoje === null) {
    status.innerHTML = 'Quer saber se está em dia? <button class="day-btn" type="button" data-act="settings" style="margin:0;padding:0;min-height:0">Defina a data de início</button>.';
    return;
  }
  if (hoje < 1) {
    status.textContent = `O plano começa em ${estado.inicio.split("-").reverse().join("/")}.`;
    return;
  }
  const dia = Math.min(hoje, 365);
  cartoes[dia].querySelector(".day-tag").hidden = false;
  const feitos = diasConcluidosDe(estado.lidos);
  const dif = feitos - dia;
  const plural = n => `${n} ${n === 1 ? "dia" : "dias"}`;
  const situacao = dif === 0 ? "Você está em dia."
    : dif > 0 ? `Você está ${plural(dif)} adiantado.`
    : `Você está ${plural(-dif)} atrasado. Sem pressa: retome de onde parou.`;
  status.textContent = hoje > 365
    ? `O prazo de 365 dias terminou. Você concluiu ${feitos} dias.`
    : `Hoje é o dia ${dia} do seu plano. ${situacao}`;
}

function aplicarFiltro() {
  const filtro = raizDias.dataset.filter;
  let algumVisivel = false;
  SECOES.forEach(s => {
    const dias = DIAS.filter(d => d.secao === s);
    const feitos = dias.filter(d => diaConcluido(d.n)).length;
    const vazio = (filtro === "pending" && feitos === dias.length) || (filtro === "done" && feitos === 0);
    document.getElementById(s.id).classList.toggle("is-empty", vazio);
    if (!vazio) algumVisivel = true;
  });
  $("#emptyMsg").hidden = algumVisivel;
}

/* ============================================================
   Marcar leituras
   ============================================================ */
let timerAviso;
function aviso(texto) {
  const t = $("#toast");
  t.textContent = texto;
  t.classList.add("show");
  clearTimeout(timerAviso);
  timerAviso = setTimeout(() => t.classList.remove("show"), 2200);
}

function depoisDeMudar(dia, mensagem) {
  salvarProgresso();
  atualizarDia(dia);
  atualizarTudo();
  atualizarGrupoLinha();
  aviso(salvoOk ? mensagem : "Não foi possível salvar neste navegador");
}

function alternarLeitura(dia, i, marcado) {
  const m = marcado ? mascara(dia) | (1 << i) : mascara(dia) & ~(1 << i);
  if (m) estado.lidos[dia] = m; else delete estado.lidos[dia];
  depoisDeMudar(dia, diaConcluido(dia) ? `Dia ${dia} concluído` : "Progresso salvo");
}

function alternarDia(dia) {
  if (diaConcluido(dia)) delete estado.lidos[dia];
  else estado.lidos[dia] = DIAS[dia - 1].cheio;
  depoisDeMudar(dia, diaConcluido(dia) ? `Dia ${dia} concluído` : `Dia ${dia} desmarcado`);
}

// Troca o progresso por um novo (vindo da nuvem ou de um backup) e redesenha só o que mudou
function aplicarLidos(novo) {
  const limpo = validarLidos(novo);
  const mudados = DIAS.filter(d => (estado.lidos[d.n] || 0) !== (limpo[d.n] || 0)).map(d => d.n);
  if (!mudados.length) return false;
  estado.lidos = limpo;
  salvarLocal();
  mudados.forEach(atualizarDia);
  atualizarTudo();
  return true;
}

function unirLidos(a, b) {
  const uniao = {};
  for (const dia of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) {
    uniao[dia] = (a[dia] || 0) | (b[dia] || 0);
  }
  return validarLidos(uniao);
}

const reduzMovimento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function irParaDia(dia) {
  if (cartoes[dia].offsetParent === null) definirFiltro("all");
  const el = cartoes[dia];
  el.scrollIntoView({ behavior: reduzMovimento() ? "auto" : "smooth", block: "center" });
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

function irParaHoje() {
  const hoje = diaDeHoje();
  if (hoje && hoje >= 1) return irParaDia(Math.min(hoje, 365));
  const prox = proximoDia();
  irParaDia(prox ? prox.n : 365);
}

function definirFiltro(filtro) {
  raizDias.dataset.filter = filtro;
  document.querySelectorAll("button[data-filter]").forEach(b => {
    b.setAttribute("aria-pressed", String(b.dataset.filter === filtro));
  });
  aplicarFiltro();
}

/* ============================================================
   Conta Google e grupo
   ============================================================ */
function primeiroNome(nome) { return (nome || "Alguém").split(" ")[0]; }

function nomeDe(uid, reserva) {
  const m = membros.find(x => x.uid === uid);
  return (m && m.nome) || reserva || "Alguém";
}

function corDe(uid) {
  let soma = 0;
  for (const c of uid) soma = (soma * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${soma} 38% 40%)`;
}

function pararDeOuvir() {
  paradores.forEach(parar => parar());
  paradores = [];
}

function conectarGrupo(id) {
  pararDeOuvir();
  grupoId = id;
  grupo = null;
  membros = [];
  notasNuvem = [];
  primeiraLeitura = true;
  paradores = [
    nuvem.observarGrupo(id, g => { grupo = g; renderGrupo(); }, erroNuvem),
    nuvem.observarMembros(id, lista => { membros = lista; aoMudarMembros(); }, erroNuvem),
    nuvem.observarNotas(id, lista => { notasNuvem = lista; aoMudarNotas(); }, erroNuvem)
  ];
}

function desconectar() {
  pararDeOuvir();
  grupoId = null;
  grupo = null;
  membros = [];
  notasNuvem = [];
  atualizarOutros();
  atualizarContagemNotas();
  atualizarGrupoLinha();
}

function aoMudarMembros() {
  const meu = membros.find(m => m.uid === usuario.uid);

  if (primeiraLeitura) {
    primeiraLeitura = false;
    // Une o que já estava neste aparelho com o que já estava na nuvem, sem perder nada
    const unido = unirLidos(meu ? meu.lidos : {}, estado.lidos);
    aplicarLidos(unido);
    if (!estado.inicio && meu && meu.inicio) { estado.inicio = meu.inicio; salvarLocal(); atualizarHoje(); }
    const nuvemDesatualizada = !meu || JSON.stringify(validarLidos(meu.lidos)) !== JSON.stringify(estado.lidos);
    if (nuvemDesatualizada) enviarProgresso();
    enviarNotasLocais();
  } else if (meu && !meu.pendente && !envioPendente) {
    // Mudança feita em outro aparelho
    aplicarLidos(meu.lidos);
  }

  atualizarOutros();
  renderMembros();
  atualizarGrupoLinha();
}

function emblema(membro) {
  const el = document.createElement("i");
  el.textContent = (membro.nome || "?").trim().charAt(0).toUpperCase();
  el.title = `${primeiroNome(membro.nome)} já leu`;
  el.style.background = corDe(membro.uid);
  return el;
}

// Mostra, em cada passagem, quem mais do grupo já leu
function atualizarOutros() {
  const outros = membros.filter(m => !usuario || m.uid !== usuario.uid);
  document.querySelectorAll("[data-who]").forEach(el => {
    const [dia, i] = el.dataset.who.split(":").map(Number);
    const leram = outros.filter(m => ((m.lidos && m.lidos[dia]) || 0) & (1 << i));
    el.replaceChildren(...leram.map(emblema));
  });
}

function atualizarGrupoLinha() {
  const linha = $("#groupLine");
  if (!nuvemAtiva() || membros.length < 2) { linha.hidden = true; return; }
  const partes = membros.map(m => {
    const lidos = m.uid === usuario.uid ? estado.lidos : validarLidos(m.lidos);
    const nome = m.uid === usuario.uid ? "Você" : primeiroNome(m.nome);
    return `${nome}: ${diasConcluidosDe(lidos)} dias`;
  });
  linha.textContent = `No grupo, ${partes.join(", ")}.`;
  linha.hidden = false;
}

function atualizarConta() {
  const caixa = $("#cloudLine");
  if (!nuvem.disponivel) { caixa.hidden = true; return; }
  caixa.hidden = false;
  if (!usuario) {
    caixa.innerHTML = `
      <button class="btn primary" type="button" data-act="login">Entrar com Google</button>
      <span>Salve na nuvem e compartilhe o progresso e as notas com seu grupo.</span>`;
  } else {
    caixa.innerHTML = `<span>Conectado como ${primeiroNome(usuario.displayName)}. Seu progresso é salvo na nuvem.</span>`;
  }
}

async function entrarComGoogle() {
  try {
    await nuvem.entrarComGoogle();
  } catch (erro) {
    if (erro.code !== "auth/popup-closed-by-user" && erro.code !== "auth/cancelled-popup-request") {
      console.error(erro);
      aviso("Não foi possível entrar com o Google. Tente de novo.");
    }
  }
}


/* ----- Janela do grupo ----- */
const dlgGrupo = $("#groupDialog");

function renderGrupo() {
  const corpo = $("#groupBody");
  if (!corpo || !dlgGrupo.open) return;
  const msgAtual = $("#groupMsg") ? $("#groupMsg").textContent : "";

  if (!nuvem.disponivel) {
    corpo.innerHTML = `<p>A sincronização ainda não foi configurada. Siga o passo a passo do arquivo README para ligar o Firebase. Enquanto isso, tudo fica salvo só neste aparelho.</p>`;
    return;
  }
  if (!usuario) {
    corpo.innerHTML = `
      <p>Entre com sua conta Google para salvar na nuvem e criar um grupo de leitura. Quem entra no grupo vê o progresso dos outros e as notas de cada passagem.</p>
      <div class="row"><button class="btn primary" type="button" data-act="login">Entrar com Google</button></div>`;
    return;
  }
  corpo.innerHTML = `
    <section>
      <h3>${grupo ? grupo.nome : "Seu grupo"}</h3>
      <p>Para convidar alguém, envie este código. A pessoa entra com a conta Google dela e digita o código em Entrar em um grupo.</p>
      <div class="row"><b class="codigo" id="groupCode">${grupoId || ""}</b>
      <button class="btn" type="button" data-act="copyCode">Copiar código</button></div>
      <ul class="membros" id="membersList"></ul>
    </section>
    <section>
      <h3>Entrar em um grupo</h3>
      <label for="joinCode">Código do grupo</label>
      <input type="text" id="joinCode" autocomplete="off" autocapitalize="characters" maxlength="12">
      <div class="row"><button class="btn" type="button" data-act="join">Entrar no grupo</button></div>
      <p>Seu progresso atual vai junto para o novo grupo.</p>
    </section>
    <section>
      <p id="groupMsg" role="status">${msgAtual}</p>
      <div class="row"><button class="btn" type="button" data-act="logout">Sair da conta</button></div>
    </section>`;
  renderMembros();
}

function renderMembros() {
  const lista = $("#membersList");
  if (!lista) return;
  lista.replaceChildren(...membros.map(m => {
    const li = document.createElement("li");
    const eu = m.uid === usuario.uid;
    const lidos = eu ? estado.lidos : validarLidos(m.lidos);
    li.append(emblema(m));
    const texto = document.createElement("span");
    texto.textContent = `${eu ? "Você" : (m.nome || "Alguém")}: ${diasConcluidosDe(lidos)} de 365 dias`;
    li.append(texto);
    return li;
  }));
}

function mensagemGrupo(texto) {
  const el = $("#groupMsg");
  if (el) el.textContent = texto;
}

async function entrarEmGrupo() {
  const codigo = $("#joinCode").value.trim();
  if (!codigo) return mensagemGrupo("Digite o código do grupo.");
  try {
    const id = await nuvem.entrarNoGrupo(usuario, codigo);
    conectarGrupo(id);
    mensagemGrupo("Você entrou no grupo.");
  } catch (erro) {
    mensagemGrupo(erro.message === "grupo-inexistente"
      ? "Código não encontrado. Confira as letras e os números."
      : "Não foi possível entrar agora. Tente de novo.");
  }
}

async function copiarCodigo() {
  try {
    await navigator.clipboard.writeText(grupoId);
    mensagemGrupo("Código copiado.");
  } catch (e) {
    mensagemGrupo(`Seu código é ${grupoId}.`);
  }
}

/* ============================================================
   Notas
   ============================================================ */
const dlgNotas = $("#notesDialog");
let notaAberta = null;   // { dia, i }
let notaEmEdicao = null; // id da nota que está sendo editada

const todasNotas = () => (nuvemAtiva() ? notasNuvem : notasLocais);
const meuId = () => (nuvemAtiva() ? usuario.uid : "local");

function aoMudarNotas() {
  atualizarContagemNotas();
  if (dlgNotas.open) renderNotas();
}

function atualizarContagemNotas() {
  const contagem = {};
  todasNotas().forEach(n => { const k = `${n.dia}:${n.i}`; contagem[k] = (contagem[k] || 0) + 1; });
  document.querySelectorAll("[data-nota]").forEach(btn => {
    const total = contagem[btn.dataset.nota] || 0;
    btn.textContent = total ? `${total} ${total === 1 ? "nota" : "notas"}` : "Nota";
    btn.classList.toggle("has-notes", total > 0);
  });
}

function abrirNotas(dia, i) {
  notaAberta = { dia, i };
  notaEmEdicao = null;
  $("#notesTitle").textContent = `Dia ${dia}`;
  $("#notesRef").textContent = DIAS[dia - 1].leituras[i].rotulo;
  $("#noteField").value = "";
  $("#noteSaveBtn").textContent = "Salvar nota";
  $("#noteCancelBtn").hidden = true;
  renderNotas();
  dlgNotas.showModal();
}

function renderNotas() {
  if (!notaAberta) return;
  const lista = todasNotas().filter(n => n.dia === notaAberta.dia && n.i === notaAberta.i);
  const alvo = $("#notesList");
  if (!lista.length) {
    alvo.innerHTML = '<li class="vazio">Ainda não há notas aqui. Escreva o que esta passagem despertou em você.</li>';
    return;
  }
  alvo.replaceChildren(...lista.map(n => {
    const li = document.createElement("li");
    li.className = "nota";
    const meta = document.createElement("p");
    meta.className = "nota-meta";
    const quando = new Date(n.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    meta.textContent = `${n.autorId === meuId() ? "Você" : nomeDe(n.autorId, n.autorNome)}, ${quando}`;
    const texto = document.createElement("p");
    texto.className = "nota-texto";
    texto.textContent = n.texto;
    li.append(meta, texto);
    if (n.autorId === meuId()) {
      const linha = document.createElement("div");
      linha.className = "row";
      linha.innerHTML = `
        <button type="button" class="day-btn" data-act="noteEdit" data-id="${n.id}">Editar</button>
        <button type="button" class="day-btn" data-act="noteDel" data-id="${n.id}">Apagar</button>`;
      li.append(linha);
    }
    return li;
  }));
}

async function salvarNota() {
  const campo = $("#noteField");
  const texto = campo.value.trim();
  if (!texto || !notaAberta) return;
  try {
    if (nuvemAtiva()) {
      if (notaEmEdicao) await nuvem.editarNota(grupoId, notaEmEdicao, texto);
      else await nuvem.criarNota(grupoId, { ...notaAberta, texto, autorId: usuario.uid, autorNome: usuario.displayName || "Alguém" });
    } else if (notaEmEdicao) {
      const nota = notasLocais.find(n => n.id === notaEmEdicao);
      if (nota) nota.texto = texto;
    } else {
      notasLocais.push({ id: "n" + Date.now(), ...notaAberta, texto, autorId: "local", autorNome: "Você", criadoEm: Date.now() });
    }
    if (!nuvemAtiva()) { salvarNotasLocais(); aoMudarNotas(); }
    campo.value = "";
    notaEmEdicao = null;
    $("#noteSaveBtn").textContent = "Salvar nota";
    $("#noteCancelBtn").hidden = true;
    aviso("Nota salva");
  } catch (erro) {
    erroNuvem(erro);
  }
}

function editarNota(id) {
  const nota = todasNotas().find(n => n.id === id);
  if (!nota) return;
  notaEmEdicao = id;
  $("#noteField").value = nota.texto;
  $("#noteField").focus();
  $("#noteSaveBtn").textContent = "Atualizar nota";
  $("#noteCancelBtn").hidden = false;
}

function cancelarEdicao() {
  notaEmEdicao = null;
  $("#noteField").value = "";
  $("#noteSaveBtn").textContent = "Salvar nota";
  $("#noteCancelBtn").hidden = true;
}

async function apagarNota(botao) {
  if (botao.dataset.confirma !== "1") {
    botao.dataset.confirma = "1";
    botao.textContent = "Confirmar";
    setTimeout(() => { botao.dataset.confirma = ""; botao.textContent = "Apagar"; }, 3000);
    return;
  }
  try {
    if (nuvemAtiva()) await nuvem.apagarNota(grupoId, botao.dataset.id);
    else { notasLocais = notasLocais.filter(n => n.id !== botao.dataset.id); salvarNotasLocais(); aoMudarNotas(); }
  } catch (erro) {
    erroNuvem(erro);
  }
}

// Notas escritas antes do login sobem para o grupo uma única vez
async function enviarNotasLocais() {
  if (!notasLocais.length) return;
  const pendentes = notasLocais;
  try {
    for (const n of pendentes) {
      await nuvem.criarNota(grupoId, { dia: n.dia, i: n.i, texto: n.texto, autorId: usuario.uid, autorNome: usuario.displayName || "Alguém" });
    }
    notasLocais = [];
    salvarNotasLocais();
  } catch (erro) {
    erroNuvem(erro);
  }
}

/* ============================================================
   Tema, ajustes e backup
   ============================================================ */
function temaAtual() {
  return document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function alternarTema() {
  const novo = temaAtual() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = novo;
  try { localStorage.setItem(CHAVE_TEMA, novo); } catch (e) { /* tema só vale nesta visita */ }
}

try {
  const t = localStorage.getItem(CHAVE_TEMA);
  if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
} catch (e) { /* segue com o tema do sistema */ }

const dlgAjustes = $("#settings");
const campoBackup = $("#backup");
const msgBackup = $("#backupMsg");

function abrirAjustes() {
  $("#startDate").value = estado.inicio || "";
  campoBackup.value = JSON.stringify(estado);
  msgBackup.textContent = "";
  $("#resetBtn").textContent = "Apagar progresso";
  dlgAjustes.showModal();
}

async function copiarBackup() {
  campoBackup.value = JSON.stringify(estado);
  try {
    await navigator.clipboard.writeText(campoBackup.value);
    msgBackup.textContent = "Backup copiado.";
  } catch (e) {
    campoBackup.select();
    msgBackup.textContent = "Selecione o texto acima e copie manualmente.";
  }
}

function salvarArquivo() {
  const arquivo = new Blob([JSON.stringify(estado, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "biblia-em-um-ano-progresso.json";
  link.click();
  URL.revokeObjectURL(link.href);
  msgBackup.textContent = "Arquivo salvo.";
}

function restaurarBackup() {
  try {
    const novo = validar(JSON.parse(campoBackup.value));
    if (!novo) throw new Error("formato");
    estado.inicio = novo.inicio;
    aplicarLidos(novo.lidos);
    salvarProgresso();
    atualizarTudo();
    $("#startDate").value = estado.inicio || "";
    msgBackup.textContent = "Progresso restaurado.";
  } catch (e) {
    msgBackup.textContent = "O texto não é um backup válido.";
  }
}

function apagarProgresso() {
  const botao = $("#resetBtn");
  if (botao.dataset.confirma !== "1") {
    botao.dataset.confirma = "1";
    botao.textContent = "Toque de novo para apagar tudo";
    setTimeout(() => { botao.dataset.confirma = ""; botao.textContent = "Apagar progresso"; }, 4000);
    return;
  }
  botao.dataset.confirma = "";
  botao.textContent = "Apagar progresso";
  const antigos = Object.keys(estado.lidos);
  estado.lidos = {};
  antigos.forEach(d => atualizarDia(Number(d)));
  salvarProgresso();
  atualizarTudo();
  atualizarGrupoLinha();
  campoBackup.value = JSON.stringify(estado);
  msgBackup.textContent = "Progresso apagado.";
}

/* ============================================================
   Eventos
   ============================================================ */
document.addEventListener("change", e => {
  const cb = e.target.closest("input[data-i]");
  if (cb) alternarLeitura(Number(cb.dataset.dia), Number(cb.dataset.i), cb.checked);

  if (e.target.id === "startDate") {
    estado.inicio = e.target.value || null;
    salvarProgresso();
    atualizarHoje();
    campoBackup.value = JSON.stringify(estado);
  }
});

document.addEventListener("click", e => {
  const filtro = e.target.closest("button[data-filter]");
  if (filtro) return definirFiltro(filtro.dataset.filter);

  const fechar = e.target.closest("[data-close]");
  if (fechar) return fechar.closest("dialog").close();

  const alvo = e.target.closest("[data-act]");
  if (!alvo) return;
  const dia = Number(alvo.dataset.dia);

  const acoes = {
    day: () => alternarDia(dia),
    goto: () => irParaDia(dia),
    markNext: () => alternarDia(dia),
    today: irParaHoje,
    theme: alternarTema,
    settings: abrirAjustes,
    group: () => { dlgGrupo.showModal(); renderGrupo(); },
    login: entrarComGoogle,
    logout: () => nuvem.sair(),
    join: entrarEmGrupo,
    copyCode: copiarCodigo,
    note: () => abrirNotas(dia, Number(alvo.dataset.i)),
    noteSave: salvarNota,
    noteCancel: cancelarEdicao,
    noteEdit: () => editarNota(alvo.dataset.id),
    noteDel: () => apagarNota(alvo),
    copy: copiarBackup,
    saveFile: salvarArquivo,
    restore: restaurarBackup,
    reset: apagarProgresso,
    clearStart: () => {
      estado.inicio = null;
      $("#startDate").value = "";
      salvarProgresso();
      atualizarHoje();
    }
  };
  if (acoes[alvo.dataset.act]) acoes[alvo.dataset.act]();
});

[dlgGrupo, dlgNotas, dlgAjustes].forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));

/* ============================================================
   Início
   ============================================================ */
montarSecoes();
montarRosa();
DIAS.forEach(d => atualizarDia(d.n));
atualizarTudo();
atualizarContagemNotas();
atualizarConta();
$("#storageWarn").hidden = salvoOk;

// Só depois de tudo montado começamos a ouvir o login
nuvem.aoMudarLogin(async pessoa => {
  usuario = pessoa;
  if (!pessoa) {
    desconectar();
    atualizarConta();
    renderGrupo();
    return;
  }
  atualizarConta();
  try {
    conectarGrupo(await nuvem.garantirGrupo(pessoa));
  } catch (erro) {
    erroNuvem(erro);
  }
  renderGrupo();
});
