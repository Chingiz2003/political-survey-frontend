import { configureStore } from "@reduxjs/toolkit";
import faceReducer from "./faceSlice"; // Импортируем наш срез

export const store = configureStore({
  reducer: {
    face: faceReducer, // Добавляем в хранилище
  },
});

export default store;
