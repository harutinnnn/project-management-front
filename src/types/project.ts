export interface Member {
  id: string;
  name: string;
  email?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  memberIds: string[];
  createdAt?: string;
  updatedAt?: string;
}
