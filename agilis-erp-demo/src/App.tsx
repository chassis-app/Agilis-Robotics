import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { AppRouter } from '@/router'
import { Toaster } from '@/components/ui/Toast'

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AppRouter />
        <Toaster />
      </BrowserRouter>
    </I18nextProvider>
  )
}
