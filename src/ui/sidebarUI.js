// sidebarUI.js
import { setView, refreshUI } from "./appUI.js";
import { addToProjectList, archiveProject, renameProject } from "../logic/projectLogic.js";
import { saveToLocalStorage } from "../storage/storage.js";

const viewBtns = document.querySelectorAll(".view-buttons");

viewBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    setView({
      type: btn.dataset.view,
      projectId: null
    });
  });
});

const projectContainer = document.querySelector("#project-container");

export function renderProjects(projects, currentView) {
  projectContainer.textContent = "";

  projects.forEach(project => {
    if(project.archived) return;
    const li = document.createElement("li");

    // project button
    const projectBtn = document.createElement("button");
    projectBtn.classList.add("project-buttons");
    projectBtn.textContent = project.title;
    projectBtn.dataset.id = project.id;

    if (
      currentView.type === "project" &&
      currentView.projectId === project.id
    ) {
      projectBtn.classList.add("active");
    }

    if (project.isDefault) {
      projectBtn.classList.add("default-project");
    }

    li.appendChild(projectBtn);

    // controls (non-default only)
    if (project.id !== "default") {
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.classList.add("edit-project");

      const archiveBtn = document.createElement("button");
      archiveBtn.textContent = "Archive";
      archiveBtn.classList.add("archive-project");

      li.append(editBtn, archiveBtn);
    }

    projectContainer.appendChild(li);
  });
}

projectContainer.addEventListener("click", (e) => {
  const projectBtn = e.target.closest(".project-buttons");
  const editBtn = e.target.closest(".edit-project");
  const archiveBtn = e.target.closest(".archive-project");

  // navigate to project
  if (projectBtn) {
    setView({
      type: "project",
      projectId: projectBtn.dataset.id
    });
    return;
  }

  // inline edit
  if (editBtn) {
    const li = editBtn.closest("li");
    startInlineEdit(li);
    return;
  }

  // archive project
  if (archiveBtn) {
    const li = archiveBtn.closest("li");
    const id = li.querySelector(".project-buttons").dataset.id;

    archiveProject(id);
    saveToLocalStorage();
    refreshUI();
  }
});


const addProjectBtn = document.querySelector("#add-project");

addProjectBtn.addEventListener("click", () => {
  // prevent multiple open forms
  if (projectContainer.querySelector(".project-inline-form")) return;

  const li = document.createElement("li");
  li.classList.add("project-inline-form");

  const form = document.createElement("form");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Project name";
  input.required = true;

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "x";

  form.append(input, cancelBtn);
  li.appendChild(form);
  projectContainer.prepend(li);

  input.focus();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    addToProjectList(title);
    saveToLocalStorage();
    li.remove();
    refreshUI();
  });

  cancelBtn.addEventListener("click", () => {
    li.remove();
  });
});

function startInlineEdit(li) {
  if (li.querySelector(".project-edit-form")) return;

  const projectBtn = li.querySelector(".project-buttons");
  const projectId = projectBtn.dataset.id;
  const oldTitle = projectBtn.textContent;

  const form = document.createElement("form");
  form.classList.add("project-edit-form");

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldTitle;
  input.required = true;

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "x";

  form.append(input, cancelBtn);
  li.replaceChildren(form);

  input.focus();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTitle = input.value.trim();
    if (!newTitle) return;

    renameProject(projectId, newTitle);
    saveToLocalStorage();
    refreshUI();
  });

  cancelBtn.addEventListener("click", () => {
    refreshUI();
  });
}
