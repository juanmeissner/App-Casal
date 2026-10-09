const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const bank = JSON.parse(fs.readFileSync(path.join(root, "perguntas.json"), "utf8"));
assert.equal(bank.length, 1051);
assert.equal(new Set(bank.map((item) => item.Pergunta)).size, 1051);
assert.equal(new Set(bank.map((item) => item.Categoria)).size, 11);
assert.equal(bank.filter((item) => item.Categoria === "Universo Geek, Super-heróis e Quadrinhos").length, 51);
assert.deepEqual(bank.map((item) => item["Número"]), Array.from({ length: 1051 }, (_, index) => index + 1));

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
assert.equal(ui.count.textContent, "500 / 1.051");
assert.equal(ui.number.textContent, `PERGUNTA ${progress.current} DE 1.051`);
for (let i = 0; i < 551; i += 1) ui.draw.click();
progress = JSON.parse(saved.get("entre-nos-progress-v1"));
assert.equal(progress.used.length, 1051);
assert.equal(new Set(progress.used).size, 1051);
assert.equal(ui.draw.disabled, true);
assert.equal(ui.progressbar["aria-valuemax"], "1051");
assert.equal(ui.progressbar["aria-valuenow"], "1051");

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
assert.equal(ui.count.textContent, "1.000 / 1.051");
assert.equal(ui.remaining.textContent, "51 perguntas disponíveis");
for (let i = 0; i < 51; i += 1) ui.draw.click();
progress = JSON.parse(saved.get("entre-nos-progress-v1"));
assert.equal(progress.used.length, 1051);
assert.deepEqual(progress.used.slice(1000).sort((a, b) => a - b), Array.from({ length: 51 }, (_, index) => index + 1001));
console.log("OK: 1.051 perguntas únicas; sorteio sem repetição; progresso antigo preservado; retomada e reinício.");
