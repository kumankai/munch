import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Layout from './pages/layout/Layout'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
