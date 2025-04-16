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
import CreateAnswerOption from './components/CreateAnswerOptions'
import AnswerOptionsList from './components/AnswerOptionsList'
import PublicPollList from './components/PublicPollList'
// import VotePage from './components/VotePage'
import VoteForm from './components/VoteForm'
import PollList from './components/Polls'
import LandingPage from './components/main/LandingPage'
import PollResults from './components/PollResults'
import AdminPollList from './components/AdminPollList'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path='/login' element={<FaceAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/me" element={<CitizenProfile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/create-poll" element={<CreatePoll />} />
          <Route path="/admin/create-question" element={<CreateQuestion />} />
          <Route path="/admin/create-answer" element={<CreateAnswerOption />} />
          <Route path="/admin/answers-list" element={<AnswerOptionsList />} />
          <Route path="/polls1" element={<PublicPollList />} />
          <Route path="/all_polls" element={<PollList />} />
          <Route path="/poll/:pollId" element={<VoteForm />} />
          <Route path="/results/:pollId" element={<PollResults />} />
          <Route path="/admin/polls" element={<AdminPollList />} />
          {/* <Route path="/polls" element={<Polls />} /> */}
          {/* <Route path="/poll/:pollId" element={<VotePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
