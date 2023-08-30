
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token]);

    const login = async (username, password) => {
        try {
            const formData = { login: username, password: password, role: 'ADMIN' };
            const response = await axios.post('https://site-rifas-heroku-a67dfaec93a7.herokuapp.com/auth/login', formData);
            const newToken = response.data.token;
            setToken(newToken);
            console.log(token)
            setIsLoggedIn(true);
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const authContextValue = {
        isLoggedIn,
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}