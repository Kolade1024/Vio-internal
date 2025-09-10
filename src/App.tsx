import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect, type JSX } from 'react'
import Layout from './components/Layout'
import Loading from './components/Loading'
// import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Auth from './services/auth'

// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tickets = lazy(() => import('./pages/Tickets'))
const Commands = lazy(() => import('./pages/Commands'))
const Complaints = lazy(() => import('./pages/Complaints'))
const Vehicles = lazy(() => import('./pages/Vehicles'))
const VehicleOwners = lazy(() => import('./pages/VehicleOwners'))
const Offences = lazy(() => import('./pages/Offences'))
const Offenders = lazy(() => import('./pages/Offenders'))
const Users = lazy(() => import('./pages/Users'))
const AuditLogs = lazy(() => import('./pages/AuditLogs'))
const Payments = lazy(() => import('./pages/Payments'))
const Reports = lazy(() => import('./pages/Reports'))
const SearchTicket = lazy(() => import('./pages/SearchTicket'))
const CreateTicket = lazy(() => import('./pages/CreateTicket'))
const CommandUnits = lazy(() => import('./pages/CommandUnits'))

function RequireAuth({ children }: { children: JSX.Element, roles?: string[] }) {
  // const { user } = useAuth()
  if (!Auth.getToken()) return <Navigate to="/login" replace />
  // if (roles && !roles.includes(user.role)) 
  // return <Navigate to="/" replace />
  return children
}

function App() {
  
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

useEffect(() => {
  scrollToTop();
}, [window.location.href]);


  return (
    <Suspense fallback={<Loading />}>
        <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<Layout />}>
          <Route index element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="tickets" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <Tickets />
            </RequireAuth>
          } />
          <Route path="search-ticket" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <SearchTicket />
            </RequireAuth>
          } />
          <Route path="create-ticket" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <CreateTicket />
            </RequireAuth>
          } />
          <Route path="commands" element={
            <RequireAuth roles={['Admin', 'Chairman', 'Senior Officer']}>
              <Commands />
            </RequireAuth>
          } />
          <Route path="command-units" element={
            <RequireAuth roles={['Admin', 'Chairman', 'Senior Officer']}>
              <CommandUnits />
            </RequireAuth>
          } />
          <Route path="complaints" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <Complaints />
            </RequireAuth>
          } />
          <Route path="vehicles" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <Vehicles />
            </RequireAuth>
          } />
          <Route path="vehicle-owners" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <VehicleOwners />
            </RequireAuth>
          } />
          <Route path="offenders" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <Offenders />
            </RequireAuth>
          } />
          <Route path="offences" element={
            <RequireAuth roles={['Admin', 'Officer', 'Senior Officer', 'Chairman']}>
              <Offences />
            </RequireAuth>
          } />
          <Route path="users" element={
            <RequireAuth roles={['Admin']}>
              <Users />
            </RequireAuth>
          } />
          <Route path="audit-logs" element={
            <RequireAuth roles={['Admin', 'Chairman']}>
              <AuditLogs />
            </RequireAuth>
          } />
          <Route path="payments" element={
            <RequireAuth roles={['Admin', 'Chairman']}>
              <Payments />
            </RequireAuth>
          } />
          <Route path="reports" element={
            <RequireAuth roles={['Admin', 'Chairman']}>
              <Reports />
            </RequireAuth>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
