import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const AdminRoute = () => {
    const { user, isLoading, isAdmin } = useAuth()

    if (isLoading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" />
    if (!isAdmin) return <Navigate to="/dokumenta" />

    return <Outlet />
}

export default AdminRoute