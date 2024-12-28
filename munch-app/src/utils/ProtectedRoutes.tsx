import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from 'react-toastify';

const ProtectedRoutes = () => {
    const { user, loading } = useUser();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // Only show toast if coming from a different path
        if (location.state?.from !== '/login') {
            toast.error('Please log in to access this page', {
                toastId: 'protected-route' // Prevents duplicate toasts
            });
        }
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;