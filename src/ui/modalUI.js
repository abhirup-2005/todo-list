// modalUI.js

import { addToTodoList } from "../logic/todoLogic.js";
import { saveToLocalStorage } from "../storage/storage.js";
import { getCurrentProjectId, refreshUI } from "./appUI.js";

const todoModal = document.querySelector("#add-todo-modal");
const todoForm = document.querySelector("#add-todo-form");
const addTodoBtn = document.querySelector("#add-todo");

const checklistItems = document.querySelector("#checklist-items");
const addChecklistBtn = document.querySelector("#add-checklist-item");
const checklistInput = document.querySelector("#checklist-input");


// --------------------
// OPEN MODAL
// --------------------
addTodoBtn.addEventListener("click", () => {
    todoModal.showModal();
});


// --------------------
// CREATE CHECKLIST ITEM (Editable)
// --------------------
function createChecklistItem(text = "") {
    const li = document.createElement("li");

    const input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.placeholder = "Checklist item";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "x";

    removeBtn.addEventListener("click", () => {
        li.remove();
    });

    li.append(input, removeBtn);

    return li;
}


// --------------------
// ADD CHECKLIST ITEM BUTTON
// --------------------
addChecklistBtn.addEventListener("click", () => {
    const text = checklistInput.value.trim();
    if (!text) return;

    const li = createChecklistItem(text);
    checklistItems.appendChild(li);

    checklistInput.value = "";
});


// --------------------
// EXTRACT CHECKLIST INTO ARRAY
// --------------------
function getChecklistArray() {
    const checklist = [];

    checklistItems.querySelectorAll("li input").forEach(input => {
        const value = input.value.trim();
        if (value) {
            checklist.push({ text: value });
        }
    });

    return checklist;
}


// --------------------
// FORM SUBMIT
// --------------------
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
        projectId,
        title,
        dueDate,
        priority,
        description,
        note,
        checklist: getChecklistArray(),
    });

    saveToLocalStorage();

    // Clean modal state
    checklistItems.innerHTML = "";
    todoForm.reset();
    refreshUI();
    todoModal.close();
});


// --------------------
// CANCEL BUTTON
// --------------------
const cancelBtn = todoForm.querySelector("[data-close]");

cancelBtn.addEventListener("click", () => {
    checklistItems.innerHTML = "";
    todoForm.reset();
    todoModal.close();
});
