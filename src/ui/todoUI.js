// todoUI.js
import { format } from "date-fns";
import {
  toggleCompletion,
  softDeleteTodo,
  restoreTodo,
  getTodoById,
  editTodo,
  toggleChecklistItem
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

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.classList.add("todo-checkbox");

    const title = document.createElement("span");
    title.textContent = todo.title;
    title.classList.add("task-name");

    const dueDate = document.createElement("span");
    dueDate.textContent = todo.dueDate
      ? format(todo.dueDate, "EEE, MMM do yyyy")
      : "No Due Date";
    dueDate.classList.add("dueDate");

    const priority = document.createElement("span");
    priority.textContent = todo.priority;
    priority.classList.add("priority");

    const expandBtn = document.createElement("button");
    expandBtn.textContent = "▸";
    expandBtn.classList.add("extend");

    thumbnail.append(checkbox, title, dueDate, priority, expandBtn);

    if (!todo.deleted) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit");

      const trashBtn = document.createElement("button");
      trashBtn.textContent = "Trash";
      trashBtn.classList.add("trash");

      thumbnail.append(editBtn, trashBtn);
    } else {
      const restoreBtn = document.createElement("button");
      restoreBtn.textContent = "Restore";
      restoreBtn.classList.add("restore");

      thumbnail.append(restoreBtn);
    }

    // Extended View
    const extendedTodo = document.createElement("div");
    extendedTodo.classList.add("extendedTodo");

    const description = document.createElement("p");
    description.textContent = todo.description || "No description";

    const note = document.createElement("p");
    note.textContent = todo.note || "No notes";

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


    extendedTodo.append(description, note, checklistContainer);

    li.append(thumbnail, extendedTodo);
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
      <button class="remove-checklist">×</button>
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