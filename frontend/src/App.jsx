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
import OrderDispute from './pages/OrderDetail/OrderDispute';

// Rutas de HEAD (Eventos y Locales)
import CreateEvent from './pages/Events/CreateEvent';
import CreateVenue from './pages/Venues/CreateVenue';
import EditVenue from './pages/Venues/EditVenue';
import EditEvent from './pages/Events/EditEvent';

// Rutas de main (Proyectos y Legal)
import ProjectEditor from './pages/ItemProyect/ProjectEditor.jsx';
import ProjectView from './pages/ItemProyect/ProjectView.jsx';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import CookiesPolicy from './pages/Legal/CookiesPolicy';
import Introduction from './pages/Resources/Introduction';
import AboutUs from './pages/Resources/AboutUs';

// Rutas de servicios
import ServiceCreate from './pages/Services/ServiceCreate';
import ServiceEdit from './pages/Services/ServiceEdit';

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
        <Route path="/introduccion" element={<Introduction />} />
        <Route path="/sobre-nosotros" element={<AboutUs />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId" element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        } />

        <Route path="/orders/:orderId/dispute" element={
          <ProtectedRoute>
            <OrderDispute />
          </ProtectedRoute>
        } />

        <Route path="/events/event-create" element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        } />

        <Route path="/venues/venue-create" element={
          <ProtectedRoute>
            <CreateVenue />
          </ProtectedRoute>
        } />

        <Route path="/venues/:venueId/edit" element={
          <ProtectedRoute>
            <EditVenue />
          </ProtectedRoute>
        } />

        <Route path="/events/:eventId/edit" element={
          <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>
        } />

        <Route path="/proyect" element={
          <ProtectedRoute>
            <ProjectEditor />
          </ProtectedRoute>
        } />
        
        <Route path="/project/:id" element={
          <ProtectedRoute>
            <ProjectView />
          </ProtectedRoute>
        } />

        <Route path="/profile/services/new" element={
          <ProtectedRoute>
            <ServiceCreate />
          </ProtectedRoute>
        } />

        <Route path="/profile/services/:id/edit" element={
          <ProtectedRoute>
            <ServiceEdit />
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
      </Routes>
    </AuthProvider>
  )
}