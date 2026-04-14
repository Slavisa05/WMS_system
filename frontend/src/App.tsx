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
import SkladisteDetaljiPage from '@/pages/SkladisteDetaljiPage'
import SektorPage from '@/pages/SektorPage'
import SlotPage from '@/pages/SlotPage'
import KategorijePage from '@/pages/KategorijePage'
import KategorijeDetaljiPage from '@/pages/KategorijeDetaljiPage'
import ProizvodiPage from '@/pages/ProizvodiPage'
import ProizvodiDetaljiPage from '@/pages/ProizvodiDetaljiPage'
import ZalihePage from '@/pages/ZalihePage'
import DokumentaPage from '@/pages/DokumentaPage'
import DokumentaDetaljiPage from '@/pages/DokumentaDetaljiPage'
import DokumentFormPage from '@/pages/DokumentFormPage'
import PartneriPage from '@/pages/PartneriPage'
import PartneriDetaljiPage from '@/pages/PartneriDetaljiPage'
import VozilaPage from '@/pages/VozilaPage'
import VozilaDetaljiPage from '@/pages/VozilaDetaljiPage'
import TransportiPage from '@/pages/TransportiPage'
import TransportiDetaljiPage from '@/pages/TransportiDetaljiPage'
import ZaposleniPage from '@/pages/ZaposleniPage'
import ZaposleniDetaljiPage from '@/pages/ZaposleniDetaljiPage'
import IzvestajiPage from '@/pages/IzvestajiPage'

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
              <Route path="/sektori/:id" element={<SektorPage />} />
              <Route path="/slotovi/:id" element={<SlotPage />} />

              <Route path="/kategorije" element={<KategorijePage />} />
              <Route path="/kategorije/:id" element={<KategorijeDetaljiPage />} />
              <Route path="/proizvodi" element={<ProizvodiPage />} />
              <Route path="/proizvodi/:id" element={<ProizvodiDetaljiPage />} />

              <Route path="/zalihe" element={<ZalihePage />} />

              <Route path="/izvestaji" element={<IzvestajiPage />} />
              {/* /izvestaji */}
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/zaposleni" element={<ZaposleniPage />} />
              <Route path="/zaposleni/:id" element={<ZaposleniDetaljiPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dokumenta" element={<DokumentaPage />} />
              <Route path="/dokumenta/:id" element={<DokumentaDetaljiPage />} />
              <Route path="/dokumenta/dodaj_dokument" element={<DokumentFormPage />} />
              <Route path="/dokumenta/:id/uredi_dokument" element={<DokumentFormPage />} />

              <Route path="/partneri" element={<PartneriPage />} />
              <Route path="/partneri/:id" element={<PartneriDetaljiPage />} />

              <Route path="/vozila" element={<VozilaPage />} />
              <Route path="/vozila/:id" element={<VozilaDetaljiPage />} />

              <Route path="/transporti" element={<TransportiPage />} />
              <Route path="/transporti/:id" element={<TransportiDetaljiPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App