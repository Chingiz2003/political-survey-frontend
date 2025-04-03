import React, { useEffect, useState } from "react";
import axios from "axios";

const CitizenProfile = () => {
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Вы не авторизованы.");
      setLoading(false);
      return;
    }

    axios.get("http://localhost:8080/api/citizens/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setCitizen(res.data);
    })
    .catch(err => {
      console.error("Ошибка загрузки профиля:", err);
      setError("Не удалось загрузить данные профиля.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Загрузка профиля...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Профиль гражданина</h2>
      <table style={{ width: "100%", fontSize: "16px", lineHeight: "1.6" }}>
        <tbody>
          <tr>
            <td><strong>ФИО:</strong></td>
            <td>{citizen.fullName}</td>
          </tr>
          <tr>
            <td><strong>ИИН:</strong></td>
            <td>{citizen.iin}</td>
          </tr>
          <tr>
            <td><strong>Дата рождения:</strong></td>
            <td>{citizen.birthDate}</td>
          </tr>
          <tr>
            <td><strong>Место рождения:</strong></td>
            <td>{citizen.birthPlace}</td>
          </tr>
          <tr>
            <td><strong>Национальность:</strong></td>
            <td>{citizen.nationality}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CitizenProfile;
