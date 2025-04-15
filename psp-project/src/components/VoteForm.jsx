import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


const VoteForm = () => {
    const { pollId } = useParams(); // Получаем pollId из маршрута
  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/polls/public/${pollId}`, {
      withCredentials: true,
    })
      .then(res => setPoll(res.data))
      .catch(() => setMessage("Ошибка загрузки опроса"));
  }, [pollId]);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, value]) => {
        if (typeof value === "string" && value.length > 36) {
          return { questionId, openAnswer: value }; // TEXT
        } else if (Array.isArray(value)) {
          return { questionId, openAnswer: value }; // MULTIPLE_CHOICE (optional)
        } else {
          return { questionId, answerOptionId: value }; // SINGLE_CHOICE
        }
      })
    };

    try {
      await axios.post("http://localhost:8080/api/votes/submit", payload, {
        withCredentials: true
      });
      setMessage("Голос успешно отправлен!");
    } catch (err) {
      console.error("Ошибка при голосовании:", err);
      setMessage("Ошибка при отправке голоса");
    }
  };

  if (!poll) return <p>Загрузка...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>{poll.title}</h2>
      <p>{poll.description}</p>

      {poll.questions.map(q => (
        <div key={q.id} style={{ marginBottom: "20px" }}>
          <p><strong>{q.text}</strong></p>
          {q.questionType === "SINGLE_CHOICE" &&
            q.options.map(opt => (
              <label key={opt.id}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt.id}
                  checked={answers[q.id] === opt.id}
                  onChange={() => handleChange(q.id, opt.id)}
                />
                {opt.text}
              </label>
            ))
          }

          {q.questionType === "TEXT" && (
            <textarea
              rows={3}
              value={answers[q.id] || ""}
              onChange={e => handleChange(q.id, e.target.value)}
              style={{ width: "100%" }}
            />
          )}

          {/* MULTIPLE_CHOICE можно реализовать позже при необходимости */}
        </div>
      ))}

      <button onClick={handleSubmit}>Отправить голос</button>

      {message && <p style={{ color: message.includes("успешно") ? "green" : "red" }}>{message}</p>}
    </div>
  );
};

export default VoteForm;
