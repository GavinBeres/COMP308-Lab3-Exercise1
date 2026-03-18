import { useState } from "react";
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
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "resident",
  });

  const [signup] = useMutation(SIGNUP);
  const [login] = useMutation(LOGIN);

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
        alert(res.data.login.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", color: "black" }}>
      <h2>Auth Micro Frontend</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button onClick={() => setMode("login")}>Login</button>
        <button onClick={() => setMode("signup")}>Signup</button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "350px" }}
      >
        {mode === "signup" && (
          <>
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <select name="role" onChange={handleChange} defaultValue="resident">
              <option value="resident">Resident</option>
              <option value="business_owner">Business Owner</option>
              <option value="community_organizer">Community Organizer</option>
            </select>
          </>
        )}

        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <button type="submit">
          {mode === "signup" ? "Signup" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthApp;