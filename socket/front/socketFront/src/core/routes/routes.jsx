import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../../login/Login';
import Dashboard from '../../app/modules/dashboard/Dashboard';
import { useAuth } from '../context/authContext';

const AppRoutes = () => {

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    return children ? children : <Outlet />;
  };

  const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default AppRoutes;