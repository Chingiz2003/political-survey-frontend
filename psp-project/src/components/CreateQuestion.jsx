import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateQuestion = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState("SINGLE_CHOICE");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Получаем список опросов (для выбора)
    axios.get("http://localhost:8080/api/admin/polls", {
      withCredentials: true
    })
    .then(res => setPolls(res.data))
    .catch(err => {
      console.error("Ошибка загрузки опросов:", err);
      setMessage("Не удалось загрузить список опросов");
    });
  }, []);

  const handleSubmit = async () => {
    if (!selectedPollId || !text.trim()) {
      setMessage("Выберите опрос и введите текст вопроса");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/admin/questions/create?pollId=${selectedPollId}`,
        { text, questionType: type},
        { withCredentials: true }
      );

      setMessage("Вопрос успешно добавлен");
      setText("");
      setType("SINGLE_CHOICE");
    } catch (err) {
      console.error("Ошибка при создании вопроса:", err);
      setMessage("Ошибка при создании вопроса");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Добавить вопрос к опросу</h2>

      <label>Выберите опрос:</label><br />
      <select
        value={selectedPollId}
        onChange={e => setSelectedPollId(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      >
        <option value="">-- выберите --</option>
        {polls.map(poll => (
          <option key={poll.id} value={poll.id}>
            {poll.title}
          </option>
        ))}
      </select>

      <label>Текст вопроса:</label><br />
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      />

      <label>Тип вопроса:</label><br />
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      >
        <option value="SINGLE_CHOICE">Одиночный выбор</option>
        <option value="MULTIPLE_CHOICE">Множественный выбор</option>
        <option value="TEXT">Открытый ответ</option>
      </select>

      <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
        Добавить вопрос
      </button>

      {message && <p style={{ marginTop: "15px", color: message.includes("успешно") ? "green" : "red" }}>{message}</p>}
    </div>
  );
};

export default CreateQuestion;
