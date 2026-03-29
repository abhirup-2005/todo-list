// appUI.js

import { loadFromLocalStorage } from "../storage/storage.js";
import { getCompletedTodos, getDeletedTodos, getIncompleteTodos, getTodayTodos, getTodosByProject, getUpcomingTodos } from "../logic/todoLogic.js";
import { renderTodoUI } from "./todoUI.js";
import "./modalUI.js";
import "./headerUI.js";
import { ensureDefaultProjectExists, getProjects } from "../logic/projectLogic.js";
import { renderProjects } from "./sidebarUI.js";
import { renderTrashUI } from "./trashUI.js";
import { renderGlobalChart, renderPieChart } from "./analysisUI.js";

let currentView = {
    title: "Default",
    type: "project",
    projectId: "default"
};

export function initUI() {
    loadFromLocalStorage();
    ensureDefaultProjectExists();
    currentView = {
        title: "Default",
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
    updatePageTitle();
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
            renderSidebar();
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
    renderPieChart(todos);
    renderGlobalChart(); 
}

export function refreshUI() {
    renderApp();
};

export function getCurrentProjectId() {
    return currentView.type === "project" ? currentView.projectId : null;
};

export function getCurrentViewType() {
    return currentView.type;
}

function updateAddTodoVisibility() {
    const btn = document.querySelector("#add-todo");
    btn.hidden = currentView.type !== "project";
}

function renderSidebar() {
    const projects = getProjects();
    renderProjects(projects, currentView);
}

function updatePageTitle() {
    const pageTitle = document.querySelector("#page-title");
    pageTitle.textContent = currentView.title;
}