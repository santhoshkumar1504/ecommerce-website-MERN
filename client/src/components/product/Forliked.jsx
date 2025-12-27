import '../../assets/styles/product.css';
import image1 from '../../assets/photos/watch.jpg';
import { GrFavorite } from "react-icons/gr";
import { CiStar } from "react-icons/ci";


const Forliked = ({data}) => {
  return (
    <div className=''>
      <div className="products">
            <img src={`http://localhost:5000/images/${data.pics}`} alt="imagename" className='product-img'/>
            <h6 className='product-detail mt-2'>{data.productId.productName}</h6>
            <div className='product-detail'>{data.productId.productDesc}<br /><strong>Price: &#8377;{data.productId.price}</strong>
             <div className='d-flex review'>
                <div className='mt-1'>
                <CiStar className='star'/> {data.productId.ratings} | {data.productId.numReview} reviews
                </div>
            </div>

             <div className='my-1'>
            <div className="btn btn-danger mx-1"><GrFavorite/></div>
            <div className="btn btn-primary mx-1">Add to Cart</div>
        </div>
</div>

      </div>
    </div>
  )
}

export default Forliked
