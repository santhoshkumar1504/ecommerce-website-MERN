import { useEffect, useState } from "react";
import axios from "axios";
import Productcontainer from "./ProductContainer";

const CategorySection = ({ title }) => {
  const [hasProducts, setHasProducts] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/products?category=${title}`)
      .then((res) => {
        const products = res.data.data.productDetails || [];
        setHasProducts(products.length > 0);
      })
      .catch(() => {
        setHasProducts(false);
      });
  }, [title]);

  if (!hasProducts) return null; // 🔥 hide empty categories

  return (
    <>
      <h3 className="mt-3 mb-1 about-title">{title}</h3>
      <hr className="hrline mb-3" />
      <Productcontainer detail={`category=${title}`} />
    </>
  );
};

export default CategorySection;
