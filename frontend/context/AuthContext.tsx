import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    updateUserPassword: (newPassword: string) => Promise<void>;
    updateUserPhoto: (photoURL: string) => Promise<void>;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = () => {
        return signOut(auth);
    };

    const getIdToken = async () => {
        if (!auth.currentUser) return null;
        return auth.currentUser.getIdToken();
    };

    const updateUserPassword = async (newPassword: string) => {
        if (!auth.currentUser) throw new Error("No user logged in");
        return updatePassword(auth.currentUser, newPassword);
    };

    const updateUserPhoto = async (photoURL: string) => {
        if (!auth.currentUser) throw new Error("No user logged in");
        await updateProfile(auth.currentUser, { photoURL });
        // Force re-render by refreshing the user state
        setUser({ ...auth.currentUser });
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, updateUserPassword, updateUserPhoto, getIdToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
