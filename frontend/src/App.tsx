import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PublicRoute from '@/components/PublicRoute'
import MenadzerRoute from '@/components/MenadzerRoute'
import AdminRoute from '@/components/AdminRoute'
import MainLayout from '@/layouts/MainLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import SkladistaPage from '@/pages/SkladistaPage'
import SkladisteDetaljiPage from './pages/SkladisteDetaljiPage'
import SvaDokumenta from '@/pages/SvaDokumenta'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<MenadzerRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/skladista" element={<SkladistaPage />} />
              <Route path="/skladista/:id" element={<SkladisteDetaljiPage />} />
              {/* /skladista, /inventar, /izvestaji */}
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<MainLayout />}>
              {/* /zaposleni */}
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dokumenta" element={<SvaDokumenta />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App