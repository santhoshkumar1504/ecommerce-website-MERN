import { useEffect, useState } from "react";
import axios from "axios";
import CategorySection from "../components/product/CategorySection";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/categorys")
      .then((res) => {
        setCategories(res.data.data.categoryExist);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {categories.map((category) => (
        <CategorySection
          key={category._id}
          title={category.title}
        />
      ))}
    </div>
  );
};

export default Category;
