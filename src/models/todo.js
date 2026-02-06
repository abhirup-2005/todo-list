export function createTodo({
    projectId,
    title,
    dueDate,
    priority = "low",
    description = "",
    note = "",
    checklist = [],
}) {
    return {
        id: crypto.randomUUID(),
        projectId,

        title,
        description,
        note,

        dueDate,
        priority,

        checklist,

        completed: false,
        deleted: false,

        createdAt: new Date(),
    };
}