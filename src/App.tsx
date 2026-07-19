import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BuyerPage from './pages/BuyerPage'
import StaffPage from './pages/StaffPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuyerPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<BuyerPage />} />
      </Routes>
    </BrowserRouter>
  )
}
