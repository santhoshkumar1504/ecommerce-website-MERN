import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../assets/styles/productlist.css"
import { IoIosHeartDislike } from "react-icons/io"
import Footer from "../components/common/Footer"
import { toast } from "react-toastify"
import { IoArrowBackCircleSharp } from "react-icons/io5";

const LikedProducts = () => {
    const navigate=useNavigate();
  const [products, setProducts] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [loading, setLoading] = useState(true)

      const hangleClick=()=>{
    navigate('/')
  }

  const disLike = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/liked/${productId}`,
        { withCredentials: true }
      );

      // Remove product from UI
      setProducts(prev =>
        prev.filter(item => item.productId._id !== productId)
      );

      toast.success("Removed from liked products");
    } catch (error) {
      toast.error("Failed to remove liked product");
    }
  };


  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/liked",
          { withCredentials: true }
        )

        setProducts(res.data.data.product || [])
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLikedProducts()
  }, [])

  if (loading) return <h3>Loading liked products...</h3>

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 className="msg">Please login to view your liked products</h2>
        <Link to="/login"><button>Login</button></Link>
      </div>
    )
  }

  return (
    <div className="liked-container">
      <div className="p-3"><button className="btn py-2 px-3 btn-primary" onClick={hangleClick}><IoArrowBackCircleSharp className="me-1"/>Back</button></div>
      <h2 className="mt-3 mb-1 about-title">Your Liked Products</h2>
      <hr className="hrline mb-4" />

      {products.length === 0 ? (
        <p className="msg">No liked products found.</p>
      ) : (
        <div className="liked-grid">
          {products.map((item) => {
            const product = item.productId

            return (
              <div key={item._id} className="product-box">
                <img
                  src={`http://localhost:5000/images/${item.pics}`}
                  alt={product?.productName}
                />

                <h4>{product?.productName}</h4>

                <p>
                  <strong>Brand:</strong> {product?.brand}<br />
                  <strong>Description:</strong> {product?.productDesc}<br />
                  <strong>Price:</strong> ₹{product?.discountedPrice}
                </p>

                <p>
                  ⭐ {product?.ratings} ({product?.numReview} reviews)
                </p>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-danger"
                    onClick={() => disLike(item.productId._id)}
                  >
                    <IoIosHeartDislike />
                  </button>

                  <button className="btn btn-primary">
                    Add to cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Footer />
    </div>
  )
}

export default LikedProducts
