import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, User, Github, Chrome } from "lucide-react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
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
};
const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 500,
  color: "var(--text-muted)",
};
const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
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
      }>(`${API_BASE}/auth/register`, {
        name,
        email,
        password,
      });
      const userName = data?.user?.name ?? data?.name ?? data?.userName ?? name;
      login(data?.token, userName ?? undefined);
      navigate("/", {
        replace: true,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          err.response?.data?.error ??
          err.message ??
          "Registration failed. Please try again.";
        setError(String(message));
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="style-12dc2f71">
      <div className="glass-panel animate-fade style-999b09a1">
        <div className="style-5128e0c3">
          <User size={30} color="white" />
        </div>

        <h1 className="style-d81a05f7">Create Account</h1>
        <p className="style-a6fafbb4">Enter your details to get started.</p>

        <form onSubmit={handleSubmit} className="style-45228dfd">
          <div className="style-685eb7ba">
            <label style={labelStyle}>Name</label>
            <div style={inputWrapStyle}>
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="style-685eb7ba">
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapStyle}>
              <Mail size={18} color="var(--text-muted)" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="style-685eb7ba">
            <label style={labelStyle}>Password</label>
            <div style={inputWrapStyle}>
              <Lock size={18} color="var(--text-muted)" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
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
            {isLoading ? "Creating account..." : "Sign Up"}
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
          Already have an account?{" "}
          <Link to="/login" className="style-0d5734fe">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
