import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

// ✅ JWT decoder helper
const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // ✅ JWT se real data nikalo
            const decoded = decodeToken(storedToken);
            setUser({
                id: decoded?.userId,
                email: decoded?.email,
                role: decoded?.role,
                schoolId: decoded?.schoolId, // ✅ yahi important hai
                name: decoded?.name || 'Admin'
            });
        }
        setLoading(false);
    }, []);

    const login = (jwtToken, userData) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        // ✅ Login pe bhi decode karo
        const decoded = decodeToken(jwtToken);
        setUser({
            id: decoded?.userId,
            email: decoded?.email,
            role: decoded?.role,
            schoolId: decoded?.schoolId, // ✅
            name: userData?.name || decoded?.name || 'Admin'
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);