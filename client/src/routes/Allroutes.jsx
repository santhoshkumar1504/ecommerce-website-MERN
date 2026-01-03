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


const Allroutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='products' element={<Page/>}/>
        <Route path='categories' element={<Category/>}/>
        <Route path='contact' element={<Contact/>}/>
      </Route>
      <Route path='verify-email' element={<VerifyEmail/>}/>
      <Route path='verify-email-code' element={<VerifyEmailCode/>}/>
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='send-code' element={<Email />} />
      <Route path='verify-code' element={<Verifycode />} />
      <Route path='dashboard' element={<Dashboard/>}>
        <Route path='edit' element={<EditProfile/>}/>
        <Route path='change-password' element={<ChangePassword/>}/>
      </Route>
      <Route path='likedproduct' element={<LikedProducts/>}/>
      <Route path='orders' element={<Orders/>}/>
    </Routes>
  )
}

export default Allroutes
