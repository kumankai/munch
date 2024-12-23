import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoutes = () => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet/> : <Navigate to="/login"/>
}

export default ProtectedRoutes;