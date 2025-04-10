import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min";

const FaceAuth = () => {
  const webcamRef = useRef(null);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [iin, setIIN] = useState("");
  const [status, setStatus] = useState("Ожидание...");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          color: 0x5588,
          backgroundColor: 0x0d1117,
          waveHeight: 14,
          waveSpeed: 1.05,
          shininess: 50,
          zoom: 1.01,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const captureAndSend = async () => {
    if (!iin || iin.length !== 12) {
      alert("Введите корректный ИИН (12 цифр)");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setStatus("Ошибка: не удалось захватить изображение");
      return;
    }

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("iin", iin);

    setLoading(true);
    setStatus("Проверка...");

    try {
      const res = await axios.post("http://localhost:8080/api/face/verify", formData);
      console.log("Face verify result:", res.data);

      if (res.data.verified === true || res.data.verified === "true") {
        const loginRes = await axios.post("http://localhost:8080/api/auth/login", {
          iin: iin,
        });

        const token = loginRes.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigate("/dashboard");
      } else {
        setStatus("❌ Лицо не совпадает");
      }
    } catch (err) {
      console.error("Ошибка при верификации:", err);
      setStatus("Ошибка запроса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={vantaRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          color: "white",
          textAlign: "center",
          paddingTop: "40px",
        }}
      >
        <h2>Вход по лицу</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          style={{ borderRadius: "8px", border: "2px solid #ccc" }}
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
    </div>
  );
};

export default FaceAuth;
