import React, { useEffect, useState } from "react";
import axios from "axios";

const AnswerOptionsList = ({ questionId }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/answer-options/question/${questionId}`, {
        withCredentials: true,
      });
  
      const data = res.data;
      console.log("Ответ сервера:", data);
  
      // Безопасная установка массива
      setOptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка загрузки вариантов ответа:", err);
      setMessage("Ошибка загрузки вариантов");
      setOptions([]); // чтобы точно был массив
    } finally {
      setLoading(false);
    }
  };  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/answer-options/${id}`, {
        withCredentials: true,
      });
      setOptions((prev) => prev.filter((opt) => opt.id !== id));
    } catch (err) {
      console.error("Ошибка удаления:", err);
      setMessage("Ошибка удаления");
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchOptions();
    }
  }, [questionId]);

  if (!questionId) {
    return <p>Выберите вопрос, чтобы увидеть варианты ответов</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Варианты ответа:</h4>
      {loading && <p>Загрузка...</p>}
      {message && <p style={{ color: "red" }}>{message}</p>}

      {options.length === 0 ? (
        <p>Нет вариантов ответа</p>
      ) : (
        <ul>
          {options.map((opt) => (
            <li key={opt.id}>
              {opt.orderIndex}. {opt.text}
              <button
                onClick={() => handleDelete(opt.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnswerOptionsList;
