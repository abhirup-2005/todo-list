// trashUI.js
import {
    restoreTodo,
    getDeletedTodosByProject,
    permanentDeleteTodo,
    getNotArchivedTodos
} from "../logic/todoLogic.js";

import {
    getArchivedProjects,
    permanentDeleteProject,
    restoreProject
} from "../logic/projectLogic.js";

import { expandTemplate } from "./todoTemplates.js";
import { saveToLocalStorage } from "../storage/storage.js";
import { refreshUI } from "./appUI.js";

const trashTodos = document.querySelector("#trash-todos");
const trashProjects = document.querySelector("#trash-projects");

export function renderTrashUI() {
    trashTodos.textContent = "";
    trashProjects.textContent = "";

    // ─── Deleted Todos ─────────────────────

    const nonArchivedTodos = getNotArchivedTodos();

    nonArchivedTodos.forEach(todo => {
        const li = document.createElement("li");
        li.dataset.id = todo.id;

        const header = document.createElement("div");
        header.classList.add("thumbnail");

        const title = document.createElement("span");
        title.textContent = todo.title;

        const expandBtn = document.createElement("button");
        expandBtn.textContent = "▸";
        expandBtn.classList.add("expand-trash");

        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "Restore";
        restoreBtn.classList.add("restore-todo");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-todo");

        header.append(title, expandBtn, restoreBtn, deleteBtn);

        const details = document.createElement("div");
        details.classList.add("extendedTodo");
        details.innerHTML = expandTemplate(todo);

        li.append(header, details);
        trashTodos.appendChild(li);
    });

    // ─── Archived Projects ─────────────────
    getArchivedProjects().forEach(project => {
        const li = document.createElement("li");
        li.dataset.id = project.id;

        const header = document.createElement("div");
        header.classList.add("thumbnail");

        const title = document.createElement("span");
        title.textContent = project.title;

        const expandBtn = document.createElement("button");
        expandBtn.textContent = "▸";
        expandBtn.classList.add("expand-project");

        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "Restore";
        restoreBtn.classList.add("restore-project");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-project");

        header.append(title, expandBtn, restoreBtn, deleteBtn);

        const todoList = document.createElement("ul");
        todoList.classList.add("project-trash-todos");

        const projectTodos = getDeletedTodosByProject(project.id);
        projectTodos.forEach(todo => {
            const t = document.createElement("li");
            t.textContent = todo.title;
            todoList.appendChild(t);
        });

        li.append(header, todoList);
        trashProjects.appendChild(li);
    });
}

// ─── EVENT DELEGATION ─────────────────────
trashTodos.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;

    if (e.target.matches(".expand-trash")) {
        li.classList.toggle("expanded");
        return;
    }

    if (e.target.matches(".restore-todo")) {
        restoreTodo(li.dataset.id);
        saveToLocalStorage();
        refreshUI();
    }

    if (e.target.matches(".delete-todo")) {
        let userChoice = confirm("Are you sure you want to delete this Todo?");
        if (userChoice) {
            permanentDeleteTodo(li.dataset.id);
        }
        saveToLocalStorage();
        refreshUI();
    }
});

trashProjects.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;

    if (e.target.matches(".expand-project")) {
        li.classList.toggle("expanded");
        return;
    }

    if (e.target.matches(".restore-project")) {
        restoreProject(li.dataset.id);
        saveToLocalStorage();
        refreshUI();
    }

    if (e.target.matches(".delete-project")) {
        let userChoice = confirm("Are you sure you want to delete this Project?");
        if (userChoice) {
            permanentDeleteProject(li.dataset.id);
        }
        saveToLocalStorage();
        refreshUI();
    }
});
