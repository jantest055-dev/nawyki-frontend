export const ROUTES = {
  home: '/',
  login: '/logowanie',
  register: '/rejestracja',
  checkEmail: '/sprawdz-poczte',
  forgotPassword: '/zapomnialem-hasla',
  newPassword: '/nowe-haslo',
  authConfirm: '/auth/potwierdz',
  activate: '/aktywuj',
  settings: '/ustawienia',
  privacy: '/prywatnosc',
} as const

export function appUrl(path: string): string {
  return new URL(path, window.location.origin).toString()
}
