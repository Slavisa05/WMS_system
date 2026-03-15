import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const PublicRoute = () => {
    const { user, isLoading } = useAuth()

    if (isLoading) return <div>Loading...</div>
    if (user) {
        const pozicija = user.pozicija?.naziv;
        if (pozicija === 'Admin' || pozicija === 'Menadzer') {
            return <Navigate to="/dashboard" />
        }
        
        return <Navigate to="/dokumenta" />
    }

    return <Outlet />
}

export default PublicRoute