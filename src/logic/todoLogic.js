// todoLogic.js

import { createTodo } from "../models/todo.js";
import { projectList, todoList } from "../state/state.js";
import { compareAsc, isAfter, isBefore, isToday, startOfToday } from "date-fns";
import { getArchivedProjects } from "./projectLogic.js";

export function addToTodoList({
    projectId,
    title,
    dueDate,
    priority = "low",
    description = "",
    note = "",
    checklist = [],
}) {
    const newTodo = createTodo({
        projectId,
        title,
        dueDate,
        priority,
        description,
        note,
        checklist,
    });
    todoList.unshift(newTodo);
}

export function softDeleteTodo(todoId) {
    const todo = todoList.find(item => item.id === todoId);
    if (!todo) return;
    todo.deleted = true;
}

export function permanentDeleteTodo(todoId) {
    const index = todoList.findIndex(item => item.id === todoId);
    if (index === -1) return;
    todoList.splice(index, 1);
}

export function restoreTodo(todoId) {
    const todo = todoList.find(item => item.id === todoId);
    if (!todo) return;

    const projectId = todo.projectId;
    const project = projectList.find(item => item.id === projectId);
    if (!project) return;
    if (project.archived === false) {
        todo.deleted = false;
    }
}

export function toggleCompletion(todoId) {
    const todo = todoList.find(item => item.id === todoId);
    if (!todo || todo.deleted) return;
    todo.completed = !todo.completed;

    // sync checklist
    todo.checklist.forEach(item => {
        item.completed = todo.completed;
    });
}

export function editTodo(todoId, updates) {
    const todo = todoList.find(item => item.id === todoId);
    if (!todo) return;
    if (todo.deleted === true) return;

    if (updates.title !== undefined) {
        todo.title = updates.title;
    }

    if (updates.dueDate !== undefined) {
        todo.dueDate = updates.dueDate;
    }

    if (updates.priority !== undefined) {
        todo.priority = updates.priority;
    }

    if (updates.description !== undefined) {
        todo.description = updates.description;
    }

    if (updates.note !== undefined) {
        todo.note = updates.note;
    }

    if (updates.checklist !== undefined) {
        todo.checklist = updates.checklist;
    }
}

export function getDeletedTodos() {
    return todoList.filter(todo => todo.deleted);
}

export function getNotArchivedTodos() {
    return getDeletedTodos().filter(todo => {
        const projectId = todo.projectId;
        const archiveProject = getArchivedProjects().find(project => project.id === projectId);
        if (!archiveProject) {
            return todo;
        }
    });
}

export function getActiveTodos() {
    return todoList.filter(todo => !todo.deleted);
}

export function getTodosByProject(projectId) {
    return todoList.filter(todo => todo.projectId === projectId && !todo.deleted);
}

export function getDeletedTodosByProject(projectId) {
    return todoList.filter(todo => todo.projectId === projectId && todo.deleted);
}

export function getCompletedTodos() {
    return todoList.filter(todo => todo.completed && !todo.deleted);
}

export function getIncompleteTodos() {
    return todoList.filter(todo => !todo.completed && !todo.deleted);
}

export function sortTodosByDueDate() {
    return getActiveTodos().slice().sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return compareAsc(new Date(a.dueDate), new Date(b.dueDate));
    });
}

function classifyTodoByDate(todo) {
    if (!todo.dueDate) return "none";

    const today = startOfToday();
    const dueDate = new Date(todo.dueDate);

    if (isBefore(dueDate, today)) return "overdue";
    if (isToday(dueDate)) return "today";
    if (isAfter(dueDate, today)) return "upcoming";

    return "none";
}

export function getOverdueTodos() {
    return getIncompleteTodos().filter(
        todo => classifyTodoByDate(todo) === "overdue"
    );
}

export function getTodayTodos() {
    return getIncompleteTodos().filter(
        todo => classifyTodoByDate(todo) === "today"
    );
}

export function getUpcomingTodos() {
    return getIncompleteTodos().filter(
        todo => classifyTodoByDate(todo) === "upcoming"
    );
}

export function getTodoById(todoId) {
    return todoList.find(todo => todo.id === todoId);
}

function updateTodoCompletionFromChecklist(todo) {
    if (!todo.checklist.length) return;

    const allCompleted = todo.checklist.every(item => item.completed);
    todo.completed = allCompleted;
}

export function toggleChecklistItem(todoId, index) {
    const todo = todoList.find(t => t.id === todoId);
    if (!todo || todo.deleted) return;

    const item = todo.checklist[index];
    if (!item) return;

    item.completed = !item.completed;

    updateTodoCompletionFromChecklist(todo);
}
