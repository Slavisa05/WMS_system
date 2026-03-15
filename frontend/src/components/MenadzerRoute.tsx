import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const MenadzerRoute = () => {
    const { user, isLoading, isMenadzer } = useAuth()

    if (isLoading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" />
    if (!isMenadzer) return <Navigate to="/dokumenta" />

    return <Outlet />
}

export default MenadzerRoute