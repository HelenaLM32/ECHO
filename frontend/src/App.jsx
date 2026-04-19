import './App.css'
import './styles/globals.css';
import './styles/variables.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Admin from './pages/Admin/Admin';
import AdminRoute from './components/AdminRoute/AdminRoute';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/OrderDetail/OrderDetail';
import ProjectEditor from './pages/ItemProyect/ProjectEditor.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }/>

        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }/>

        <Route path="/orders/:orderId" element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
          } />

        <Route path="/profile/:userId" element={<Profile />} />

        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />

        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        <Route path="/itemproyect" element={<ProjectEditor />} />
      </Routes>
    </AuthProvider>
  )
}