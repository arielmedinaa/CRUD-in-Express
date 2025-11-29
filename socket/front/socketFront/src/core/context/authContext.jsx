import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) {
                    setUser(userData);
                } else {
                    logout();
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const login = (userData, authToken) => {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        const origin = location.state?.from?.pathname || '/dashboard';
        navigate(origin);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;