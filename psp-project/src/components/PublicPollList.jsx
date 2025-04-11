import React, { useEffect, useState } from "react";
import axios from "axios";

const PublicPollList = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/polls/public")
      .then(res => setPolls(res.data))
      .catch(() => setError("Не удалось загрузить опросы"));
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Доступные опросы</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {polls.length === 0 ? (
        <p>Нет доступных опросов</p>
      ) : (
        polls.map(poll => (
          <div key={poll.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
            <h3>{poll.title}</h3>
            <p><strong>Описание:</strong> {poll.description}</p>
            <p><strong>Тип:</strong> {poll.anonymous ? "Анонимный" : "Именной"}</p>
            <p><strong>Статус:</strong> {poll.status}</p>

            {poll.questions.map(q => (
              <div key={q.id} style={{ marginTop: "10px" }}>
                <p><strong>Вопрос:</strong> {q.text}</p>
                <ul>
                  {q.options.map(opt => (
                    <li key={opt.id}>{opt.orderIndex}. {opt.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PublicPollList;
