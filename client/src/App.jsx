import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<h1>Register Page</h1>} />
      <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
      <Route path="/transactions" element={<h1>Transactions Page</h1>} />
    </Routes>
  )
}
export default App