import React, { useEffect, useState } from "react";
import axios from "axios";

const QuestionBlock = ({ question, token }) => {
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/votes/has-voted?questionId=${question.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (res.data === true) {
        setAlreadyVoted(true);
        setMessage("Вы уже голосовали на этот вопрос");
      }
    });
  }, [question.id]);

  if (alreadyVoted) {
    return (
      <div style={{ marginBottom: "20px", opacity: 0.6 }}>
        <p><strong>{question.text}</strong> <span style={{ color: "red" }}>{message}</span></p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <p><strong>{question.text}</strong></p>

      {question.questionType === "TEXT" && (
        <textarea
          rows={3}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          style={{ width: "100%" }}
        />
      )}

      {/* добавь другие типы выбора, если нужно */}

      <button disabled={!answer}>Проголосовать</button>
    </div>
  );
};

export default QuestionBlock;
