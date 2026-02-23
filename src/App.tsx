import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectsList from "./pages/ProjectsList";
import ProjectForm from "./pages/ProjectForm";
import TasksList from "./pages/TasksList";
import TaskForm from "./pages/TaskForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Placeholder components for other routes
const Customers = () => (
  <div className="animate-fade">
    <h1>Customers</h1>
    <p className="style-7abb3a4e">Customer management table goes here.</p>
  </div>
);
const Messages = () => (
  <div className="animate-fade">
    <h1>Messages</h1>
    <p className="style-7abb3a4e">Inbox and communication center.</p>
  </div>
);
const Settings = () => (
  <div className="animate-fade">
    <h1>Settings</h1>
    <p className="style-7abb3a4e">System and profile configurations.</p>
  </div>
);
function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/projects" element={<ProjectsList />} />
                <Route path="/projects/new" element={<ProjectForm />} />
                <Route path="/projects/:id/edit" element={<ProjectForm />} />
                <Route path="/tasks" element={<TasksList />} />
                <Route path="/tasks/new" element={<TaskForm />} />
                <Route path="/tasks/:id/edit" element={<TaskForm />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/settings" element={<Settings />} />
                {/* Catch all for dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
