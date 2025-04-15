import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/public/polls", {
      withCredentials: true,
    })
    .then(res => setPolls(res.data))
    .catch(err => console.error("Ошибка загрузки опросов:", err));
  }, []);

  const goToPoll = (id) => navigate(`/poll/${id}`);

  return (
    <div>
      <h2>Доступные опросы</h2>
      <ul>
        {polls.map(poll => (
          <li key={poll.id}>
            <strong>{poll.title}</strong> - {poll.description}
            <button onClick={() => goToPoll(poll.id)}>Голосовать</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollList;
