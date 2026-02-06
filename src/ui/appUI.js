// appUI.js

import { loadFromLocalStorage } from "../storage/storage.js";
import { getCompletedTodos, getDeletedTodos, getIncompleteTodos, getTodayTodos, getTodosByProject, getUpcomingTodos } from "../logic/todoLogic.js";
import { renderTodoUI } from "./todoUI.js";
import "./modalUI.js";
import { ensureDefaultProjectExists, getProjects } from "../logic/projectLogic.js";
import { renderProjects } from "./sidebarUI.js";
import { renderTrashUI } from "./trashUI.js";

let currentView = {
    type: "project",
    projectId: "default"
};

export function initUI() {
    loadFromLocalStorage();
    ensureDefaultProjectExists();
    currentView = {
        type: "project",
        projectId: "default"
    };
    renderApp();
}

export function setView(view) {
    currentView = view;
    renderApp();
}

function renderApp() {
    let todos = [];
    switch (currentView.type) {
        case "inbox":
            todos = getIncompleteTodos();
            break;
        case "today":
            todos = getTodayTodos();
            break;
        case "upcoming":
            todos = getUpcomingTodos();
            break;
        case "completed":
            todos = getCompletedTodos();
            break;
        case "trash":

            document.querySelector(".container").hidden = true;
            document.querySelector("#trash-view").hidden = false;

            renderTrashUI();
            updateAddTodoVisibility();
            return;
        case "project":
            todos = getTodosByProject(currentView.projectId);
            break;
        default:
            todos = getTodosByProject("default");
    }
    document.querySelector(".container").hidden = false;
    document.querySelector("#trash-view").hidden = true;
    updateAddTodoVisibility();
    renderTodoUI(todos);

    renderSidebar();
}

export function refreshUI() {
    renderApp();
};

export function getCurrentProjectId() {
    return currentView.type === "project" ? currentView.projectId : null;
};

function updateAddTodoVisibility() {
    const btn = document.querySelector("#add-todo");
    btn.hidden = currentView.type !== "project";
}

function renderSidebar() {
    const projects = getProjects();
    renderProjects(projects, currentView);
}
