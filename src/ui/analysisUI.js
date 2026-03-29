import Chart from 'chart.js/auto';
import {
  getCompletedTodos,
  getIncompleteTodos,
  getActiveTodos,
  getOverdueTodos
} from '../logic/todoLogic.js';

let chartInstance = null;
let globalChartInstance = null;


// =====================
// CURRENT VIEW CHART
// =====================
export function renderPieChart(todos) {
  const completed = todos.filter(t => t.completed).length;

  const overdue = todos.filter(t =>
    getOverdueTodos().includes(t)
  ).length;

  const incomplete = todos.filter(t => !t.completed).length;

  const pending = incomplete - overdue;

  const ctx = document.getElementById('todoChart');
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending', 'Overdue'],
      datasets: [{
        data: [completed, pending, overdue],
        backgroundColor: ['#16a34a', '#e5e7eb', '#dc2626'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}


// =====================
// GLOBAL CHART
// =====================
export function renderGlobalChart() {
  const completed = getCompletedTodos().length;
  const incomplete = getIncompleteTodos().length;
  const overdue = getOverdueTodos().length;

  const pending = incomplete - overdue;

  const ctx = document.getElementById('globalChart');
  if (!ctx) return;

  if (globalChartInstance) globalChartInstance.destroy();

  globalChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending', 'Overdue'],
      datasets: [{
        data: [completed, pending, overdue],
        backgroundColor: ['#16a34a', '#e5e7eb', '#dc2626'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}