import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPollList = () => {
  const [polls, setPolls] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/polls", { withCredentials: true })
      .then(res => setPolls(res.data))
      .catch(() => setMessage("Ошибка загрузки опросов"));
  }, []);

  const handleClose = async (pollId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/polls/close/${pollId}`, {}, { withCredentials: true });
      setMessage("Опрос успешно завершён");
      setPolls(prev => prev.map(p => p.id === pollId ? { ...p, status: "CLOSED" } : p));
    } catch (err) {
      console.error("Ошибка завершения опроса:", err);
      setMessage("Ошибка завершения опроса");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Мои опросы</h2>
      {message && <p style={{ color: message.includes("успешно") ? "green" : "red" }}>{message}</p>}

      {polls.length === 0 ? (
        <p>Нет созданных опросов</p>
      ) : (
        polls.map(poll => (
          <div key={poll.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
            <h3>{poll.title}</h3>
            <p><strong>Описание:</strong> {poll.description}</p>
            <p><strong>Статус:</strong> {poll.status}</p>

            {poll.status === "ACTIVE" && (
              <button onClick={() => handleClose(poll.id)}>Завершить опрос</button>
            )}

            {poll.status === "CLOSED" && (
              <p style={{ color: "gray" }}>Опрос завершён</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPollList;
