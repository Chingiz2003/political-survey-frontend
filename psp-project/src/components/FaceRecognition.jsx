import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Загрузка моделей
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      setModelsLoaded(true);
      console.log("✅ Модели загружены");
    };

    loadModels();
  }, []);

  // Запуск камеры
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("❌ Ошибка доступа к камере:", err);
      }
    };

    startVideo();
  }, []);

  // Запуск детекции при готовности видео
  const handleVideoReady = async () => {
    if (!modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };

    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resized = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем рамку
      faceapi.draw.drawDetections(canvas, resized);

      // Рисуем точки (глаза, рот и т.д.)
      faceapi.draw.drawFaceLandmarks(canvas, resized);
    }, 200);
  };

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <h2>Face Detection</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onLoadedMetadata={handleVideoReady}
        width="640"
        height="480"
        style={{
          border: "2px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#000",
          zIndex: 1,
        }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{
          position: "absolute",
          top: "88px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default FaceRecognition;
