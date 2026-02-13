import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import image from '../../assets/photos/chend.jpg'
import './style.css'
import { useEffect, useState } from "react";
import axios from "axios";

const AllProducts = () => {
const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);

useEffect(() => {
  axios
    .get('http://localhost:5000/api/v1/products')
    .then((res) => {
      const list = res?.data?.data?.productDetails;
      setProducts(list);   // ✅ Correct
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
}, []);

    return (
        <section className='section-1'>
           {!loading && <div>
                <div className='section-inner-head'>
                    <h2>Products</h2>
                    <button className='btn btn-primary'>Add Products</button>
                </div>
                <div className="table-responsive">
                    <table className='table table-hover inner-table'>
                        <thead>
                            <tr>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((items)=>{
                               return <tr key={items._id}>
                                <td><img src={`http://localhost:5000/images/${items.pic.fileName}`} alt="p-name" className='p-img' /></td>
                                <td>{items.productName}</td>
                                <td>{items.category.title}</td>
                                <td>{items.price}</td>
                                <td>{items.quantity}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn btn-success">
                                            <FaEdit className="me-1" />
                                            Edit
                                        </button>

                                        <button className="btn btn-danger">
                                            <MdDelete className="me-1" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>}
        </section>
    )
}

export default AllProducts
