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
          <option value="Low" ${todo.priority === "Low" ? "selected" : ""}>Low</option>
          <option value="Medium" ${todo.priority === "Medium" ? "selected" : ""}>Medium</option>
          <option value="High" ${todo.priority === "High" ? "selected" : ""}>High</option>
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
              <button class="remove-checklist"><i class="fa-solid fa-circle-xmark"></i></button>
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
  return `<div class="description">
<p>Description</p>
<p>${todo.description || "No Description"}</p>
</div>
<div class="note">
<p>Notes</p>
<p>${todo.note || "No Note"}</p>
</div>
<div class="checklist-container-div">
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