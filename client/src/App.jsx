// import React from 'react'
// import Navbar from './components/Navbar'
// import { Route, Routes, useLocation } from 'react-router-dom'
// import Home from './pages/Home'
// import CarDetails from './pages/CarDetails'
// import Cars from './pages/Cars'
// import MyBookings from './pages/MyBookings'
// import Footer from './components/Footer'
// import Layout from './pages/owner/Layout'
// import Dashboard from './pages/owner/Dashboard'
// import AddVehicle from './pages/owner/AddVehicle'
// import ManageCars from './pages/owner/ManageCars'
// import ManageBookings from './pages/owner/ManageBookings'
// import Login from './components/Login'
// import { Toaster } from 'react-hot-toast'
// import { useAppContext } from './context/AppContext'
// import ProtectedRoute from './components/ProtectedRoute'   // ✅ import

// const App = () => {
//   const { showLogin } = useAppContext()
//   const isOwnerPath = useLocation().pathname.startsWith('/owner')

//   return (
//     <>
//       <Toaster />
//       {showLogin && <Login />}

//       {!isOwnerPath && <Navbar />}

//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/car-details/:id' element={<CarDetails />} />
//         <Route path='/cars' element={<Cars />} />
//         <Route path='/my-bookings' element={<MyBookings />} />

//         {/* ✅ Owner Routes Protected */}
//         <Route
//           path='/owner'
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           <Route path="add-car" element={<AddVehicle />} />
//           <Route path="manage-cars" element={<ManageCars />} />
//           <Route path="manage-bookings" element={<ManageBookings />} />
//         </Route>
//       </Routes>

//       {!isOwnerPath && <Footer />}
//     </>
//   )
// }

// export default App
import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddVehicle from './pages/owner/AddVehicle'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'

// 🔐 Auth Pages
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  const { showLogin } = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />

        {/* Auth */}
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />

        {/* Owner (Protected) */}
        <Route
          path='/owner'
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddVehicle />} />
          <Route path='manage-cars' element={<ManageCars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App
