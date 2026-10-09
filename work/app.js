(() => {
  "use strict";

  const storageKey = "entre-nos-progress-v1";
  const questions = Array.isArray(window.CASAL_QUESTIONS) ? window.CASAL_QUESTIONS : [];
  const byId = new Map(questions.map((question) => [question["Número"], question]));
  const elements = {
    reset: document.querySelector("#reset"),
    draw: document.querySelector("#draw"),
    category: document.querySelector("#category"),
    difficulty: document.querySelector("#difficulty"),
    number: document.querySelector("#number"),
    question: document.querySelector("#question"),
    remaining: document.querySelector("#remaining"),
    count: document.querySelector("#count"),
    progressbar: document.querySelector("#progressbar"),
    fill: document.querySelector("#fill"),
  };

  if (questions.length < 1000 || byId.size !== questions.length || new Set(questions.map((question) => question.Pergunta)).size !== questions.length) {
    elements.question.textContent = "Não foi possível carregar as perguntas.";
    elements.remaining.textContent = "Verifique o arquivo questions-data.js.";
    elements.draw.disabled = true;
    elements.reset.disabled = true;
    return;
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const used = Array.isArray(saved.used)
        ? [...new Set(saved.used.filter((id) => Number.isInteger(id) && byId.has(id)))]
        : [];
      const current = byId.has(saved.current) && used.includes(saved.current) ? saved.current : null;
      return { used, current };
    } catch {
      return { used: [], current: null };
    }
  }

  let state = loadProgress();
  let saveFailed = false;

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      saveFailed = false;
    } catch {
      saveFailed = true;
    }
  }

  function render() {
    const total = questions.length;
    const usedCount = state.used.length;
    const remaining = total - usedCount;
    const current = state.current === null ? null : byId.get(state.current);

    if (current) {
      elements.category.textContent = current.Categoria;
      elements.difficulty.textContent = current.Dificuldade;
      elements.number.textContent = `PERGUNTA ${current["Número"]} DE ${total.toLocaleString("pt-BR")}`;
      elements.question.textContent = current.Pergunta;
    } else {
      elements.category.textContent = "Prontos para começar?";
      elements.difficulty.textContent = "";
      elements.number.textContent = `${total.toLocaleString("pt-BR")} perguntas para vocês`;
      elements.question.textContent = "Comecem uma conversa que só vocês dois podem ter.";
    }

    elements.draw.disabled = remaining === 0;
    elements.draw.firstChild.textContent = remaining === 0 ? "Todas as perguntas sorteadas " : "Fazer uma pergunta ";
    elements.reset.disabled = usedCount === 0;
    elements.remaining.textContent = saveFailed
      ? "O navegador não conseguiu salvar o progresso. Use um servidor local para manter as perguntas sorteadas."
      : remaining === 0
        ? "Vocês chegaram ao fim. Recomeçar inicia uma nova rodada."
        : `${remaining.toLocaleString("pt-BR")} ${remaining === 1 ? "pergunta disponível" : "perguntas disponíveis"}`;
    elements.count.textContent = `${usedCount.toLocaleString("pt-BR")} / ${total.toLocaleString("pt-BR")}`;
    elements.progressbar.setAttribute("aria-valuemax", String(total));
    elements.progressbar.setAttribute("aria-valuenow", String(usedCount));
    elements.fill.style.width = `${(usedCount / total) * 100}%`;
  }

  elements.draw.addEventListener("click", () => {
    const used = new Set(state.used);
    const available = questions.filter((question) => !used.has(question["Número"]));
    if (available.length === 0) return;
    const picked = available[Math.floor(Math.random() * available.length)];
    state = { used: [...state.used, picked["Número"]], current: picked["Número"] };
    persist();
    render();
  });

  elements.reset.addEventListener("click", () => {
    if (state.used.length === 0) return;
    if (!window.confirm("Recomeçar? As perguntas sorteadas voltarão ao jogo.")) return;
    state = { used: [], current: null };
    persist();
    render();
  });

  render();
})();
