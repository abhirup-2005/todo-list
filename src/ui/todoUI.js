// todoUI.js
import { format } from "date-fns";
import {
  toggleCompletion,
  softDeleteTodo,
  restoreTodo,
  getTodoById,
  editTodo,
  toggleChecklistItem,
  isOverdue
} from "../logic/todoLogic.js";
import { saveToLocalStorage } from "../storage/storage.js";
import { refreshUI } from "./appUI.js";
import { editTemplate } from "./todoTemplates.js";

const todoContainer = document.querySelector("#todoList");

export function renderTodoUI(todos) {
  todoContainer.textContent = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    li.dataset.id = todo.id;

    // Thumbnail
    const thumbnail = document.createElement("div");
    thumbnail.classList.add("thumbnail");

    const row1 = document.createElement("div");
    row1.classList.add("row1");

    const mergeBoxName = document.createElement("div");
    mergeBoxName.classList.add("checkbox-and-title-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.classList.add("todo-checkbox");

    const title = document.createElement("p");
    title.textContent = todo.title;
    title.classList.add("task-name");

    mergeBoxName.append(checkbox, title);

    const dueDate = document.createElement("p");
    dueDate.textContent = todo.dueDate
      ? format(todo.dueDate, "EEE, MMM do yyyy")
      : "No Due Date";
    dueDate.classList.add("dueDate");

    const priority = document.createElement("p");
    priority.classList.add("priority");
    priority.innerHTML = `Priority: <span id="priority-text">${todo.priority}</span>`;
    const priorityText = priority.querySelector("#priority-text");
    if (todo.priority === "Low") {
      priorityText.classList.add("low");
    }
    else if (todo.priority === "Medium") {
      priorityText.classList.add("medium");
    }
    else { //high priority
      priorityText.classList.add("high");
    }

    row1.append(mergeBoxName, dueDate);

    const row2 = document.createElement("div");
    row2.classList.add("row2");

    //buttons
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("button-container")

    const expandBtn = document.createElement("button");
    const expandIcon = document.createElement("i");
    expandIcon.classList.add("fa-solid", "fa-caret-down", "extend-icon");
    expandBtn.appendChild(expandIcon);
    expandBtn.classList.add("extend");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editBtn.classList.add("edit");

    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    trashBtn.classList.add("trash");

    btnContainer.append(expandBtn, editBtn, trashBtn);
    row2.append(priority, btnContainer);
    thumbnail.append(row1, row2);

    // Extended View
    const extendedTodo = document.createElement("div");
    extendedTodo.classList.add("extendedTodo");

    const description = document.createElement("div");
    description.innerHTML = `<p>Description:</p><p>${todo.description || "No description"}</p>`
    description.classList.add("description");

    const note = document.createElement("div");
    note.innerHTML = `<p>Note:</p><p>${todo.note || "No notes"}</p>`;
    note.classList.add("note");

    const checklistContainerDiv = document.createElement("div");
    checklistContainerDiv.classList.add("checklist-container-div");
    const checklistHeading = document.createElement("p");
    checklistHeading.textContent = "Checklist:";

    const checklistContainer = document.createElement("ul");
    todo.checklist.forEach((item, index) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.completed;
      checkbox.classList.add("checklist-checkbox");
      checkbox.dataset.index = index;

      const text = document.createElement("span");
      text.textContent = item.text;

      li.append(checkbox, text);
      checklistContainer.appendChild(li);
    });

    if (!checklistContainer.textContent) {
      checklistContainer.textContent = "No Checklist";
    }
    checklistContainerDiv.append(checklistHeading, checklistContainer);
    extendedTodo.append(description, checklistContainerDiv, note);

    li.append(thumbnail, extendedTodo);

    if (isOverdue(todo)) {
      li.classList.add("overdue");
    }

    if(todo.completed) {
      li.classList.add("completed");
    }

    todoContainer.appendChild(li);
  });
}


// EVENT DELEGATION
todoContainer.addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li || e.target.disabled) return;

  const todoId = li.dataset.id;

  if (e.target.matches(".todo-checkbox")) {
    toggleCompletion(todoId);
    saveToLocalStorage();
    refreshUI();
    return;
  }

  if (e.target.matches(".extend")) {
    const extendBtn = e.target.closest(".extend");
    const icon = extendBtn.querySelector(".extend-icon");
    icon.classList.toggle("rotated");
    li.classList.toggle("expanded");
    return;
  }

  if (e.target.matches(".edit")) {
    enterEditMode(li);
    return;
  }

  if (e.target.matches(".cancel-edit")) {
    refreshUI();
    return;
  }

  if (e.target.matches(".trash")) {
    softDeleteTodo(todoId);
    saveToLocalStorage();
    refreshUI();
    return;
  }

  if (e.target.matches(".restore")) {
    restoreTodo(todoId);
    saveToLocalStorage();
    refreshUI();
    return;
  }

  if (e.target.matches(".save")) {
    const updates = {
      title: li.querySelector(".edit-title").value.trim(),
      dueDate: li.querySelector(".edit-date").value
        ? new Date(li.querySelector(".edit-date").value)
        : undefined,
      priority: li.querySelector(".edit-priority").value,
      description: li.querySelector(".edit-desc").value.trim(),
      note: li.querySelector(".edit-note").value.trim(),
      checklist: Array.from(
        li.querySelectorAll(".edit-checklist ul li")
      ).map(item => ({
        text: item.querySelector("input[type=text]").value,
        completed: item.querySelector("input[type=checkbox]").checked
      }))
    };

    editTodo(todoId, updates);
    saveToLocalStorage();
    refreshUI();
    return;
  }

  if (e.target.matches(".add-checklist")) {
    const ul = li.querySelector(".edit-checklist ul");
    const item = document.createElement("li");
    item.innerHTML = `
      <input type="checkbox">
      <input type="text">
      <button class="remove-checklist"><i class="fa-solid fa-circle-xmark"></i></button>
    `;
    ul.appendChild(item);
    return;
  }

  if (e.target.matches(".remove-checklist")) {
    e.target.closest("li").remove();
    return;
  }

  if (e.target.matches(".checklist-checkbox")) {
    const checklistIndex = Number(e.target.dataset.index);
    toggleChecklistItem(todoId, checklistIndex);
    saveToLocalStorage();

    const todo = getTodoById(todoId);
    li.querySelector(".todo-checkbox").checked = todo.completed;
    return;
  }

});


// EDIT MOD
function enterEditMode(li) {
  const todo = getTodoById(li.dataset.id);

  li.classList.add("expanded", "editing");

  const extended = li.querySelector(".extendedTodo");
  extended.innerHTML = editTemplate(todo);

  const editBtn = li.querySelector(".edit");
  editBtn.textContent = "Cancel";
  editBtn.classList.remove("edit");
  editBtn.classList.add("cancel-edit");

  li.querySelector(".extend").disabled = true;
  li.querySelector(".trash").disabled = true;
}