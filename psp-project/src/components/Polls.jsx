import React, { useEffect, useState } from "react";
import axios from "axios";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Вы не авторизованы.");
      return;
    }

    axios.get("http://localhost:8080/api/polls", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setPolls(res.data);
    })
    .catch(err => {
      console.error("Ошибка получения опросов:", err);
      setError("Ошибка загрузки опросов. Возможно, истёк токен.");
    });
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Список опросов</h2>
      {polls.length === 0 ? (
        <p>Опросы не найдены.</p>
      ) : (
        <ul>
          {polls.map(poll => (
            <li key={poll.id}>
              <strong>{poll.title}</strong><br />
              <span>{poll.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PollList;
