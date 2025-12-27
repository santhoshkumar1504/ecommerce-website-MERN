import About from "../components/common/About";
import Banner from "../components/common/Banner";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/HeadNavbar";
import Liked from "../components/product/Liked";
import Productcontainer from "../components/product/ProductContainer";

const Home = () => {
  return (
      <>
      <About/>
      <h3 className="mt-3 mb-1 about-title">Recommented For You</h3>
      <hr className='hrline mb-3'/>
      <Liked/>
      <h3 className="mt-3 mb-1 about-title">Featured Products</h3>
      <hr className='hrline mb-3'/>
      <Productcontainer  detail="isFeatured=true"/>
      <h3 className="mt-3 mb-1 about-title">Shirts</h3>
      <hr className='hrline mb-3'/>
      <Productcontainer  detail="category=shoes"/>
      <h3 className="mt-3 mb-1 about-title">Gadgets</h3>
      <hr className='hrline mb-3'/>
      <Productcontainer  detail="category=shoes"/>
      </>
  );
};

export default Home;
