import { getCompletedTodos, getIncompleteTodos, getNotArchivedTodos, getTodayTodos, getTodosByProject, getUpcomingTodos } from "../logic/todoLogic.js";
import { getCurrentViewType, setView } from "./appUI.js";
import { getCurrentProjectId } from "./appUI.js";
import { renderTodoUI } from "./todoUI.js";

const headerBtns = document.querySelectorAll(".header-nav-button");
headerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const view = btn.dataset.view;
        switch (view) {
            case "notification":
                break;
            case "trash":
                setView({
                    title: "Trash",
                    type: btn.dataset.view,
                    projectId: null
                });
        }
    })
})

const form = document.querySelector(".search");
const searchInput = document.getElementById("searchbar");

function runSearch() {
    const query = searchInput.value.toLowerCase().trim();
    handleSearch(query);
}

form.addEventListener("submit", (e) => {
    e.preventDefault(); // 🚨 prevents page reload
    runSearch();
});

searchInput.addEventListener("input", () => {
    runSearch();
});

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
                const projectId = getCurrentProjectId();
                todos = getTodosByProject(projectId);
                break;
            default:
                todos = getTodosByProject("default");
        }

    if (query === "") {
        renderTodoUI(todos);
        return;
    }

    const filtered = todos.filter(todo =>
        todo.title.toLowerCase().startsWith(query)
    );

    renderTodoUI(filtered);
}