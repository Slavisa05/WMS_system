import { createContext, useContext, useState, useEffect, type ReactNode, type JSX} from 'react'
import type { User } from '@/types/auth'
import api from '@/api/axios'

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isMenadzer: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get('/accounst/zaposleni/');
            const zaposleni = res.data.result.find(
                (z: User) => z.username === localStorage.getItem('username')
            )

            setUser(zaposleni);
        } catch {
            localStorage.clear()
        } finally {
            setIsLoading(false);
        }
    }

    const login = async (username: string, password: string) => {
        const res = await api.post('/token/', {username, password});
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        localStorage.setItem('username', username);
        await fetchUser();
    }

    const logout = () => {
        localStorage.clear();
        setUser(null);
    }

    const isAdmin = user?.pozicija?.naziv === 'Admin';
    const isMenadzer = user?.pozicija?.naziv === 'Admin' || user?.pozicija?.naziv === 'Menadzer';

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAdmin, isMenadzer }}>
            { children }
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}

export default AuthProvider
export { useAuth }