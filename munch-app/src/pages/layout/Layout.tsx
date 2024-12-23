import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Home from '../Home'
import Search from '../recipe/Search'
import Login from '../Login'
import Signup from '../Signup'
import Add from '../recipe/Add'
import AuthRoutes from '../../utils/AuthRoutes'
import ProtectedRoutes from '../../utils/ProtectedRoutes'
import NotFound from '../NotFound'

function Layout() {
  const location = useLocation()
  const showNavbarRoutes = ['/', '/search', '/add-recipe', '/login', '/signup']

  const shouldShowNavbar = showNavbarRoutes.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />

        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/add-recipe" element={<Add />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default Layout
