import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Home from '../Home'
import Search from '../recipe/Search'
import Login from '../auth/Login'
import Signup from '../auth/Signup'
import Add from '../recipe/Add'
import AuthRoutes from '../../utils/AuthRoutes'
import ProtectedRoutes from '../../utils/ProtectedRoutes'
import NotFound from '../NotFound'
import Profile from '../user/Profile'
import Settings from '../user/Settings'
import SearchDetails from '../recipe/SearchDetails'

function Layout() {
  const location = useLocation()
  const showNavbarRoutes = ['/', '/search', '/add-recipe', '/login', '/signup', '/profile', '/settings', '/recipe/search']

  const shouldShowNavbar = showNavbarRoutes.some(route => 
    location.pathname.startsWith(route)
  )

  // Clear search data when leaving search/recipe pages
  useEffect(() => {
    const isSearchRelatedPage = 
      location.pathname === '/search' || 
      location.pathname.startsWith('/recipe/search');

    if (!isSearchRelatedPage) {
      localStorage.removeItem('searchIngredients');
      localStorage.removeItem('searchResults');
    }
  }, [location.pathname]);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recipe/search/:id" element={<SearchDetails />} />

        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/add-recipe" element={<Add />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default Layout
