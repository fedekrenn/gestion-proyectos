import { describe, it, expect } from "vitest";
import {
  getTasksByStatus,
  getTasksByRole,
  countCompletedTasks,
  calculateProgress,
  sortTasksByPriority,
  isTaskOverdue,
  validateTaskTitle,
} from "../utils/taskUtils";

const mockTasks = [
  { id: 1, title: "Tarea 1", assignedTo: "Jefe", status: "Completada" },
  { id: 2, title: "Tarea 2", assignedTo: "Supervisor", status: "Pendiente" },
  { id: 3, title: "Tarea 3", assignedTo: "Analista", status: "En progreso" },
  { id: 4, title: "Tarea 4", assignedTo: "Jefe", status: "Pendiente" },
  { id: 5, title: "Tarea 5", assignedTo: "Analista", status: "Completada" },
];

describe("Task Utils", () => {
  describe("getTasksByStatus", () => {
    it("debe retornar tareas completadas", () => {
      const result = getTasksByStatus(mockTasks, "Completada");
      expect(result).toHaveLength(2);
      expect(result.every((task) => task.status === "Completada")).toBe(true);
    });

    it("debe retornar tareas pendientes", () => {
      const result = getTasksByStatus(mockTasks, "Pendiente");
      expect(result).toHaveLength(2);
      expect(result.every((task) => task.status === "Pendiente")).toBe(true);
    });

    it("debe retornar array vacío si no hay tareas con ese estado", () => {
      const result = getTasksByStatus(mockTasks, "Cancelada");
      expect(result).toHaveLength(0);
    });
  });

  describe("getTasksByRole", () => {
    it("debe retornar tareas del Jefe", () => {
      const result = getTasksByRole(mockTasks, "Jefe");
      expect(result).toHaveLength(2);
      expect(result.every((task) => task.assignedTo === "Jefe")).toBe(true);
    });

    it("debe retornar tareas del Analista", () => {
      const result = getTasksByRole(mockTasks, "Analista");
      expect(result).toHaveLength(2);
      expect(result.every((task) => task.assignedTo === "Analista")).toBe(true);
    });

    it("debe retornar array vacío para rol inexistente", () => {
      const result = getTasksByRole(mockTasks, "RolInexistente");
      expect(result).toHaveLength(0);
    });
  });

  describe("countCompletedTasks", () => {
    it("debe contar correctamente las tareas completadas", () => {
      const count = countCompletedTasks(mockTasks);
      expect(count).toBe(2);
    });

    it("debe retornar 0 si no hay tareas completadas", () => {
      const tasks = [
        { id: 1, status: "Pendiente" },
        { id: 2, status: "En progreso" },
      ];
      const count = countCompletedTasks(tasks);
      expect(count).toBe(0);
    });

    it("debe retornar 0 para array vacío", () => {
      const count = countCompletedTasks([]);
      expect(count).toBe(0);
    });
  });

  describe("calculateProgress", () => {
    it("debe calcular el progreso correctamente", () => {
      const progress = calculateProgress(mockTasks);
      expect(progress).toBe(40); // 2 de 5 tareas = 40%
    });

    it("debe retornar 100 si todas las tareas están completadas", () => {
      const tasks = [
        { id: 1, status: "Completada" },
        { id: 2, status: "Completada" },
      ];
      const progress = calculateProgress(tasks);
      expect(progress).toBe(100);
    });

    it("debe retornar 0 si no hay tareas completadas", () => {
      const tasks = [
        { id: 1, status: "Pendiente" },
        { id: 2, status: "En progreso" },
      ];
      const progress = calculateProgress(tasks);
      expect(progress).toBe(0);
    });

    it("debe retornar 0 para array vacío", () => {
      const progress = calculateProgress([]);
      expect(progress).toBe(0);
    });
  });

  describe("sortTasksByPriority", () => {
    it("debe ordenar tareas por prioridad (Pendiente < En progreso < Completada)", () => {
      const sorted = sortTasksByPriority(mockTasks);
      expect(sorted[0].status).toBe("Pendiente");
      expect(sorted[sorted.length - 1].status).toBe("Completada");
    });

    it("no debe modificar el array original", () => {
      const original = [...mockTasks];
      sortTasksByPriority(mockTasks);
      expect(mockTasks).toEqual(original);
    });

    it("debe manejar array vacío", () => {
      const sorted = sortTasksByPriority([]);
      expect(sorted).toEqual([]);
    });
  });

  describe("isTaskOverdue", () => {
    it("debe retornar true para tarea vencida no completada", () => {
      const task = {
        id: 1,
        dueDate: "2025-01-01",
        status: "Pendiente",
      };
      const currentDate = new Date("2026-01-01");
      expect(isTaskOverdue(task, currentDate)).toBe(true);
    });

    it("debe retornar false para tarea vencida pero completada", () => {
      const task = {
        id: 1,
        dueDate: "2025-01-01",
        status: "Completada",
      };
      const currentDate = new Date("2026-01-01");
      expect(isTaskOverdue(task, currentDate)).toBe(false);
    });

    it("debe retornar false para tarea sin fecha de vencimiento", () => {
      const task = { id: 1, status: "Pendiente" };
      const currentDate = new Date("2026-01-01");
      expect(isTaskOverdue(task, currentDate)).toBe(false);
    });

    it("debe retornar false para tarea no vencida", () => {
      const task = {
        id: 1,
        dueDate: "2027-01-01",
        status: "Pendiente",
      };
      const currentDate = new Date("2026-01-01");
      expect(isTaskOverdue(task, currentDate)).toBe(false);
    });
  });

  describe("validateTaskTitle", () => {
    it("debe validar un título correcto", () => {
      const result = validateTaskTitle("Título válido");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("debe rechazar título vacío", () => {
      const result = validateTaskTitle("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("El título no puede estar vacío");
    });

    it("debe rechazar título con solo espacios", () => {
      const result = validateTaskTitle("   ");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("El título no puede estar vacío");
    });

    it("debe rechazar título muy largo", () => {
      const longTitle = "a".repeat(101);
      const result = validateTaskTitle(longTitle);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("El título no puede exceder 100 caracteres");
    });

    it("debe aceptar título de exactamente 100 caracteres", () => {
      const title = "a".repeat(100);
      const result = validateTaskTitle(title);
      expect(result.valid).toBe(true);
    });

    it("debe rechazar null o undefined", () => {
      expect(validateTaskTitle(null).valid).toBe(false);
      expect(validateTaskTitle(undefined).valid).toBe(false);
    });
  });
});
