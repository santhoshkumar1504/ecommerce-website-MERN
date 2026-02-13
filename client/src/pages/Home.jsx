import { useEffect, useState } from "react";
import About from "../components/common/About";
import Banner from "../components/common/Banner";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/HeadNavbar";
import Liked from "../components/product/Liked";
import Productcontainer from "../components/product/ProductContainer";
import axios from "axios";
import CategorySection from "../components/product/CategorySection";


const Home = () => {
   const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/categorys")
      .then((res) => {
        setCategories(res.data.data.categoryExist);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/liked", {
        withCredentials: true,
      })
      .then((response) => {
        setLikedProducts(response.data.data.product || []);
      })
      .catch(() => {
        setLikedProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

    if (loading) return null; // or spinner


  return (
      <>
      <About/>
       {likedProducts.length > 0 && (
        <>
          <h3 className="mt-3 mb-1 about-title">Recommended For You</h3>
          <hr className="hrline mb-3" />
          <Liked products={likedProducts} />
        </>
      )}
      {categories.length>0 && <div><h3 className="mt-3 mb-1 about-title">Featured Products</h3>
      <hr className='hrline mb-3'/>
      <Productcontainer  detail="isFeatured=true"/>
       {categories.map((category) => (
        <CategorySection
          key={category._id}
          title={category.title}
        />
      ))} </div>}
      
      </>
  );
};

export default Home;
