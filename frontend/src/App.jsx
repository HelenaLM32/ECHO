import './styles/globals.css';
import './styles/variables.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navigation/Navbar/Navbar';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import ProtectedRoute from './components/UI/ProtectedRoute/ProtectedRoute';
import Admin from './pages/Admin/Admin';
import AdminRoute from './components/UI/AdminRoute/AdminRoute';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/OrderDetail/OrderDetail';
import OrderDispute from './pages/OrderDetail/OrderDispute';

import CreateEvent from './pages/Events/CreateEvent';
import CreateVenue from './pages/Venues/CreateVenue';
import EditVenue from './pages/Venues/EditVenue';
import EditEvent from './pages/Events/EditEvent';

import ProjectEditor from './pages/ItemProject/ProjectEditor.jsx';
import ProjectEdit from './pages/ItemProject/ProjectEdit.jsx';
import ProjectView from './pages/ItemProject/ProjectView.jsx';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import CookiesPolicy from './pages/Legal/CookiesPolicy';
import Introduction from './pages/Resources/Introduction';
import AboutUs from './pages/Resources/AboutUs';

import ServiceCreate from './pages/Services/ServiceCreate';
import ServiceEdit from './pages/Services/ServiceEdit';

import OAuthCallback from './pages/OAuthCallback/OAuthCallback';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/profile/:id" element={<Profile />} />
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

        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        } />

        <Route path="/orders/:id/dispute" element={
          <ProtectedRoute>
            <OrderDispute />
          </ProtectedRoute>
        } />

        <Route path="/events/create" element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        } />

        <Route path="/venues/create" element={
          <ProtectedRoute>
            <CreateVenue />
          </ProtectedRoute>
        } />

        <Route path="/venues/:id/edit" element={
          <ProtectedRoute>
            <EditVenue />
          </ProtectedRoute>
        } />

        <Route path="/events/:id/edit" element={
          <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>
        } />

        <Route path="/projects/create" element={
          <ProtectedRoute>
            <ProjectEditor />
          </ProtectedRoute>
        } />

        <Route path="/projects/:id/edit" element={
          <ProtectedRoute>
            <ProjectEdit />
          </ProtectedRoute>
        } />

        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <ProjectView />
          </ProtectedRoute>
        } />

        <Route path="/services/create" element={
          <ProtectedRoute>
            <ServiceCreate />
          </ProtectedRoute>
        } />

        <Route path="/services/:id/edit" element={
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
    </>
  );
}
