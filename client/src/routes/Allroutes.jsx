import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Email from '../pages/Email'
import Verifycode from '../pages/Verifycode'
import Layout from '../layouts/Layout'
import Page from '../pages/Page'
import Category from '../pages/Category'
import Contact from '../pages/Contact'
import Dashboard from '../pages/Dashboard'
import EditProfile from '../pages/Editprofile'
import ChangePassword from '../pages/Changepassword'
import LikedProducts from '../pages/LikedProducts'
import Orders from '../pages/Orders'
import VerifyEmailCode from '../pages/VerifyEmailCode'
import VerifyEmail from '../pages/VerifyEmail'
import AdminDashboard from '../components/admin/AdminDashboard'
import AllProducts from '../components/admin/AllProducts'
import AdminLayout from '../components/admin/AdminLayout'
import AllCategories from '../components/admin/AllCategories'
import AllUsers from '../components/admin/AllUsers'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import AllOrders from '../components/admin/AllOrders'
import DeliveredOrders from '../components/admin/DeliveredOrders'
import PlacedOrders from '../components/admin/PlacedOrders'
import CancelledOrders from '../components/admin/CancelledOrders'
import SearchLayout from '../components/search/SearchLayout'
import CartPage from '../pages/CartPage'
import AdminNotifications from '../components/admin/AdminNotifications'


const Allroutes = () => {
  return (
    <Routes>
      {/* Home Routes */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='products' element={<Page />} />
        <Route path='categories' element={<Category />} />
        <Route path='contact' element={<Contact />} />
      </Route>

      <Route path="/cart" element={<CartPage />} />

      {/* search */}
      <Route path='/search' element={<SearchLayout />} />
      <Route path='products/:id' element={<ProductDetailsPage />} />


      <Route path='verify-email' element={<VerifyEmail />} />
      <Route path='verify-email-code' element={<VerifyEmailCode />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='send-code' element={<Email />} />
      <Route path='verify-code' element={<Verifycode />} />


      <Route path='dashboard' element={<Dashboard />}>
        <Route path='edit' element={<EditProfile />} />
        <Route path='change-password' element={<ChangePassword />} />
      </Route>


      <Route path='likedproduct' element={<LikedProducts />} />
      <Route path='orders' element={<Orders />} />

      {/* Admin Routes */}
      <Route path='admin' element={<AdminDashboard />}>
        <Route path='dashboard' element={<AdminLayout />} />
        <Route path='products' element={<AllProducts />} />
        <Route path='categories' element={<AllCategories />} />
        <Route path='customers' element={<AllUsers />} />
        <Route path="orders" element={<AllOrders />} />
        <Route path="orders/delivered" element={<DeliveredOrders />} />
        <Route path="orders/placed" element={<PlacedOrders />} />
        <Route path="orders/cancelled" element={<CancelledOrders />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      </Routes>
  )
}

export default Allroutes
