import arProducts from "./arProducts";
import ARProductCard from "./ARProductCard";
import "./ar.css";
import { TbAugmentedReality } from "react-icons/tb";


const ARPage = () => {
  return (
    <div className="ar-page">
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
