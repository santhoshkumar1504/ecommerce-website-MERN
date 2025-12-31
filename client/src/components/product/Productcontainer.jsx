import { useEffect, useState } from 'react';
import Product from './Product';
import '../../assets/styles/product.css';
import axios from 'axios';

const Productcontainer = ({detail}) => {

  const [data,setData]=useState();

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/v1/products?${detail}`).then(response=>{setData(response.data)}).catch((error)=>{console.log(error)});
  },[]);

  return (
    <div className='container-fluid my-2 maincontainer mb-4'>
      
      <div className="main-p">
        {  data?.data?.productDetails?.map((product) => (
           <Product data={product} key={product._id}/>
      ))}
      </div>

    </div>
  );
};

export default Productcontainer;