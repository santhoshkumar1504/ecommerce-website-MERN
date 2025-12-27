import React from 'react'
import shoe from '../../assets/png/running-shoe.png';
import phone from '../../assets/png/phone.png';
import headphone from '../../assets/png/headphone.png';
import cooler from '../../assets/png/cooler_black.png';
import drone from '../../assets/png/drone.png';
import dress from '../../assets/png/shirt.png';

const About = () => {
  return (
    <div>

          <h2 className='mt-3 mb-1 about-title'>Explore Our Products</h2>
          <hr className='hrline mb-2'/>
    <div className='box-home d-flex text-center container mt-3 mb-3'>
        <div className="row">
    <div className="box1 col-lg-2 col-md-3 col-sm-4">
        <img src={drone} alt="drone" />
        <h6 className='mt-2'>Drones</h6>
      </div>
      <div className="box1 col-lg-2 col-md-3">
        <img src={shoe} alt="shoes" />
        <h6 className='mt-2'>Shoes</h6>
      </div>
      <div className="box1 col-lg-2 col-md-3">
        <img src={phone} alt="mobile"/>
        <h6 className='mt-2'>Mobiles</h6>
      </div>
      <div className="box1 col-lg-2 col-md-3">
        <img src={headphone} alt="headphone" className='me-5' />
        <h6 className='mt-2'>Headphones</h6>
      </div>
      <div className="box1 col-lg-2 col-md-3">
        <img src={cooler} alt="glass"  />
        <h6 className='mt-2'>Glasses</h6>
      </div>
      <div className="box1 col-lg-2 col-md-3">
        <img src={dress} alt="shirt"  />
        <h6 className='mt-2'>Shirts</h6>
      </div>
    
        </div> 
    </div>

    </div>
  )
}

export default About
