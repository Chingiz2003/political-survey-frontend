import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FaceAuth = () => {
  const webcamRef = useRef(null);
  const [iin, setIIN] = useState("");
  const [status, setStatus] = useState("Ожидание...");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const captureAndSend = async () => {
    if (!iin || iin.length !== 12) {
      alert("Введите корректный ИИН (12 цифр)");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("iin", iin);

    setLoading(true);
    setStatus("Проверка...");

    try {
      const res = await axios.post("http://localhost:8080/api/face/verify", formData);

      if (res.data.verified === true || res.data.verified === "true") {
        const loginRes = await axios.post("http://localhost:8080/api/auth/login", {
          iin: iin
        });
        const token = loginRes.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true"); // ОБЯЗАТЕЛЬНО!
        delete axios.defaults.headers.common["Authorization"];
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate("/dashboard");
      } else {
        setStatus("❌ Лицо не совпадает");
      }
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      setStatus("Ошибка запроса");
    } finally {
      setLoading(false);
    }

    try {
      console.log("Sending face verification request...");
      const res = await axios.post("http://localhost:8080/api/face/verify", formData);
      console.log("Face verification response:", res.data);
    
      if (res.data.verified === true || res.data.verified === "true") {
        console.log("Face verified, attempting login with IIN:", iin);
        const loginRes = await axios.post("http://localhost:8080/api/auth/login", {
          iin: iin
        });
        console.log("Login response:", loginRes.data);
        // остальной код...
      }
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      console.error("Детали ошибки:", err.response?.data);
      // остальной код обработки ошибки...
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Вход по лицу</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Введите ИИН"
          value={iin}
          onChange={(e) => setIIN(e.target.value)}
          maxLength={12}
          style={{ padding: "5px", width: "200px", marginRight: "10px" }}
        />
        <button onClick={captureAndSend} disabled={loading}>
          {loading ? "Отправка..." : "Верифицировать"}
        </button>
      </div>
      <p style={{ marginTop: "20px", fontSize: "18px" }}>{status}</p>
    </div>
  );
};

export default FaceAuth;
