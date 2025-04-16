import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PollResults = () => {
  const { pollId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/polls/results/${pollId}`)
      .then(res => setResults(res.data))
      .catch(() => alert("Ошибка загрузки результатов"));
  }, [pollId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Результаты опроса</h2>

      {results.map((r, i) => (
        <div key={i} style={{ marginBottom: "20px" }}>
          <strong>{r.question}</strong>
          <ul>
            {r.type === "TEXT" ? (
              r.answers.map((a, idx) => <li key={idx}>{a}</li>)
            ) : (
              Object.entries(r.answers).map(([text, count], idx) => (
                <li key={idx}>{text}: {count} голос(ов)</li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PollResults;
