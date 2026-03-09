import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import MainLayout from '@/layouts/MainLayout'

const App = () => {
  return (
    <>
      <MainLayout />

      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {/* <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/skladista" element={<SkladistaPage />} />
            </Route> */}
          </Route>

          {/* <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
