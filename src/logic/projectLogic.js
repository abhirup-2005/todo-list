//projectLogic.js

import { createProject } from "../models/project.js";
import { projectList } from "../state/state.js";
import { todoList } from "../state/state.js";

export function addToProjectList(title) {
    projectList.unshift(createProject(title));
}

export function archiveProject(projectId) {
    const index = projectList.findIndex(item => item.id === projectId);
    if (index === -1) return;

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

    projectList[index].archived = false;

    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].projectId === projectId) {
            todoList[i].deleted = false;
        }
    }
}