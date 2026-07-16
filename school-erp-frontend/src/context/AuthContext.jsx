import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

// ✅ JWT decoder helper (Safe Check ke sath)
const decodeToken = (token) => {
    try {
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    // 💡 Performance Tip: Initial state me hi decode kar lo taaki 'null' render ka loop na bane
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decoded = decodeToken(storedToken);
            return {
                id: decoded?.userId || decoded?.id, // Kuch systems me id hota hai, kuch me userId
                email: decoded?.email,
                role: decoded?.role,
                schoolId: decoded?.schoolId,
                name: decoded?.name || 'User'
            };
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // App mount hone par check complete
        setLoading(false);
    }, []);

    const login = (jwtToken, userData) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        const decoded = decodeToken(jwtToken);
        setUser({
            id: decoded?.userId || decoded?.id,
            email: decoded?.email,
            role: decoded?.role,
            schoolId: decoded?.schoolId,
            name: userData?.name || decoded?.name || 'User'
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