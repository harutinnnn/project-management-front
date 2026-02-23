import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { getTasks, deleteTask } from "../data/tasksStorage";
import type { Task, TaskPriority, TaskStatus } from "../types/task";
interface UserOption {
  id: string;
  name: string;
}
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
const priorityColors: Record<TaskPriority, string> = {
  low: "var(--text-muted)",
  medium: "#f59e0b",
  high: "#ef4444",
};
const statusLabels: Record<TaskStatus, string> = {
  pending: "Pending",
  doing: "Doing",
  finished: "Finished",
};
const statusColors: Record<TaskStatus, string> = {
  pending: "#f59e0b",
  doing: "#3b82f6",
  finished: "#10b981",
};
const TasksList: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [projectTitles, setProjectTitles] = useState<Record<string, string>>(
    {},
  );
  const [users, setUsers] = useState<UserOption[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get<
        {
          id: number | string;
          title: string;
        }[]
      >(`${API_BASE}/project`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const map: Record<string, string> = {};
        list.forEach((p) => {
          map[String(p.id)] = p.title || String(p.id);
        });
        setProjectTitles(map);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get<
        {
          id: number;
          name: string;
        }[]
      >(`${API_BASE}/users`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setUsers(
          list.map((u) => ({
            id: String(u.id),
            name: u.name ?? "",
          })),
        );
      })
      .catch(() => setUsers([]));
  }, []);
  const refresh = () => setTasks(getTasks());
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this task?")) return;
    deleteTask(id);
    refresh();
  };
  const getMemberNames = (memberIds: string[]) => {
    return (
      memberIds
        .map((id) => users.find((u) => u.id === id)?.name)
        .filter(Boolean)
        .join(", ") || "—"
    );
  };
  return (
    <div className="animate-fade">
      <div className="style-9fd65ce1">
        <div>
          <h1 className="style-d81a05f7">Tasks</h1>
          <p className="style-7abb3a4e">Manage tasks, priority, and status.</p>
        </div>
        <Link to="/tasks/new" className="style-e693b674">
          <Plus size={20} />
          New Task
        </Link>
      </div>

      <div className="glass-panel style-6da4fc46">
        <table className="style-91f0dac5">
          <thead>
            <tr className="style-07d85e0b">
              <th className="style-1cfc8592">Title</th>
              <th className="style-1cfc8592">Project</th>
              <th className="style-1cfc8592">Description</th>
              <th className="style-1cfc8592">Priority</th>
              <th className="style-1cfc8592">Status</th>
              <th className="style-1cfc8592">Members</th>
              <th className="style-1cfc8592">Attachments</th>
              <th className="style-66f7ce86">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="style-fa1abed7">
                  No tasks yet. Create one to get started.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tasks/${t.id}/edit`)}
                  className="nav-hover style-cacb50e5"
                >
                  <td className="style-0a87ebfc">
                    <div className="style-8bbd91c2">
                      <div className="style-d3cfe1cc">
                        <CheckSquare size={18} color="var(--primary-color)" />
                      </div>
                      <span className="style-d2abfb71">{t.title}</span>
                    </div>
                  </td>
                  <td className="style-6ea92fab">
                    {t.projectId
                      ? (projectTitles[t.projectId] ?? t.projectId)
                      : "—"}
                  </td>
                  <td className="style-f8811e28">
                    {t.description
                      ? t.description.length > 60
                        ? `${t.description.slice(0, 60)}…`
                        : t.description
                      : "—"}
                  </td>
                  <td className="style-0a87ebfc">
                    <span
                      style={{
                        color: priorityColors[t.priority],
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {priorityLabels[t.priority]}
                    </span>
                  </td>
                  <td className="style-0a87ebfc">
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        background: `${statusColors[t.status]}22`,
                        color: statusColors[t.status],
                      }}
                    >
                      {statusLabels[t.status]}
                    </span>
                  </td>
                  <td className="style-6ea92fab">
                    {getMemberNames(t.memberIds || [])}
                  </td>
                  <td className="style-f1ca1bab">
                    {t.attachments?.length
                      ? `${t.attachments.length} file(s)`
                      : "—"}
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="style-0a87ebfc"
                  >
                    <div className="style-d2afe5e3">
                      <Link
                        to={`/tasks/${t.id}/edit`}
                        aria-label="Edit"
                        className="style-d00cb651"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, t.id)}
                        aria-label="Delete"
                        className="style-f6f6c511"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TasksList;
