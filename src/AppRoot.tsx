import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { AccessProvider } from './access/AccessProvider'
import { GuestOnly, RequireAccess, RequireSession } from './routes/guards'
import { ROUTES } from './lib/routes'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CheckEmailPage } from './pages/CheckEmailPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { NewPasswordPage } from './pages/NewPasswordPage'
import { AuthConfirmPage } from './pages/AuthConfirmPage'
import { ActivatePage } from './pages/ActivatePage'
import { HomePage } from './pages/HomePage'
import { SettingsPage } from './pages/SettingsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccessProvider>
          <Routes>
            {/* Publiczne */}
            <Route path={ROUTES.privacy} element={<PrivacyPage />} />
            <Route path={ROUTES.authConfirm} element={<AuthConfirmPage />} />
            <Route path={ROUTES.newPassword} element={<NewPasswordPage />} />

            {/* Tylko dla niezalogowanych */}
            <Route element={<GuestOnly />}>
              <Route path={ROUTES.login} element={<LoginPage />} />
              <Route path={ROUTES.register} element={<RegisterPage />} />
              <Route path={ROUTES.checkEmail} element={<CheckEmailPage />} />
              <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
            </Route>

            {/* Wymaga sesji (bez wymogu dostępu: aktywacja + RODO) */}
            <Route element={<RequireSession />}>
              <Route path={ROUTES.activate} element={<ActivatePage />} />
              <Route path={ROUTES.settings} element={<SettingsPage />} />

              {/* Wymaga aktywnego dostępu */}
              <Route element={<RequireAccess />}>
                <Route path={ROUTES.home} element={<HomePage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AccessProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
