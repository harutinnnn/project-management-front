import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, Github, Chrome } from "lucide-react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { data } = await axios.post<{
        token?: string;
        user?: {
          name?: string;
        };
        name?: string;
        userName?: string;
      }>(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      const name = data?.user?.name ?? data?.name ?? data?.userName ?? null;
      login(data?.token, name ?? undefined);
      navigate(from, {
        replace: true,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message ??
          "Login failed. Please try again.";
        setError(String(message));
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="style-12dc2f71">
      <div className="glass-panel animate-fade style-999b09a1">
        <div className="style-5128e0c3">
          <Lock size={30} color="white" />
        </div>

        <h1 className="style-d81a05f7">Welcome Back</h1>
        <p className="style-a6fafbb4">Please enter your details to sign in.</p>

        <form onSubmit={handleSubmit} className="style-45228dfd">
          <div className="style-685eb7ba">
            <label className="style-d06d605a">Email Address</label>
            <div className="style-51e6a503">
              <Mail size={18} color="var(--text-muted)" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adin.com"
                className="style-7c655fe9"
              />
            </div>
          </div>

          <div className="style-685eb7ba">
            <label className="style-d06d605a">Password</label>
            <div className="style-51e6a503">
              <Lock size={18} color="var(--text-muted)" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="style-7c655fe9"
              />
            </div>
          </div>

          {error && <div className="style-678672d5">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: "var(--primary-color)",
              color: "white",
              border: "none",
              padding: "1rem",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "1rem",
              transition: "all 0.2s ease",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="style-0636e433">
          <div className="style-dbbe3529" />
          <span className="style-bd308a19">OR CONTINUE WITH</span>
          <div className="style-dbbe3529" />
        </div>

        <div className="style-0ba2053e">
          <button className="style-d8478dba">
            <Chrome size={18} />
            Google
          </button>
          <button className="style-d8478dba">
            <Github size={18} />
            Github
          </button>
        </div>

        <p className="style-918608d5">
          Don't have an account?{" "}
          <Link to="/register" className="style-a054d01b">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
