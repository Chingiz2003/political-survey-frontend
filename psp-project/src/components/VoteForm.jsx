import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import QuestionBlock from "./QuestionBlock";


const VoteForm = () => {
    const { pollId } = useParams(); // Получаем pollId из маршрута
    const citizenToken = localStorage.getItem("token");
    const [poll, setPoll] = useState(null);
    const [answers, setAnswers] = useState({});
    const [message, setMessage] = useState("");
    const [votedQuestions, setVotedQuestions] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:8080/api/votes/voted-questions", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setVotedQuestions(res.data))
            .catch(() => console.warn("Не удалось загрузить список проголосованных вопросов"));
    }, []);


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
                const question = poll.questions.find(q => q.id === questionId);

                if (question?.questionType === "TEXT") {
                    return { questionId, openAnswer: value };
                } else if (question?.questionType === "MULTIPLE_CHOICE") {
                    return value.map(id => ({ questionId, answerOptionId: id }));
                } else {
                    return { questionId, answerOptionId: value };
                }
            }).flat() // т.к. MULTIPLE_CHOICE возвращает массив
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

            {poll.questions.map(q => {
                const alreadyVoted = votedQuestions.includes(q.id);

                return (
                    <div key={q.id} style={{ marginBottom: "20px", opacity: alreadyVoted ? 0.5 : 1 }}>
                        <p><strong>{q.text}</strong></p>

                        {alreadyVoted ? (
                            <p style={{ color: "gray" }}>Вы уже проголосовали за этот вопрос</p>
                        ) : (
                            <>
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

                                {q.questionType === "MULTIPLE_CHOICE" &&
                                    q.options.map(opt => (
                                        <label key={opt.id}>
                                            <input
                                                type="checkbox"
                                                value={opt.id}
                                                checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt.id)}
                                                onChange={e => {
                                                    const current = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                                                    const updated = e.target.checked
                                                        ? [...current, opt.id]
                                                        : current.filter(id => id !== opt.id);
                                                    handleChange(q.id, updated);
                                                }}
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
                            </>
                        )}
                    </div>
                );
            })}


            {
                poll.questions.some(q => !votedQuestions.includes(q.id)) && (
                    <button onClick={handleSubmit}>Отправить голос</button>
                )
            }

            {message && <p style={{ color: message.includes("успешно") ? "green" : "red" }}>{message}</p>}
            
        </div>
    );
};

export default VoteForm;
