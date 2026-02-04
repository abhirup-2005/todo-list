export function createProject(title) {
    return {
        id: crypto.randomUUID(),
        title,
        archived: false,
        createdAt: new Date()
    };
}
