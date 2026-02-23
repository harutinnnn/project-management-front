import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Settings,
  BarChart3,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const navItems = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    path: "/",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: Users,
    label: "Customers",
    path: "/customers",
  },
  {
    icon: FolderKanban,
    label: "Projects",
    path: "/projects",
  },
  {
    icon: CheckSquare,
    label: "Tasks",
    path: "/tasks",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    path: "/messages",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];
const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="sidebar glass-panel style-45fbeb0f">
      <div className="sidebar-header style-37cec7de">
        <div className="style-c17ea6bf">
          <div className="style-afe033e2" />
        </div>
        <span className="brand-text style-c9a3099e">ADIN PANEL</span>
      </div>

      <nav className="style-49cdf874">
        <ul className="style-0fe735eb">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path} className="style-ac79cce7">
                <Link
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    textDecoration: "none",
                    color: isActive ? "var(--text-main)" : "var(--text-muted)",
                    borderRadius: "12px",
                    backgroundColor: isActive
                      ? "rgba(124, 58, 237, 0.15)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(124, 58, 237, 0.3)"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                  className={isActive ? "" : "nav-hover"}
                >
                  <Icon
                    size={20}
                    color={isActive ? "var(--primary-color)" : "currentColor"}
                  />
                  <span
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer style-2049deb3">
        <button onClick={handleLogout} className="style-6be98035">
          <LogOut size={20} />
          <span className="style-b76fa7af">Logout</span>
        </button>
      </div>

      <style>{`
        .nav-hover:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};
export default Sidebar;
