document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("assistant-toggle");
  let panel = document.getElementById("assistant-panel");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "assistant-panel";
    panel.innerHTML = `
      <div class="assistant-header">
        <h3 id="assistant-title">✨ Помічник</h3>
        <button id="assistant-close">✖</button>
      </div>
      <div class="assistant-tabs">
        <button class="tab-btn active" data-tab="notes" id="assistant-tab-notes">📝 Нотатки</button>
        <button class="tab-btn" data-tab="todo" id="assistant-tab-todo">✅ Список</button>
        <button class="tab-btn" data-tab="shortcuts" id="assistant-tab-shortcuts">🔗 Посилання</button>
        <button class="tab-btn" data-tab="snippets" id="assistant-tab-snippets">💻 Код</button>
      </div>
      <div class="assistant-content">
        <div class="tab-content active" id="notes">
          <textarea id="notes-area" placeholder="Пиши свої ідеї тут..."></textarea>
        </div>
        <div class="tab-content" id="todo">
          <div class="todo-input">
            <input id="todo-input" type="text" placeholder="Додати завдання..." />
            <button id="todo-add">+</button>
          </div>
          <ul id="todo-list"></ul>
        </div>
        <div class="tab-content" id="shortcuts">
          <ul class="link-list">
            <b data-trans="mainForDevelop" >Основні ресурси для розробників:</b>
            <li><a href="https://github.com/" target="_blank">GitHub</a></li>
            <li><a href="https://gitlab.com/" target="_blank">GitLab</a></li>
            <li><a href="https://bitbucket.org/" target="_blank">Bitbucket</a></li>
            <li><a href="https://gitea.com/" target="_blank">Gitea</a></li>
            <li><a href="https://www.gitkraken.com/" target="_blank">GitKraken</a></li>
            <li><a href="https://www.gitpod.io/" target="_blank">Gitpod</a></li>
            <div><hr>
            <b>AI</b></div> 
            <li><a href="https://chat.openai.com/" target="_blank">ChatGPT</a></li>
            <li><a href="https://gemini.google.com/app" target="_blank">Gemini</a></li>
            <li><a href="https://deepai.org/" target="_blank">DeepAI</a></li>
            <li><a href="https://www.deepseek.com/" target="_blank">DeepSeek</a></li>
            <li><a href="https://bard.google.com/" target="_blank">Bard</a></li>
            <li><a href="https://www.perplexity.ai/" target="_blank">Perplexity AI</a></li>
            <li><a href="https://www.midjourney.com/" target="_blank">MidJourney</a></li>
            <li><a href="https://runwayml.com/" target="_blank">Runway</a></li>
            <div><hr>
            <b data-trans="development">Розробка</b></div>
            <li><a href="https://stackoverflow.com/" target="_blank">Stack Overflow</a></li>
            <li><a href="https://developer.mozilla.org/" target="_blank">MDN Web Docs</a></li>
            <li><a href="https://css-tricks.com/" target="_blank">CSS-Tricks</a></li>
            <li><a href="https://w3schools.com/" target="_blank">W3Schools</a></li>
            <div><hr>
            
            <b data-trans="tools">Інструменти</b></div>
            <li><a href="https://codepen.io/" target="_blank">CodePen</a></li>
            <li><a href="https://jsfiddle.net/" target="_blank">JSFiddle</a></li>
            <li><a href="https://replit.com/" target="_blank">Replit</a></li>
            <li><a href="https://www.canva.com/" target="_blank">Canva</a></li>
            <li><a href="https://www.figma.com/" target="_blank">Figma</a></li>
            <div><hr>
            <b data-trans="learning">Навчання</b></div>
            <li><a href="https://www.freecodecamp.org/" target="_blank">freeCodeCamp</a></li>
            <li><a href="https://www.coursera.org/" target="_blank">Coursera</a></li>
            <li><a href="https://www.udemy.com/" target="_blank">Udemy</a></li>
            <li><a href="https://www.khanacademy.org/" target="_blank">Khan Academy</a></li>
            <li><a href="https://www.codecademy.com/" target="_blank">Codecademy</a></li>
            <li><a href="https://www.datacamp.com/" target="_blank">DataCamp</a></li>
            <li><a href="https://www.khanacademy.org/" target="_blank">Khan Academy</a></li> 
            <li><a href="https://www.codewars.com/" target="_blank">Codewars</a></li>
            <li><a href="https://www.codesandbox.io/" target="_blank">CodeSandbox</a></li>
            <li><a href="https://www.hackerrank.com/" target="_blank">HackerRank</a></li>
            <li><a href="https://leetcode.com/" target="_blank">LeetCode</a></li>
          </ul>
        </div>
        <div class="tab-content" id="snippets">
          <textarea id="snippets-area" placeholder="Тут можна зберегти шматки коду..."></textarea>
        </div>
        <div>
          <hr>
          <b data-trans="assistantSafe">Все зберігається локально</b>
          <b style="float:right; font-size: 13px;">v1.0.1</b>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  }

  // toggle panel
  toggleBtn?.addEventListener("click", () => {
    panel.classList.toggle("open");
    updateAssistantTexts();
    applyAssistantTheme();
  });
  panel.querySelector("#assistant-close").addEventListener("click", () => {
    panel.classList.remove("open");
  });

  // вкладки
  const tabBtns = panel.querySelectorAll(".tab-btn");
  const tabContents = panel.querySelectorAll(".tab-content");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      panel.querySelector(`#${btn.dataset.tab}`).classList.add("active");
    });
  });

  // notes
  const notesArea = panel.querySelector("#notes-area");
  notesArea.value = localStorage.getItem("assistant-notes") || "";
  notesArea.addEventListener("input", () =>
    localStorage.setItem("assistant-notes", notesArea.value)
  );

  // snippets
  const snippetsArea = panel.querySelector("#snippets-area");
  snippetsArea.value = localStorage.getItem("assistant-snippets") || "";
  snippetsArea.addEventListener("input", () =>
    localStorage.setItem("assistant-snippets", snippetsArea.value)
  );

  // todo
  const todoInput = panel.querySelector("#todo-input");
  const todoAdd = panel.querySelector("#todo-add");
  const todoList = panel.querySelector("#todo-list");
  let todos = JSON.parse(localStorage.getItem("assistant-todo")) || [];

  function renderTodos() {
    todoList.innerHTML = "";
    todos.forEach((t, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="${t.done ? "done" : ""}">${t.text}</span>
        <div class="todo-actions">
          <button data-action="toggle" data-i="${i}">✔</button>
          <button data-action="delete" data-i="${i}">✖</button>
        </div>
      `;
      todoList.appendChild(li);
    });
    localStorage.setItem("assistant-todo", JSON.stringify(todos));
  }
  renderTodos();

  todoAdd.addEventListener("click", () => {
    if (todoInput.value.trim()) {
      todos.push({ text: todoInput.value.trim(), done: false });
      todoInput.value = "";
      renderTodos();
    }
  });

  todoList.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
      const i = e.target.dataset.i;
      if (e.target.dataset.action === "toggle") {
        todos[i].done = !todos[i].done;
      } else if (e.target.dataset.action === "delete") {
        todos.splice(i, 1);
      }
      renderTodos();
    }
  });

  // language support
  function updateAssistantTexts() {
    const lang = localStorage.getItem("selectedLanguage") || "en";
    const t = (window.translations && window.translations[lang]) || {};

    panel.querySelector("#assistant-title").textContent = t.assistantTitle || "Assistant";
    panel.querySelector("#assistant-close").textContent = t.assistantClose || "✖";

    panel.querySelector("#assistant-tab-notes").textContent = "📝 " + (t.assistantNotes || "Notes");
    panel.querySelector("#assistant-tab-todo").textContent = "✅ " + (t.assistantTodos || "To-Do");
    panel.querySelector("#assistant-tab-shortcuts").textContent = "🔗 " + (t.assistantShortcuts || "Shortcuts");
    panel.querySelector("#assistant-tab-snippets").textContent = "💻 " + (t.assistantSnippets || "Snippets");

    notesArea.placeholder = t.assistantNotesPlaceholder || "Write your notes...";
    snippetsArea.placeholder = t.assistantSnippetsPlaceholder || "Save your code snippets...";
    todoInput.placeholder = t.assistantTodosPlaceholder || "Add a task...";
  }

  // dark mode ( IN PROGRESS, NOT PERFECT )
  function applyAssistantTheme() {
    const dark = localStorage.getItem("darkModeEnabled") === "true";
    if (dark) {
      panel.classList.add("assistant-dark");
    } else {
      panel.classList.remove("assistant-dark");
    }
  }


  document.addEventListener("languageChanged", updateAssistantTexts);
  document.addEventListener("themeChanged", applyAssistantTheme);
});
