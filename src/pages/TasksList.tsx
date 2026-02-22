import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Plus, Pencil, Trash2 } from 'lucide-react';
import { getTasks, deleteTask, getMembers } from '../data/tasksStorage';
import type { Task, TaskPriority, TaskStatus } from '../types/task';

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const priorityColors: Record<TaskPriority, string> = {
  low: 'var(--text-muted)',
  medium: '#f59e0b',
  high: '#ef4444',
};

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  doing: 'Doing',
  finished: 'Finished',
};

const statusColors: Record<TaskStatus, string> = {
  pending: '#f59e0b',
  doing: '#3b82f6',
  finished: '#10b981',
};

const TasksList: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const members = useMemo(() => getMembers(), []);

  const refresh = () => setTasks(getTasks());

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this task?')) return;
    deleteTask(id);
    refresh();
  };

  const getMemberNames = (memberIds: string[]) => {
    return memberIds
      .map((id) => members.find((m) => m.id === id)?.name)
      .filter(Boolean)
      .join(', ') || '—';
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
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage tasks, priority, and status.</p>
        </div>
        <Link
          to="/tasks/new"
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
          New Task
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
              <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Description</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Priority</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Members</th>
              <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Attachments</th>
              <th style={{ width: '100px', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tasks yet. Create one to get started.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: 'var(--glass-border)', cursor: 'pointer' }}
                  onClick={() => navigate(`/tasks/${t.id}/edit`)}
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
                        <CheckSquare size={18} color="var(--primary-color)" />
                      </div>
                      <span style={{ fontWeight: 500 }}>{t.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '240px' }}>
                    {t.description ? (t.description.length > 60 ? `${t.description.slice(0, 60)}…` : t.description) : '—'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ color: priorityColors[t.priority], fontWeight: 500, fontSize: '0.9rem' }}>
                      {priorityLabels[t.priority]}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        background: `${statusColors[t.status]}22`,
                        color: statusColors[t.status],
                      }}
                    >
                      {statusLabels[t.status]}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem' }}>
                    {getMemberNames(t.memberIds || [])}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {t.attachments?.length ? `${t.attachments.length} file(s)` : '—'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Link
                        to={`/tasks/${t.id}/edit`}
                        style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, t.id)}
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

export default TasksList;
