import React from 'react'
import Productcontainer from '../components/product/ProductContainer'

const Category = () => {
  return (
    <div>
      <h3 className="mt-3 mb-1 about-title">Shoes</h3>
      <hr className='hrline mb-3'/>
    <Productcontainer  detail="category=shoes"/>
      <h3 className="mt-3 mb-1 about-title">Laptops</h3>
      <hr className='hrline mb-3'/>
      <Productcontainer  detail="category=shoes"/>
      <h3 className="mt-3 mb-1 about-title">Gadgets</h3>
      <hr className='hrline mb-3'/>
      <Productcontainer  detail="category=shoes"/>
    </div>
  )
}

export default Category
