import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AuthRoutes = () => {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Navigate to="/" /> : <Outlet />;
}

export default AuthRoutes;