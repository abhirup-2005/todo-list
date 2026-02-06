// modalUI.js
import { addToTodoList } from "../logic/todoLogic.js";
import { saveToLocalStorage } from "../storage/storage.js";
import { getCurrentProjectId, refreshUI } from "./appUI.js";

const todoModal = document.querySelector("#add-todo-modal");
const todoForm = document.querySelector("#add-todo-form");
const addTodoBtn = document.querySelector("#add-todo");

addTodoBtn.addEventListener("click", () => {
    todoModal.showModal();
});

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(todoForm);
    const title = formData.get("title");

    const rawDueDate = formData.get("dueDate");
    const dueDate = rawDueDate ? new Date(rawDueDate) : undefined;

    const priority = formData.get("priority");
    const description = formData.get("description");
    const note = formData.get("note");
    const projectId = getCurrentProjectId();
    addToTodoList({
        projectId: projectId,
        title: title,
        dueDate: dueDate,
        priority: priority,
        description: description,
        note: note,
        checklist: checklist,
    });
    saveToLocalStorage();
    checklist = [];
    checklistItems.textContent = "";
    refreshUI();
    todoForm.reset();
    todoModal.close();
});

const cancelBtn = todoForm.querySelector("[data-close]");
cancelBtn.addEventListener("click", () => {
    checklist = [];
    checklistItems.textContent="";
    todoForm.reset();
    todoModal.close();
});

let checklist = [];
const checklistItems = document.querySelector("#checklist-items");
const addToChecklist = document.querySelector("#add-checklist-item");

addToChecklist.addEventListener("click", () => {
    const item = document.querySelector("#checklist-input");
    if (!item.value.trim()) return;
    checklist.push({text: item.value, completed: false});
    
    const listItem = document.createElement("li");
    listItem.textContent = item.value;
    checklistItems.appendChild(listItem);
    item.value = null;
})