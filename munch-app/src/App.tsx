import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Layout from './pages/layout/Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          closeButton={true}
          limit={1}
        />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
