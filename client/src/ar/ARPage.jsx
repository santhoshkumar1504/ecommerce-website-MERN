import arProducts from "./arProducts";
import ARProductCard from "./ARProductCard";
import "./ar.css";
import { TbAugmentedReality } from "react-icons/tb";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const ARPage = () => {
  const navigate=useNavigate()
    const hangleClick=()=>{
    navigate('/')
  }

  return (
    <div className="ar-page">

        <div className="p-3"><button className="btn py-2 px-3 btn-primary" onClick={hangleClick}><IoArrowBackCircleSharp className="me-1"/>Back</button></div>
    

      <h2 className="text-center py-5 fw-bold"><TbAugmentedReality className="me-2" />3D & AR Products</h2>

      <div className="ar-grid">
        {arProducts.map((item) => (
          <ARProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ARPage;
