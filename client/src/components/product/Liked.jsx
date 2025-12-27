import { useEffect, useState } from 'react'
import Product from './Product'
import '../../assets/styles/product.css'
import axios from 'axios'
import Forliked from './Forliked'

const Liked = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/v1/liked')
      .then((response) => {
        setProducts(response.data.data.product)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <div className="container-fluid my-2 maincontainer mb-4">
      <div className="main-p">
        {products.map((item) => (
            <>
          <Forliked
            key={item._id}
            data={item}
          />
          </>
        ))}
      </div>
    </div>
  )
}

export default Liked
