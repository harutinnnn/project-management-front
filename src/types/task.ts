export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "doing" | "finished";

export interface TaskAttachment {
  id: string;
  name: string;
  url?: string;
  file?: File;
}

export interface TaskComment {
  id: string;
  author?: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  priority: TaskPriority;
  attachments: TaskAttachment[];
  memberIds: string[];
  status: TaskStatus;
  comments: TaskComment[];
  createdAt?: string;
  updatedAt?: string;
}
