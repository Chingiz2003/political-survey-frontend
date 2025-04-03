import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/login", new URLSearchParams({
        username,
        password
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true
      });

      // Spring Security сохранит сессию в cookie
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/create-poll");
    } catch (err) {
      console.error("Ошибка входа:", err);
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Вход администратора</h2>
      <input
        type="text"
        placeholder="Логин"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ margin: "5px", padding: "8px", width: "200px" }}
      /><br />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ margin: "5px", padding: "8px", width: "200px" }}
      /><br />
      <button onClick={handleLogin} style={{ padding: "10px 20px", marginTop: "10px" }}>
        Войти
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
