import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import HeadNavbar from "../components/common/HeadNavbar";
import Footer from "../components/common/Footer";
import DetailedProduct from "../components/product/DetailedProduct";
import ProductCarousel from "../components/product/ProductCarousel";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  // fetch data
  const [allProducts, setAllProducts] = useState([])
  const { fetchCartCount } = useCart();
const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/v1/products/${id}`
        );

        setProduct(res?.data?.data?.product);

        const recommendation = await axios.get(
          `http://localhost:5000/api/v1/products?brand=${res?.data?.data?.product?.brand}`
        );
        const filteredProducts = recommendation?.data?.data?.productDetails.filter(
          p => p._id !== res?.data?.data?.product?._id
        );
        setAllProducts(filteredProducts);
      } catch (error) {
        console.log(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);   // ✅ ONLY id here


  const handleAddToCart = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/v1/cart/add",
      {
        productId: product._id,
        quantity: quantity,
      },
      { withCredentials: true }
    );

    fetchCartCount(); // 🔥 update navbar count
    navigate("/cart");

  } catch (error) {
    if (error.response?.status === 401) {
      navigate("/login");
    }
  }
};

  return (
    <div>
      <HeadNavbar />
      <DetailedProduct data={product} />
      <ProductCarousel products={allProducts} />
      <Footer />
    </div>
  )
}

export default ProductDetailsPage
