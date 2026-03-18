import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      message
      token
      user {
        username
        email
        role
      }
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      token
      user {
        username
        email
        role
      }
    }
  }
`;

function AuthApp() {
  const [mode, setMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "resident",
  });

  const [signup] = useMutation(SIGNUP);
  const [login] = useMutation(LOGIN);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        const res = await signup({ variables: form });

        localStorage.setItem("token", res.data.signup.token);
        localStorage.setItem("user", JSON.stringify(res.data.signup.user));
        setCurrentUser(res.data.signup.user);

        alert(res.data.signup.message);
      } else {
        const res = await login({
          variables: {
            email: form.email,
            password: form.password,
          },
        });

        localStorage.setItem("token", res.data.login.token);
        localStorage.setItem("user", JSON.stringify(res.data.login.user));
        setCurrentUser(res.data.login.user);

        alert(res.data.login.message);
      }

      setForm({
        username: "",
        email: "",
        password: "",
        role: "resident",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);

    setForm({
      username: "",
      email: "",
      password: "",
      role: "resident",
    });

    alert("Logged out successfully");
  };

  return (
    <div style={{ color: "#111827" }}>
      <h2 style={{ marginBottom: "18px", fontSize: "2rem" }}>Authentication</h2>

      {currentUser ? (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #dbe3ef",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Logged In User</h3>
          <p>
            <strong>Username:</strong> {currentUser.username}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Role:</strong> {currentUser.role}
          </p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "10px",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#dc2626",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
            <button
              onClick={() => setMode("login")}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                background: mode === "login" ? "#2563eb" : "#dbeafe",
                color: mode === "login" ? "white" : "#1e3a8a",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Login
            </button>

            <button
              onClick={() => setMode("signup")}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                background: mode === "signup" ? "#2563eb" : "#dbeafe",
                color: mode === "signup" ? "white" : "#1e3a8a",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Signup
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {mode === "signup" && (
              <>
                <input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="resident">Resident</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="community_organizer">Community Organizer</option>
                </select>
              </>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <button
              type="submit"
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              {mode === "signup" ? "Create Account" : "Login"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box",
};

export default AuthApp;