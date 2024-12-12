import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login'
import Signup from './views/Signup'
import NotFound from './views/NotFound'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>

        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
  )
}

export default App
