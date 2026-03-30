//headerUI.js

import { format } from "date-fns";
import { getProjectById } from "../logic/projectLogic.js";
import {
    getCompletedTodos,
    getIncompleteTodos,
    getNotArchivedTodos,
    getOverdueTodos,
    getTodayTodos,
    getTodosByProject,
    getUpcomingTodos
} from "../logic/todoLogic.js";
import { getCurrentViewType, setView, getCurrentProjectId } from "./appUI.js";
import { renderTodoUI } from "./todoUI.js";

/* =========================
   HEADER BUTTONS
========================= */
const headerBtns = document.querySelectorAll(".header-nav-button");

headerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const view = btn.dataset.view;

        switch (view) {
            case "notification":
                e.stopPropagation();

                const dropdown = document.getElementById("notif-dropdown");
                const notifIcon = document.getElementById("notif-icon");

                const isOpen = !dropdown.classList.contains("hidden");

                if (!isOpen) {
                    renderNotifications();
                    dropdown.classList.remove("hidden");
                    notifIcon.classList.replace("fa-bell", "fa-xmark");
                } else {
                    dropdown.classList.add("hidden");
                    notifIcon.classList.replace("fa-xmark", "fa-bell");
                }
                break;

            case "trash":
                setView({
                    title: "Trash",
                    type: "trash",
                    projectId: null
                });
                break;
        }
    });
});

/* =========================
   SEARCH
========================= */
const form = document.querySelector(".search");
const searchInput = document.getElementById("searchbar");

function runSearch() {
    const query = searchInput.value.toLowerCase().trim();
    handleSearch(query);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    runSearch();
});

searchInput.addEventListener("input", runSearch);

function handleSearch(query) {
    const currentView = getCurrentViewType();
    let todos = [];

    switch (currentView) {
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
            todos = getNotArchivedTodos();
            return;
        case "project":
            todos = getTodosByProject(getCurrentProjectId());
            break;
        default:
            todos = getTodosByProject("default");
    }

    if (!query) {
        renderTodoUI(todos);
        return;
    }

    const filtered = todos.filter(todo =>
        todo.title.toLowerCase().startsWith(query)
    );

    renderTodoUI(filtered);
}

/* =========================
   NOTIFICATIONS
========================= */
const notifIcon = document.getElementById("notif-icon");
const dropdown = document.getElementById("notif-dropdown");

export function getNotifications() {
    const overdue = getOverdueTodos();

    return overdue.map(todo => ({
        ...todo,
        projectName: getProjectById(todo.projectId)?.title || "Unknown"
    }));
}

function renderNotifications() {
    const container = document.getElementById("notif-container");
    const todos = getNotifications();

    if (!todos.length) {
        container.innerHTML = "<p>No overdue tasks 🎉</p>";
        return;
    }

    container.innerHTML = `
        <div class="notif-section">
            <h3>⚠️ Overdue Tasks</h3>
            ${todos.map(todo => `
                <div class="notif-item">
                    <div class="overdue-notif-item">
                        <p>Todo: ${todo.title}</p>
                        <p>Project: ${todo.projectName}</p>
                        <p>Due Date: ${format(todo.dueDate, "EEE, MMM do yyyy")}</p>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

/* CLOSE NOTIFICATION */
document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !notifIcon.contains(e.target)) {
        dropdown.classList.add("hidden");
        notifIcon.classList.replace("fa-xmark", "fa-bell");
    }
});

dropdown.addEventListener("click", (e) => e.stopPropagation());

/* =========================
   THEME TOGGLE
========================= */
const themeBtn = document.querySelector('[data-view="theme-toggle"]');
const themeIcon = themeBtn.querySelector("i");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeIcon.classList.replace("fa-sun", "fa-moon");
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    themeIcon.classList.toggle("fa-sun", !isDark);
    themeIcon.classList.toggle("fa-moon", isDark);
});

/* =========================
   SIDEBAR LOGIC
========================= */
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarClose = document.getElementById("sidebar-close");

const analysisToggle = document.getElementById("analysis-toggle");
const analysisIcon = analysisToggle?.querySelector("i");

function isMobile() {
    return window.innerWidth <= 768;
}

/* 🔥 CENTRALIZED CLOSE FUNCTION */
function closeAnalysis() {
    document.body.classList.remove("analysis-open");

    if (analysisIcon) {
        analysisIcon.classList.replace("fa-xmark", "fa-chart-pie");
    }
}

/* LEFT SIDEBAR */
sidebarToggle.addEventListener("click", () => {
    if (isMobile()) {
        document.body.classList.toggle("sidebar-open");

        // 🔥 ensure right sidebar closes properly
        closeAnalysis();

    } else {
        document.body.classList.toggle("sidebar-collapsed");
    }
});

/* CLOSE LEFT */
sidebarClose?.addEventListener("click", () => {
    document.body.classList.remove("sidebar-open");
});

/* RIGHT SIDEBAR */
analysisToggle?.addEventListener("click", () => {

    // close left sidebar first
    document.body.classList.remove("sidebar-open");

    const isOpen = document.body.classList.toggle("analysis-open");

    if (isOpen) {
        analysisIcon.classList.replace("fa-chart-pie", "fa-xmark");
    } else {
        closeAnalysis();
    }
});

/* OUTSIDE CLICK CLOSE */
document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {

        const leftSidebar = document.getElementById("left-sidebar");
        const rightSidebar = document.getElementById("right-sidebar");

        const clickedLeft = leftSidebar.contains(e.target);
        const clickedRight = rightSidebar.contains(e.target);
        const clickedToggle =
            sidebarToggle.contains(e.target) ||
            analysisToggle?.contains(e.target);

        if (!clickedLeft && !clickedRight && !clickedToggle) {
            document.body.classList.remove("sidebar-open");
            closeAnalysis();
        }
    }
});