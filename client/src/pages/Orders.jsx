import axios from "axios"
import { useEffect, useState } from "react"
import { Link ,useNavigate} from "react-router-dom"
import "../assets/styles/productlist.css"
import Footer from "../components/common/Footer"
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Orders = () => {
  const [products, setProducts] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [loading, setLoading] = useState(true)
    const navigate=useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/orders/user",
          { withCredentials: true }
        )

        setProducts(res.data.data.order || [])
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])


        const hangleClick=()=>{
    navigate('/')
  }

  if (loading) return <h3>Loading orders...</h3>

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 className="msg">Please login to view your orders</h2>
        <Link to="/login"><button>Login</button></Link>
      </div>
    )
  }

  return (
    <div className="liked-container">
            <div className="p-3"><button className="btn py-2 px-3 btn-primary" onClick={hangleClick}><IoArrowBackCircleSharp className="me-1"/>Back</button></div>
      <h2 className="mt-3 mb-1 about-title">Your Orders</h2>
      <hr className="hrline mb-4" />

      {products.length === 0 ? (
        <p className="msg">You have no orders yet.</p>
      ) : (
        <div className="liked-grid">
          {products.map((item) => {
  const product = item.product

  return (
    <div key={item._id} className="product-box">
      <img
        src={`http://localhost:5000/images/${product?.pic}`}
        alt={product?.pic}
      />

      <h4>{product?.name}</h4>

      <p>
        <strong>Brand:</strong> {product?.brand}<br />
        <strong>Description:</strong> {product?.desc}<br />
        <strong>Price:</strong> ₹{product?.discountedPrice}
      </p>

      <p>
        ⭐ {product?.ratings} ({product?.numReview} reviews)
      </p>

      <button className="btn btn-success w-100">
        {item.status}
      </button>
      <button className="btn btn-danger w-100 mt-2">
        Cancel Order
      </button>
    </div>
  )
})}

        </div>
      )}

      <Footer />
    </div>
  )
}

export default Orders
