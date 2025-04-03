import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  detected: false, // Флаг, обнаружено ли лицо
  name: "", // Имя пользователя, если доступно
};

const faceSlice = createSlice({
  name: "face",
  initialState,
  reducers: {
    setDetected: (state, action) => {
      state.detected = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setDetected, setName } = faceSlice.actions;
export default faceSlice.reducer;
