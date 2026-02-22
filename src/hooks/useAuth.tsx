import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userName: string | null;
    login: (token?: string, userName?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [userName, setUserName] = useState<string | null>(() => {
        return localStorage.getItem('userName');
    });

    const login = (token?: string, name?: string) => {
        setIsAuthenticated(true);
        localStorage.setItem('isLoggedIn', 'true');
        if (token) localStorage.setItem('authToken', token);
        if (name) {
            setUserName(name);
            localStorage.setItem('userName', name);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserName(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
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
