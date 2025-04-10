import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setSuccess("Название и описание обязательны");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:8080/api/admin/polls/create", {
        title,
        description,
        anonymous,
        status
      }, {
        withCredentials: true  // Это важно для отправки cookie сессии
      });
  
      console.log("Ответ сервера:", res.data);
      setSuccess("Опрос успешно создан!");
      setTitle("");
      setDescription("");
      setAnonymous(false);
      setStatus("DRAFT");
    } catch (err) {
      console.error("Ошибка создания опроса:", err);
      setSuccess("Ошибка создания опроса");
      
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/admin/login");
      }
    }
};
  

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Создание опроса</h2>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <div>
        <label>
          Анонимный:
          <input
            type="checkbox"
            checked={anonymous}
            onChange={e => setAnonymous(e.target.checked)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>
          Статус:
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ marginLeft: "10px" }}>
            <option value="DRAFT">Черновик</option>
            <option value="ACTIVE">Активный</option>
            <option value="CLOSED">Завершён</option>
          </select>
        </label>
      </div>
      <button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Создать опрос
      </button>
      {success && <p style={{ marginTop: "15px", color: "green" }}>{success}</p>}
    </div>
  );
};

export default CreatePoll;
