import './App.css'
import './styles/globals.css';
import './styles/variables.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {/* AQUI TENEMOS QUE METER EL DASHBOARD DE LOS ADMINS */}
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}