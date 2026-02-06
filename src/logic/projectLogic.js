//projectLogic.js

import { createProject } from "../models/project.js";
import { projectList } from "../state/state.js";
import { todoList } from "../state/state.js";

export function addToProjectList(title) {
    projectList.splice(1, 0, createProject(title));
}

export function archiveProject(projectId) {
    const index = projectList.findIndex(item => item.id === projectId);
    if (index === -1) return;

    if(projectList[index].id === "default") return;

    projectList[index].archived = true;
    
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].projectId === projectId) {
            todoList[i].deleted = true;
        }
    }
}

export function permanentDeleteProject(projectId) {
    const index = projectList.findIndex(item => item.id === projectId);
    if (index === -1) return;

    if(projectList[index].id === "default") return;

    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].projectId === projectId) {
            todoList.splice(i, 1);
            i--;
        }
    }

    projectList.splice(index, 1);
}

export function restoreProject(projectId) {
    const index = projectList.findIndex(item => item.id === projectId);
    if (index === -1) return;

    if(projectList[index].id === "default") return;

    projectList[index].archived = false;

    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].projectId === projectId) {
            todoList[i].deleted = false;
        }
    }
}

export function ensureDefaultProjectExists() {
  const exists = projectList.some(p => p.id === "default");
  if (!exists) {
    projectList.unshift({
      id: "default",
      title: "Default",
      isDefault: true,
      archived: false,
      createdAt: new Date()
    });
  }
}

export function getProjects() {
    return projectList;
}

export function renameProject(projectId, newTitle) {
  const project = projectList.find(p => p.id === projectId);
  if (!project) return;
  if (project.isDefault) return;

  project.title = newTitle;
}

export function getArchivedProjects() {
    return projectList.filter(project => project.archived);
}