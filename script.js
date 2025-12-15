// ===== Funcionalidad en JS =====
const $ = (sel) => document.querySelector(sel);
const listEl = $("#task-list");
const inputEl = $("#task-input");
const formEl = $("#task-form");
const clearDoneBtn = $("#clear-done");
const clearAllBtn = $("#clear-all");
const STORAGE_KEY = "planificador:tareas";

let tasks = [];

// Cargar desde localStorage
function load() {
  try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { tasks = []; }
  render();
}

// Guardar
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Renderizar lista
function render() {
  listEl.innerHTML = "";
  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "item";
    empty.innerHTML = '<span class="label" style="grid-column: 1 / -1; text-align:center; color:#6b7280">Sin tareas. Añade la primera ✨</span>';
    listEl.appendChild(empty);
    return;
  }
  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");
    li.innerHTML = \`
      <input type="checkbox" \${t.done ? "checked" : ""} data-i="\${i}" class="toggle">
      <span class="label">\${t.text}</span>
      <button class="delete" title="Eliminar" data-i="\${i}">🗑️</button>
    \`;
    listEl.appendChild(li);
  });
}

// Añadir
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  inputEl.value = "";
  save(); render();
});

// Delegación: toggle/eliminar
listEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggle")) {
    const i = +e.target.dataset.i;
    tasks[i].done = e.target.checked;
    save(); render();
  }
  if (e.target.classList.contains("delete")) {
    const i = +e.target.dataset.i;
    tasks.splice(i, 1);
    save(); render();
  }
});

// Acciones
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  save(); render();
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("¿Vaciar todas las tareas?")) {
    tasks = [];
    save(); render();
  }
});

// Init
document.addEventListener("DOMContentLoaded", load);
