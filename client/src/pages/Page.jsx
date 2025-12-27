import React from 'react'
import Productcontainer from '../components/product/ProductContainer'

const Page = () => {
  return (
    <div>
    <h3 className="mt-3 mb-1 about-title">Our All Products</h3>
      <hr className='hrline mb-3'/>
      <Productcontainer/>
    </div>
  )
}

export default Page
