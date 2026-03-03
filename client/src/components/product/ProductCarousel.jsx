import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = ({ products = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
    ],
  };

  const renderCard = (item) => {
    const imageUrl = `http://localhost:5000/images/${item?.pic?.fileName}`;

    return (
      <div key={item._id} className="slide-item">

        {/* ✅ Wrap entire card with Link */}
        <Link
          to={`/products/${item._id}`}
          className="text-decoration-none text-dark"
        >
          <div className="card-wrapper">

            <div className="image-box">
              <img src={imageUrl} alt={item.productName} />
            </div>

            <div className="card-body">
              <h6>{item.productName}</h6>

              <p className="desc">{item.productDesc}</p>

              <div className="bottom">
                <span className="price">
                  ₹{item.discountedPrice || item.price}
                </span>

                {/* ✅ Prevent navigation when clicking button */}
                <button
                  className="cart-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Add to cart clicked");
                  }}
                >
                  Add
                </button>
              </div>
            </div>

          </div>
        </Link>

      </div>
    );
  };

  return (
    <div className="carousel-wrapper">
      {isMobile ? (
        <div className="mobile-grid">
          {products.map(renderCard)}
        </div>
      ) : (
        <Slider {...settings}>
          {products.map(renderCard)}
        </Slider>
      )}

      <style>{`
        .carousel-wrapper {
          width: 92%;
          margin: 40px auto;
        }

        .mobile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }

        .slide-item {
          padding: 8px;
        }

        .card-wrapper {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          transition: 0.3s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-wrapper:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        }

        .image-box {
          height: 200px;
          background: #f8f8f8;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .image-box img {
          max-height: 180px;
          max-width: 100%;
          transition: 0.4s ease;
        }

        .card-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-body .desc {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bottom {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-weight: 700;
          font-size: 15px;
          color: #e63946;
        }

        .cart-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 25px;
          font-size: 12px;
          transition: 0.3s ease;
        }

        .cart-btn:hover {
          background: #ff6b00;
        }
      `}</style>
    </div>
  );
};

export default ProductCarousel;