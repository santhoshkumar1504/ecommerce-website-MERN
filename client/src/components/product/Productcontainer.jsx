import { useEffect, useState } from 'react';
import Product from './Product';
import '../../assets/styles/product.css';
import axios from 'axios';
import ProductP from './ProductP';

const Productcontainer = ({ detail }) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/v1/products?${detail}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [detail]);   // ✅ added detail dependency

  return (
    <div className='container-fluid my-2 maincontainer mb-4'>
      <div className="main-p">

        {loading && <h5>Loading...</h5>}

        {!loading && data?.data?.productDetails?.length === 0 && (
          <h5>No Products Found</h5>
        )}

        {!loading &&
          data?.data?.productDetails?.map((product) => (
            <ProductP data={product} key={product._id} />
          ))}

      </div>
    </div>
  );
};

export default Productcontainer;