import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Paperclip, MessageSquare, X, FolderKanban } from 'lucide-react';
import axios from 'axios';
import { getTaskById, saveTask } from '../data/tasksStorage';
import type { Task, TaskPriority, TaskStatus, TaskAttachment, TaskComment } from '../types/task';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

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
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  border: 'var(--glass-border)',
  borderRadius: '12px',
  padding: '0 1rem',
};

const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  padding: '1rem',
  width: '100%',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 500,
  color: 'var(--text-muted)',
  marginBottom: '0.5rem',
  display: 'block',
};

const selectStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: 'var(--glass-border)',
  borderRadius: '12px',
  color: 'white',
  padding: '0.75rem 1rem',
  width: '100%',
  outline: 'none',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
};

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [members, setMembers] = useState<MemberOption[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get<MemberOption[] | { id: number; name: string; email?: string }[]>(`${API_BASE}/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setMembers(list.map((u) => ({ id: String(u.id), name: u.name ?? '', email: u.email })));
      })
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get<ProjectOption[]>(`${API_BASE}/project`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setProjects(list.map((p) => ({ id: p.id, title: p.title || String(p.id) })));
      })
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      const task = getTaskById(id);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setProjectId(task.projectId ?? '');
        setPriority(task.priority);
        setAttachments(task.attachments || []);
        setMemberIds(task.memberIds || []);
        setStatus(task.status);
        setComments(task.comments || []);
      } else {
        setError('Task not found');
      }
    }
  }, [isEdit, id]);

  const toggleMember = (memberId: string) => {
    setMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((m) => m !== memberId) : [...prev, memberId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newAttachments: TaskAttachment[] = Array.from(files).map((file) => ({
      id: `att_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: file.name,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  const addComment = () => {
    const text = newComment.trim();
    if (!text) return;
    const userName = localStorage.getItem('userName');
    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: userName || undefined,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewComment('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required.');
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
      navigate('/tasks', { replace: true });
      return;
    }

    try {
      const body: {
        title: string;
        description: string;
        projectId?: number;
        priority: TaskPriority;
        status: TaskStatus;
        members?: number[];
        attachments?: { name: string }[];
      } = {
        title: trimmedTitle,
        description: description.trim(),
        priority,
        status,
      };
      if (projectId) {
        const pid = parseInt(projectId, 10);
        if (!Number.isNaN(pid)) body.projectId = pid;
      }
      if (memberIds.length > 0) {
        body.members = memberIds
          .map((id) => parseInt(id, 10))
          .filter((n) => !Number.isNaN(n));
      }
      const filteredAttachments = attachments.filter((a) => a.name?.trim());
      if (filteredAttachments.length > 0) {
        body.attachments = filteredAttachments.map((a) => ({ name: a.name }));
      }
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/tasks/create`, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      navigate('/tasks', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message ??
          'Failed to create task.';
        setError(String(message));
      } else {
        setError('Failed to create task.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/tasks"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft size={18} />
          Back to Tasks
        </Link>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Task' : 'New Task'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {isEdit ? 'Update task details, status, and comments.' : 'Create a new task with priority and members.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{
          maxWidth: '720px',
          padding: '2rem',
          borderRadius: '16px',
          border: 'var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Loading projects...</span>
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
                resize: 'vertical',
                minHeight: '80px',
                padding: '1rem',
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'var(--glass-border)',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Paperclip size={18} />
              Attachments
            </label>
            <div
              style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: 'var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'var(--glass-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              />
              {attachments.length > 0 && (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {attachments.map((a) => (
                    <li
                      key={a.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(a.id)}
                        style={{
                          padding: '0.25rem',
                          color: '#f87171',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        aria-label="Remove file"
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
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} />
              Members
            </label>
            {membersLoading && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Loading users...</p>
            )}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: 'var(--glass-border)',
              }}
            >
              {members.map((m) => {
                const selected = memberIds.includes(m.id);
                return (
                  <label
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      background: selected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: selected ? '1px solid rgba(124, 58, 237, 0.5)' : 'var(--glass-border)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleMember(m.id)}
                      style={{ accentColor: 'var(--primary-color)' }}
                    />
                    <span>{m.name}</span>
                    {m.email && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> ({m.email})</span>
                    )}
                  </label>
                );
              })}
            </div>
            {!membersLoading && members.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>No users available.</p>
            )}
          </div>

          {isEdit && (
            <div>
              <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} />
                Comments
              </label>
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: 'var(--glass-border)',
                }}
              >
                {comments.length > 0 && (
                  <ul style={{ listStyle: 'none', margin: '0 0 1rem 0', padding: 0 }}>
                    {comments.map((c) => (
                      <li
                        key={c.id}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          borderLeft: '3px solid var(--primary-color)',
                        }}
                      >
                        {c.author && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            {c.author}
                          </div>
                        )}
                        <div style={{ fontSize: '0.9rem' }}>{c.text}</div>
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addComment())}
                    placeholder="Add a comment..."
                    style={{ ...inputStyle, flex: 1, padding: '0.6rem 0.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={addComment}
                    style={{
                      padding: '0.6rem 1rem',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                color: '#fca5a5',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
            </button>
            <Link
              to="/tasks"
              style={{
                padding: '0.75rem 1.5rem',
                color: 'var(--text-muted)',
                borderRadius: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                border: 'var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
