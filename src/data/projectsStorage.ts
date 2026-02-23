import type { Project, Member } from "../types/project";

const PROJECTS_KEY = "adin_projects";
const MEMBERS_KEY = "adin_members";

export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function saveProject(project: Project): void {
  const list = getProjects();
  const index = list.findIndex((p) => p.id === project.id);
  const now = new Date().toISOString();
  const toSave = {
    ...project,
    updatedAt: now,
    createdAt: project.createdAt ?? now,
  };
  if (index >= 0) {
    list[index] = { ...list[index], ...toSave };
  } else {
    list.push(toSave);
  }
  saveProjects(list);
}

export function deleteProject(id: string): void {
  saveProjects(getProjects().filter((p) => p.id !== id));
}

// Mock members – can be replaced with API later
const DEFAULT_MEMBERS: Member[] = [
  { id: "1", name: "Alex Rivers", email: "alex@example.com" },
  { id: "2", name: "Jordan Lee", email: "jordan@example.com" },
  { id: "3", name: "Sam Taylor", email: "sam@example.com" },
  { id: "4", name: "Casey Morgan", email: "casey@example.com" },
];

export function getMembers(): Member[] {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(DEFAULT_MEMBERS));
    return DEFAULT_MEMBERS;
  } catch {
    return DEFAULT_MEMBERS;
  }
}
