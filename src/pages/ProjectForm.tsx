import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import axios from 'axios';
import {
  getProjectById,
  saveProject,
} from '../data/projectsStorage';
import type { Project, Member } from '../types/project';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

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

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get<Member[] | { id: number; name: string; email?: string }[]>(`${API_BASE}/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setMembers(
          list.map((u) => ({
            id: String(u.id),
            name: u.name ?? '',
            email: u.email,
          }))
        );
      })
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      const project = getProjectById(id);
      if (project) {
        setTitle(project.title);
        setDescription(project.description || '');
        setMemberIds(project.memberIds || []);
      } else {
        setError('Project not found');
      }
    }
  }, [isEdit, id]);

  const toggleMember = (memberId: string) => {
    setMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((m) => m !== memberId)
        : [...prev, memberId]
    );
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
      const project: Project = {
        id: id!,
        title: trimmedTitle,
        description: description.trim(),
        memberIds,
      };
      saveProject(project);
      setSaving(false);
      navigate('/projects', { replace: true });
      return;
    }

    try {
      const body: { title: string; description: string; members?: number[] } = {
        title: trimmedTitle,
        description: description.trim(),
      };
      if (memberIds.length > 0) {
        body.members = memberIds
          .map((id) => parseInt(id, 10))
          .filter((n) => !Number.isNaN(n));
      }
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE}/project/create`, body, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      navigate('/projects', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message ??
          'Failed to create project.';
        setError(String(message));
      } else {
        setError('Failed to create project.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/projects"
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
          Back to Projects
        </Link>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Project' : 'New Project'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {isEdit ? 'Update project details and members.' : 'Create a new project and attach members.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{
          maxWidth: '640px',
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
                placeholder="Project title"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project..."
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '100px',
                padding: '1rem',
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'var(--glass-border)',
              }}
            />
          </div>

          <div>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} />
              Attach Members
            </label>
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
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        ({m.email})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            {membersLoading && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Loading users...
              </p>
            )}
            {!membersLoading && members.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                No users available.
              </p>
            )}
          </div>

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
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create project'}
            </button>
            <Link
              to="/projects"
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

export default ProjectForm;
