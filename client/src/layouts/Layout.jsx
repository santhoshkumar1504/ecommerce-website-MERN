import React from 'react'
import HeadNavbar from '../components/common/HeadNavbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/common/Footer'
import Banner from '../components/common/Banner'

const Layout = () => {
  return (
    <div>
      <HeadNavbar/>
      <Banner/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout
