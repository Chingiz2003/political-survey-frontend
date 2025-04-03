import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [iin, setIin] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");

    if (!isLoggedIn || !token) {
      navigate("/");
      return;
    }

    // Получаем актуальный ИИН из API
    axios.get("http://localhost:8080/api/citizens/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setIin(res.data.iin);
    })
    .catch(err => {
      console.error("Ошибка получения профиля:", err);
      navigate("/"); // Если токен невалидный — возвращаем на вход
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("iin");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const goToPolls = () => {
    navigate("/polls");
  };

  const goToCitizenProfile = () => {
    navigate("/me");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Добро пожаловать!</h1>
      <p>Вы успешно вошли с ИИН: {iin ? iin : "Загрузка..."}</p>

      <button
        onClick={goToPolls}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Перейти к опросам
      </button>

      <button
        onClick={goToCitizenProfile}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Перейти к профилю
      </button>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default Dashboard;
