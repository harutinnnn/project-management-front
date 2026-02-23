import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FolderKanban, Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
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
    const token = localStorage.getItem("authToken");
    axios
      .get<ProjectFromApi[]>(`${API_BASE}/project`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      })
      .then((res) => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        setProjects([]);
        setError(
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Failed to load projects.",
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
    if (!window.confirm("Delete this project?")) return;
    const token = localStorage.getItem("authToken");
    const idNum = typeof id === "number" ? id : parseInt(String(id), 10);
    if (Number.isNaN(idNum)) return;
    axios
      .delete(`${API_BASE}/project/delete`, {
        data: {
          id: idNum,
        },
        headers: {
          "Content-Type": "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      })
      .then(() => {
        setProjects((prev) => prev.filter((p) => String(p.id) !== String(id)));
      })
      .catch(() => {});
  };
  const getMemberDisplay = (members: ProjectFromApi["members"]) => {
    if (!members || !Array.isArray(members)) return "—";
    if (members.length === 0) return "—";
    const first = members[0];
    if (typeof first === "object" && first !== null && "name" in first) {
      return (
        (members as ProjectMember[])
          .map((m) => m.name)
          .filter(Boolean)
          .join(", ") || "—"
      );
    }
    return `${members.length} member(s)`;
  };
  return (
    <div className="animate-fade">
      <div className="style-9fd65ce1">
        <div>
          <h1 className="style-d81a05f7">Projects</h1>
          <p className="style-7abb3a4e">Manage your projects and members.</p>
        </div>
        <Link to="/projects/new" className="style-e693b674">
          <Plus size={20} />
          New Project
        </Link>
      </div>

      <div className="glass-panel style-6da4fc46">
        <table className="style-91f0dac5">
          <thead>
            <tr className="style-07d85e0b">
              <th className="style-1cfc8592">Title</th>
              <th className="style-1cfc8592">Description</th>
              <th className="style-1cfc8592">Members</th>
              <th className="style-66f7ce86">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="style-fa1abed7">
                  Loading projects...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="style-fe36f44e">
                  {error}
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="style-fa1abed7">
                  No projects yet. Create one to get started.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr
                  key={String(p.id)}
                  onClick={() => navigate(`/projects/${p.id}/edit`)}
                  className="nav-hover style-cacb50e5"
                >
                  <td className="style-0a87ebfc">
                    <div className="style-8bbd91c2">
                      <div className="style-d3cfe1cc">
                        <FolderKanban size={18} color="var(--primary-color)" />
                      </div>
                      <span className="style-d2abfb71">{p.title}</span>
                    </div>
                  </td>
                  <td className="style-a6bdc212">{p.description || "—"}</td>
                  <td className="style-6ea92fab">
                    {getMemberDisplay(p.members)}
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="style-0a87ebfc"
                  >
                    <div className="style-d2afe5e3">
                      <Link
                        to={`/projects/${p.id}/edit`}
                        aria-label="Edit"
                        className="style-d00cb651"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, p.id)}
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
export default ProjectsList;
