import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login'
import Signup from './views/Signup'
import NotFound from './views/NotFound'
import Navbar from './views/_layout/Navbar'
import Add from './views/recipe/Add'
import Search from './views/recipe/Search'
import ProtectedRoutes from './utils/ProtectedRoutes'

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/search" element={<Search />}/>

        <Route element={<ProtectedRoutes/>}>
          <Route path="/add-recipe" element={<Add />}/>
        </Route>

        <Route path="*" element={<NotFound />}/>
      </Routes>
    </Router>
  )
}

export default App
