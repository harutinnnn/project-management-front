import type { Task } from "../types/task";

const TASKS_KEY = "adin_tasks";

export function getTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id);
}

export function saveTask(task: Task): void {
  const list = getTasks();
  const index = list.findIndex((t) => t.id === task.id);
  const now = new Date().toISOString();
  const toSave: Task = {
    ...task,
    updatedAt: now,
    createdAt: task.createdAt ?? now,
  };
  if (index >= 0) {
    list[index] = toSave;
  } else {
    list.push(toSave);
  }
  saveTasks(list);
}

export function deleteTask(id: string): void {
  saveTasks(getTasks().filter((t) => t.id !== id));
}

export { getMembers } from "./projectsStorage";
