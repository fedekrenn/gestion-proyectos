/**
 * Utilidades para manejo de tareas
 */

export function getTasksByStatus(tasks, status) {
  return tasks.filter((task) => task.status === status);
}

export function getTasksByRole(tasks, role) {
  return tasks.filter((task) => task.assignedTo === role);
}

export function countCompletedTasks(tasks) {
  return tasks.filter((task) => task.status === "Completada").length;
}

export function calculateProgress(tasks) {
  if (tasks.length === 0) return 0;
  const completed = countCompletedTasks(tasks);
  return Math.round((completed / tasks.length) * 100);
}

export function sortTasksByPriority(tasks) {
  const priorityOrder = { Completada: 3, "En progreso": 2, Pendiente: 1 };
  return [...tasks].sort((a, b) => {
    return (priorityOrder[a.status] || 0) - (priorityOrder[b.status] || 0);
  });
}

export function isTaskOverdue(task, currentDate) {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < currentDate && task.status !== "Completada";
}

export function validateTaskTitle(title) {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: "El título no puede estar vacío" };
  }
  if (title.length > 100) {
    return { valid: false, error: "El título no puede exceder 100 caracteres" };
  }
  return { valid: true };
}
