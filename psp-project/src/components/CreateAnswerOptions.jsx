import React, { useEffect, useState } from "react";
import axios from "axios";
import AnswerOptionsList from "./AnswerOptionsList";

const CreateAnswerOption = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState("");
    const [text, setText] = useState("");
    const [orderIndex, setOrderIndex] = useState(1);
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/admin/questions/all", { withCredentials: true })
            .then(res => setQuestions(res.data))
            .catch(() => setMessage("Не удалось загрузить вопросы"));
    }, []);

    const handleSubmit = async () => {
        if (!selectedQuestionId || !text.trim()) {
            setMessage("Выберите вопрос и введите текст варианта");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/answer-options", {
                text,
                orderIndex,
                questionId: selectedQuestionId 
            }, { withCredentials: true });

            setMessage("Вариант ответа добавлен");
            setText("");
            setOrderIndex(orderIndex + 1);
        } catch (err) {
            console.error("Ошибка:", err);
            setMessage("Ошибка при добавлении");
        }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Добавить вариант ответа</h2>

            <label>Выберите вопрос:</label><br />
            <select
                value={selectedQuestionId}
                onChange={e => setSelectedQuestionId(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
            >
                <option value="">-- выберите --</option>
                {questions.map(q => (
                    <option key={q.id} value={q.id}>
                        {q.text}
                    </option>
                ))}
            </select>

            <label>Текст варианта:</label><br />
            <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
            />

            <label>Порядок отображения:</label><br />
            <input
                type="number"
                value={orderIndex}
                onChange={e => setOrderIndex(Number(e.target.value))}
                style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
            />

            <button onClick={handleSubmit} style={{ padding: "10px 20px", marginBottom: "10px" }}>
                Добавить вариант
            </button>

            {message && (
                <p style={{ marginTop: "15px", color: message.includes("добавлен") ? "green" : "red" }}>
                    {message}
                </p>
            )}

            <AnswerOptionsList questionId={selectedQuestionId} />

        </div>
    );
};

export default CreateAnswerOption;
