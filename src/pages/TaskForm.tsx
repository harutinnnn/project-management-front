import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  Paperclip,
  MessageSquare,
  X,
  FolderKanban,
} from "lucide-react";
import axios from "axios";
import { getTaskById, saveTask } from "../data/tasksStorage";
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskAttachment,
  TaskComment,
} from "../types/task";
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
interface ProjectOption {
  id: number | string;
  title: string;
}
interface MemberOption {
  id: string;
  name: string;
  email?: string;
}
const inputWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.05)",
  border: "var(--glass-border)",
  borderRadius: "12px",
  padding: "0 1rem",
};
const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "white",
  padding: "1rem",
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 500,
  color: "var(--text-muted)",
  marginBottom: "0.5rem",
  display: "block",
};
const selectStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "var(--glass-border)",
  borderRadius: "12px",
  color: "white",
  padding: "0.75rem 1rem",
  width: "100%",
  outline: "none",
  fontSize: "0.9rem",
  fontFamily: "inherit",
};
const TaskForm: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get<
        | MemberOption[]
        | {
          id: number;
          name: string;
          email?: string;
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
        setMembers(
          list.map((u) => ({
            id: String(u.id),
            name: u.name ?? "",
            email: u.email,
          })),
        );
      })
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get<ProjectOption[]>(`${API_BASE}/project`, {
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {},
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setProjects(
          list.map((p) => ({
            id: p.id,
            title: p.title || String(p.id),
          })),
        );
      })
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, []);
  useEffect(() => {
    if (isEdit && id) {
      const task = getTaskById(id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setProjectId(task.projectId ?? "");
        setPriority(task.priority);
        setAttachments(task.attachments || []);
        setMemberIds(task.memberIds || []);
        setStatus(task.status);
        setComments(task.comments || []);
      } else {
        setError("Task not found");
      }
    }
  }, [isEdit, id]);
  const toggleMember = (memberId: string) => {
    setMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((m) => m !== memberId)
        : [...prev, memberId],
    );
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newAttachments: TaskAttachment[] = Array.from(files).map((file) => ({
      id: `att_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: file.name,
      file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };
  const removeAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };
  const addComment = () => {
    const text = newComment.trim();
    if (!text) return;
    const userName = localStorage.getItem("userName");
    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: userName || undefined,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    if (isEdit) {
      const task: Task = {
        id: id!,
        title: trimmedTitle,
        description: description.trim(),
        projectId: projectId || undefined,
        priority,
        attachments: attachments.filter((a) => a.name?.trim()),
        memberIds,
        status,
        comments,
      };
      saveTask(task);
      setSaving(false);
      navigate("/tasks", {
        replace: true,
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("description", description.trim());
      formData.append("priority", priority);
      formData.append("status", status);

      if (projectId) {
        const pid = parseInt(projectId, 10);
        if (!Number.isNaN(pid)) formData.append("projectId", String(pid));
      }

      if (memberIds.length > 0) {
        const validMemberIds = memberIds
          .map((id) => parseInt(id, 10))
          .filter((n) => !Number.isNaN(n));

        // Append members (assumed to be parsed as array or repeated keys on the backend)
        // Appending both format to be safe, usually frameworks parse `members[]` natively to array
        validMemberIds.forEach((id) => {
          formData.append("members[]", String(id));
          formData.append("members", String(id));
        });
      }

      const filteredAttachments = attachments.filter((a) => a.name?.trim());
      if (filteredAttachments.length > 0) {
        filteredAttachments.forEach((a) => {
          if (a.file) {
            formData.append("attachments", a.file, a.name);
          } else {
            // In case there are already existing attachments being resubmitted
            // We can just append their names or skip, depending on what the API expects
            // For a new task though, they act as new files
          }
        });
      }

      const token = localStorage.getItem("authToken");
      await axios.post(`${API_BASE}/tasks/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });
      navigate("/tasks", {
        replace: true,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message ??
          "Failed to create task.";
        setError(String(message));
      } else {
        setError("Failed to create task.");
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="animate-fade">
      <div className="style-2579959f">
        <Link to="/tasks" className="style-c3bf8150">
          <ArrowLeft size={18} />
          Back to Tasks
        </Link>
        <h1 className="style-d81a05f7">{isEdit ? "Edit Task" : "New Task"}</h1>
        <p className="style-7abb3a4e">
          {isEdit
            ? "Update task details, status, and comments."
            : "Create a new task with priority and members."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel style-4586b0d7">
        <div className="style-2ee324e7">
          <div>
            <label style={labelStyle}>Title</label>
            <div style={inputWrapStyle}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label
              style={{
                ...labelStyle,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FolderKanban size={18} />
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              style={selectStyle}
              disabled={projectsLoading}
            >
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>
                  {p.title}
                </option>
              ))}
            </select>
            {projectsLoading && (
              <span className="style-e7f17e77">Loading projects...</span>
            )}
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "80px",
                padding: "1rem",
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "var(--glass-border)",
              }}
            />
          </div>

          <div className="style-85f50244">
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                style={selectStyle}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                style={selectStyle}
              >
                <option value="pending">Pending</option>
                <option value="doing">Doing</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                ...labelStyle,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Paperclip size={18} />
              Attachments
            </label>
            <div className="style-8a0072ea">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="style-aa3a476e"
              />
              {attachments.length > 0 && (
                <ul className="style-17248001">
                  {attachments.map((a) => (
                    <li key={a.id} className="style-0c0d09ef">
                      <span className="style-5742a96c">{a.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(a.id)}
                        aria-label="Remove file"
                        className="style-90434f11"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                ...labelStyle,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <UserPlus size={18} />
              Members
            </label>
            {membersLoading && (
              <p className="style-5d3d6942">Loading users...</p>
            )}
            <div className="style-1357d665">
              {members.map((m) => {
                const selected = memberIds.includes(m.id);
                return (
                  <label
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "10px",
                      background: selected
                        ? "rgba(124, 58, 237, 0.2)"
                        : "rgba(255, 255, 255, 0.05)",
                      border: selected
                        ? "1px solid rgba(124, 58, 237, 0.5)"
                        : "var(--glass-border)",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleMember(m.id)}
                      className="style-ae9c3767"
                    />
                    <span>{m.name}</span>
                    {m.email && (
                      <span className="style-ad231d66"> ({m.email})</span>
                    )}
                  </label>
                );
              })}
            </div>
            {!membersLoading && members.length === 0 && (
              <p className="style-dd01a909">No users available.</p>
            )}
          </div>

          {isEdit && (
            <div>
              <label
                style={{
                  ...labelStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <MessageSquare size={18} />
                Comments
              </label>
              <div className="style-2813b527">
                {comments.length > 0 && (
                  <ul className="style-5e13bc02">
                    {comments.map((c) => (
                      <li key={c.id} className="style-73158421">
                        {c.author && (
                          <div className="style-15c1ea9f">{c.author}</div>
                        )}
                        <div className="style-33dd45cd">{c.text}</div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="style-5fa1c6fb">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addComment())
                    }
                    placeholder="Add a comment..."
                    style={{
                      ...inputStyle,
                      flex: 1,
                      padding: "0.6rem 0.75rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={addComment}
                    className="style-36869b77"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && <div className="style-678672d5">{error}</div>}

          <div className="style-9ee89ba3">
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.75rem 1.5rem",
                background: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
            </button>
            <Link to="/tasks" className="style-40b5a615">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
export default TaskForm;
