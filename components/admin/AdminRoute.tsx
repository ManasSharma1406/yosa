import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Loader onComplete={() => { }} />;

    // For now, we'll check if the user is logged in. 
    // In a real app, you'd check a custom claim or fetch the role from the backend.
    // As a simple security measure, we can check a specific admin email.
    const isAdmin = user && (user.email === 'admin@flownest.studio' || user.email === 'manas@flownest.studio');

    if (!user || !isAdmin) {
        return <Navigate to="/sign-in" />;
    }

    return <>{children}</>;
};

export default AdminRoute;

