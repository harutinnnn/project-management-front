import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

interface ProjectMember {
  id?: number;
  name?: string;
}

interface ProjectFromApi {
  id: number | string;
  title: string;
  description?: string;
  members?: number[] | ProjectMember[];
}

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    axios
      .get<ProjectFromApi[]>(`${API_BASE}/project`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        setProjects([]);
        setError(
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : 'Failed to load projects.'
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = (e: React.MouseEvent, id: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this project?')) return;
    const token = localStorage.getItem('authToken');
    const idNum = typeof id === 'number' ? id : parseInt(String(id), 10);
    if (Number.isNaN(idNum)) return;
    axios
      .delete(`${API_BASE}/project/delete`, {
        data: { id: idNum },
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
      .then(() => {
        setProjects((prev) => prev.filter((p) => String(p.id) !== String(id)));
      })
      .catch(() => {});
  };

  const getMemberDisplay = (members: ProjectFromApi['members']) => {
    if (!members || !Array.isArray(members)) return '—';
    if (members.length === 0) return '—';
    const first = members[0];
    if (typeof first === 'object' && first !== null && 'name' in first) {
      return (members as ProjectMember[]).map((m) => m.name).filter(Boolean).join(', ') || '—';
    }
    return `${members.length} member(s)`;
  };

  return (
    <div className="animate-fade">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your projects and members.</p>
        </div>
        <Link
          to="/projects/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'var(--primary-color)',
            color: 'white',
            borderRadius: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={20} />
          New Project
        </Link>
      </div>

      <div
        className="glass-panel"
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: 'var(--glass-border)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: 'var(--glass-border)',
              }}
            >
              <th
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                }}
              >
                Title
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                }}
              >
                Members
              </th>
              <th
                style={{
                  width: '100px',
                  padding: '1rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  Loading projects...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#fca5a5',
                  }}
                >
                  {error}
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  No projects yet. Create one to get started.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr
                  key={String(p.id)}
                  style={{
                    borderBottom: 'var(--glass-border)',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/projects/${p.id}/edit`)}
                  className="nav-hover"
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'rgba(124, 58, 237, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FolderKanban size={18} color="var(--primary-color)" />
                      </div>
                      <span style={{ fontWeight: 500 }}>{p.title}</span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '1rem 1.25rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      maxWidth: '320px',
                    }}
                  >
                    {p.description || '—'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem' }}>
                    {getMemberDisplay(p.members)}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Link
                        to={`/projects/${p.id}/edit`}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          color: 'var(--text-muted)',
                          background: 'rgba(255,255,255,0.05)',
                        }}
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, p.id)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          color: '#f87171',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        aria-label="Delete"
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

export default ProjectsList;
