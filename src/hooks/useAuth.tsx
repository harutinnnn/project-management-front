import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const login = (token?: string) => {
        setIsAuthenticated(true);
        localStorage.setItem('isLoggedIn', 'true');
        if (token) localStorage.setItem('authToken', token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
