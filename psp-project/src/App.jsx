import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FaceRecognition from './components/FaceRecognition'
import FaceAuth from './components/FaceAuth'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout'
import Dashboard from "./components/Dashboard";
import Polls from "./components/Polls"
import CitizenProfile from "./components/CitizenProfile"
import AdminLogin from "./components/AdminLogin";
import CreatePoll from "./components/CreatePoll";
import CreateQuestion from './components/CreateQuestion'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<FaceAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/me" element={<CitizenProfile />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/create-poll" element={<CreatePoll />} />
          <Route path="/admin/create-question" element={<CreateQuestion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
