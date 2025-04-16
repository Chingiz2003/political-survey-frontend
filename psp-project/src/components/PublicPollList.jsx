import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const PublicPollList = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});

  const citizenToken = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/api/polls/public", {
      headers: { Authorization: `Bearer ${citizenToken}` }
    })
      .then(res => setPolls(res.data))
      .catch(() => setError("Не удалось загрузить опросы"));
  }, []);

  const handleVote = async (questionId, questionType) => {
    const answerId = selectedAnswers[questionId];
    const openAnswer = textAnswers[questionId];

    try {
      await axios.post("http://localhost:8080/api/votes", {
        questionId,
        answerId: questionType === "TEXT" ? null : answerId,
        openAnswer: questionType === "TEXT" ? openAnswer : null,
      }, {
        headers: {
          Authorization: `Bearer ${citizenToken}`
        },
        withCredentials: true
      });

      alert("Голос засчитан!");
    } catch (err) {
      console.error("Ошибка при голосовании:", err);
      alert("Ошибка при голосовании");
    }
  };

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

            {poll.status === "CLOSED" ? (
              <button onClick={() => navigate(`/results/${poll.id}`)}>
                Результаты опроса
              </button>
            ) : (
              <button onClick={() => navigate(`/poll/${poll.id}`)}>
                Проголосовать
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PublicPollList;
