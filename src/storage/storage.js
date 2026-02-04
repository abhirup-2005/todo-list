//storage.js
import { createProject } from "../models/project.js";
import { createTodo } from "../models/todo.js";
import { todoList, projectList } from "../state/state.js";

export function saveToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
    localStorage.setItem("projectList", JSON.stringify(projectList));
}

export function loadFromLocalStorage() {
    const storedTodoList = localStorage.getItem("todoList");
    const storedProjectList = localStorage.getItem("projectList");

    if (!storedTodoList || !storedProjectList) return;

    const parsedTodoData = JSON.parse(storedTodoList);
    const parsedProjectData = JSON.parse(storedProjectList);

    todoList.length = 0;
    projectList.length = 0;

    parsedTodoData.forEach(todoData => {
        const todo = createTodo({
            projectId: todoData.projectId,
            title: todoData.title,
            dueDate: todoData.dueDate !== undefined ? new Date(todoData.dueDate) : todoData.dueDate,
            priority: todoData.priority,
            description: todoData.description,
            note: todoData.note,
            checklist: todoData.checklist,
        });
        todo.id = todoData.id;
        todo.completed = todoData.completed;
        todo.deleted = todoData.deleted;
        todo.createdAt = new Date(todoData.createdAt);
        todoList.unshift(todo);
    })

    parsedProjectData.forEach(projectData => {
        const project = createProject(projectData.title);
        project.id = projectData.id;
        project.archived = projectData.archived;
        project.createdAt = new Date(projectData.createdAt);

        projectList.unshift(project);
    });
}