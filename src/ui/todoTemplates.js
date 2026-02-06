// todoTemplates.js
import { format } from "date-fns";

export function editTemplate(todo) {
    return `
    <div class="edit-section">
      <label>
        Title
        <input class="edit-title" type="text" value="${todo.title}">
      </label>

      <label>
        Due Date
        <input class="edit-date" type="date"
          value="${todo.dueDate ? format(todo.dueDate, "yyyy-MM-dd") : ""}">
      </label>

      <label>
        Priority
        <select class="edit-priority">
          <option value="low" ${todo.priority === "low" ? "selected" : ""}>Low</option>
          <option value="medium" ${todo.priority === "medium" ? "selected" : ""}>Medium</option>
          <option value="high" ${todo.priority === "high" ? "selected" : ""}>High</option>
        </select>
      </label>

      <label>
        Description
        <textarea class="edit-desc">${todo.description || ""}</textarea>
      </label>

      <label>
        Notes
        <textarea class="edit-note">${todo.note || ""}</textarea>
      </label>

      <div class="edit-checklist">
        <p>Checklist</p>
        <ul>
          ${todo.checklist.map(item => `
            <li>
              <input type="checkbox" ${item.completed ? "checked" : ""}>
              <input type="text" value="${item.text}">
              <button class="remove-checklist">×</button>
            </li>
          `).join("")}
        </ul>
        <button class="add-checklist">+ Add Item</button>
      </div>

      <div class="edit-actions">
        <button class="save">Save</button>
      </div>
    </div>
  `;
}

//Read-Only
export function expandTemplate(todo) {
    return `
    <div class="description">
        <p>Description</p>
        <div>${todo.description || "No Description"}</div>
    </div>
    <div class="note">
        <p>Notes</p>
        <div>${todo.note || "No Note"}</div>
    </div>
    <div class="checklistContainer">
        <p>Checklist</p>
            <ul>
            ${todo.checklist.map((item, index) => `
                <li>
                    <input type="checkbox" ${item.completed ? "checked" : ""}>
                    <span>${item.text}</span>
                </li>
            `).join("") || "No Checklist"}
            </ul>
    </div>
    `;
}