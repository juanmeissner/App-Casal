const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const bank = JSON.parse(fs.readFileSync(path.join(root, "perguntas.json"), "utf8"));
const total = 1371;
const newCategories = [
  "Viagens e aventuras",
  "Cozinha a dois",
  "Casa e convivência",
  "Vida digital",
  "Celebrações e tradições",
  "Criatividade em dupla",
  "Natureza e animais",
  "Bem-estar e autocuidado",
];
assert.equal(bank.length, total);
assert.equal(new Set(bank.map((item) => item.Pergunta)).size, total);
assert.equal(new Set(bank.map((item) => item.Pergunta.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())).size, total);
assert.equal(new Set(bank.map((item) => item.Categoria)).size, 19);
assert.equal(bank.filter((item) => item.Categoria === "Universo Geek, Super-heróis e Quadrinhos").length, 51);
for (const category of newCategories) {
  assert.equal(bank.filter((item) => item.Categoria === category).length, 40);
}
assert.deepEqual(new Set(bank.map((item) => item.Dificuldade)), new Set(["Fácil", "Média", "Difícil", "Extrema"]));
assert.deepEqual(bank.map((item) => item["Número"]), Array.from({ length: total }, (_, index) => index + 1));
assert.equal(bank.slice(590, 600).every((item) => item.Categoria === "Situações Hipotéticas" && !/jantar com qualquer pessoa/i.test(item.Pergunta)), true);
assert.equal(bank.slice(650, 660).every((item) => item.Categoria === "Infância e Adolescência" && !/primeiro amor/i.test(item.Pergunta)), true);
assert.equal(bank[1202].Categoria, "Vida digital");
assert.doesNotMatch(bank[1202].Pergunta, /compartilhar senhas/i);

const dataContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "questions-data.js"), "utf8"), dataContext);
assert.equal(JSON.stringify(dataContext.window.CASAL_QUESTIONS), JSON.stringify(bank));

const saved = new Map();
const storage = {
  getItem: (key) => saved.get(key) ?? null,
  setItem: (key, value) => saved.set(key, value),
};
const ids = ["reset", "draw", "category", "difficulty", "number", "question", "remaining", "count", "progressbar", "fill"];
let seed = 123456789;
const random = () => {
  seed = (1664525 * seed + 1013904223) >>> 0;
  return seed / 4294967296;
};

function launch() {
  const elements = Object.fromEntries(ids.map((id) => [id, {
    textContent: "",
    firstChild: { textContent: "" },
    style: {},
    addEventListener(type, handler) { this[type] = handler; },
    setAttribute(name, value) { this[name] = value; },
  }]));
  const context = {
    window: { CASAL_QUESTIONS: bank, confirm: () => true },
    document: { querySelector: (selector) => elements[selector.slice(1)] },
    localStorage: storage,
    Math: { floor: Math.floor, random },
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), context);
  return elements;
}

let ui = launch();
for (let i = 0; i < 500; i += 1) ui.draw.click();
let progress = JSON.parse(saved.get("entre-nos-progress-v1"));
assert.equal(progress.used.length, 500);
assert.equal(new Set(progress.used).size, 500);

ui = launch();
assert.equal(ui.count.textContent, "500 / 1.371");
assert.equal(ui.number.textContent, `PERGUNTA ${progress.current} DE 1.371`);
for (let i = 0; i < total - 500; i += 1) ui.draw.click();
progress = JSON.parse(saved.get("entre-nos-progress-v1"));
assert.equal(progress.used.length, total);
assert.equal(new Set(progress.used).size, total);
assert.equal(ui.draw.disabled, true);
assert.equal(ui.progressbar["aria-valuemax"], String(total));
assert.equal(ui.progressbar["aria-valuenow"], String(total));

ui.reset.click();
progress = JSON.parse(saved.get("entre-nos-progress-v1"));
assert.equal(progress.used.length, 0);
assert.equal(progress.current, null);
assert.equal(ui.draw.disabled, false);

saved.set("entre-nos-progress-v1", JSON.stringify({
  used: Array.from({ length: 1000 }, (_, index) => index + 1),
  current: 1000,
}));
ui = launch();
assert.equal(ui.count.textContent, "1.000 / 1.371");
assert.equal(ui.remaining.textContent, "371 perguntas disponíveis");
for (let i = 0; i < 371; i += 1) ui.draw.click();
progress = JSON.parse(saved.get("entre-nos-progress-v1"));
assert.equal(progress.used.length, total);
assert.deepEqual(progress.used.slice(1000).sort((a, b) => a - b), Array.from({ length: 371 }, (_, index) => index + 1001));

saved.set("entre-nos-progress-v1", JSON.stringify({
  used: Array.from({ length: 1051 }, (_, index) => index + 1),
  current: 1051,
}));
ui = launch();
assert.equal(ui.count.textContent, "1.051 / 1.371");
assert.equal(ui.remaining.textContent, "320 perguntas disponíveis");
for (let i = 0; i < 320; i += 1) ui.draw.click();
progress = JSON.parse(saved.get("entre-nos-progress-v1"));
assert.equal(progress.used.length, total);
assert.deepEqual(progress.used.slice(1051).sort((a, b) => a - b), Array.from({ length: 320 }, (_, index) => index + 1052));
console.log("OK: 1.371 perguntas únicas em 19 categorias; sorteio sem repetição; progresso antigo preservado; retomada e reinício.");
