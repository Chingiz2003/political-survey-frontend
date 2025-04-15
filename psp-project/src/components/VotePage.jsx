// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const VotePage = () => {
//   const { pollId } = useParams();
//   const [poll, setPoll] = useState(null);
//   const [votes, setVotes] = useState({});
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     axios.get("http://localhost:8080/api/public/polls", { withCredentials: true })
//       .then(res => {
//         const selected = res.data.find(p => p.id === pollId);
//         setPoll(selected);
//       })
//       .catch(() => setMessage("Ошибка загрузки опроса"));
//   }, [pollId]);

//   const handleVoteChange = (questionId, value) => {
//     setVotes(prev => ({ ...prev, [questionId]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post("http://localhost:8080/api/votes", {
//         pollId,
//         answers: Object.entries(votes).map(([questionId, answer]) => ({
//           questionId,
//           selectedAnswerId: answer
//         }))
//       }, { withCredentials: true });

//       setMessage("Ваш голос учтён. Спасибо!");
//     } catch (err) {
//       console.error("Ошибка голосования:", err);
//       setMessage("Ошибка при отправке голосов");
//     }
//   };

//   if (!poll) return <p>Загрузка...</p>;

//   return (
//     <div>
//       <h2>{poll.title}</h2>
//       <p>{poll.description}</p>

//       {poll.questions.map(q => (
//         <div key={q.id}>
//           <h4>{q.text}</h4>
//           {q.options.map(opt => (
//             <div key={opt.id}>
//               <label>
//                 <input
//                   type="radio"
//                   name={`question-${q.id}`}
//                   value={opt.id}
//                   onChange={() => handleVoteChange(q.id, opt.id)}
//                 />
//                 {opt.text}
//               </label>
//             </div>
//           ))}
//         </div>
//       ))}

//       <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
//         Отправить голос
//       </button>

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default VotePage;
