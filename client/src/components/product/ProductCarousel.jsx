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
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add to cart:", item.productName);
  };

  const renderCard = (item) => {
    const imageUrl = `http://localhost:5000/images/${item?.pic?.fileName}`;
    const shortDesc = item?.productDesc
      ? item.productDesc.replace(/[#*_`>|-]/g, "").slice(0, 55)
      : "";

    return (
      <div key={item._id} className="pcard-slide">
        <Link
          to={`/products/${item._id}`}
          className="pcard-link"
        >
          <div className="pcard-box">
            <div className="pcard-image-area">
              <img
                src={imageUrl}
                alt={item.productName}
                className="pcard-image"
              />
            </div>

            <div className="pcard-content">
              <h6 className="pcard-title">{item.productName}</h6>

              <p className="pcard-desc">
                {shortDesc}
                {item?.productDesc?.length > 55 ? "..." : ""}
              </p>

              <div className="pcard-footer">
                <span className="pcard-price">
                  ₹{item.discountedPrice || item.price}
                </span>

                <button
                  type="button"
                  className="pcard-add-btn"
                  onClick={(e) => handleAddToCart(e, item)}
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
    <div className="pcard-wrapper">
      {products.length === 0 ? (
        <div className="pcard-empty">No products found</div>
      ) : isMobile ? (
        <div className="pcard-grid">
          {products.map(renderCard)}
        </div>
      ) : (
        <Slider {...settings}>
          {products.map(renderCard)}
        </Slider>
      )}

      <style>{`
        .pcard-wrapper {
          width: 94%;
          margin: 28px auto;
        }

        .pcard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .pcard-slide {
          padding: 8px;
          box-sizing: border-box;
        }

        .pcard-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .pcard-box {
          background: #ffffff;
          border: 1px solid #ececec;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          height: 255px;
          display: flex;
          flex-direction: column;
        }

        .pcard-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1);
        }

        .pcard-image-area {
          height: 115px;
          background: #f7f7f7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          overflow: hidden;
        }

        .pcard-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .pcard-box:hover .pcard-image {
          transform: scale(1.05);
        }

        .pcard-content {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pcard-title {
          font-size: 15px;
          font-weight: 700;
          color: #222;
          margin: 0 0 8px;
          line-height: 1.35;
          min-height: 40px;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pcard-desc {
          font-size: 12px;
          color: #666;
          line-height: 1.45;
          margin: 0 0 10px;
          min-height: 34px;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pcard-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .pcard-price {
          font-size: 16px;
          font-weight: 700;
          color: #e53935;
          white-space: nowrap;
        }

        .pcard-add-btn {
          background: #111;
          color: #fff;
          border: none;
          border-radius: 22px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pcard-add-btn:hover {
          background: #ff6b00;
        }

        .pcard-add-btn:active {
          transform: scale(0.97);
        }

        .pcard-empty {
          text-align: center;
          padding: 24px;
          color: #666;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eee;
        }

        .pcard-wrapper .slick-prev,
        .pcard-wrapper .slick-next {
          z-index: 2;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }

        .pcard-wrapper .slick-prev:before,
        .pcard-wrapper .slick-next:before {
          color: #111;
          font-size: 18px;
        }

        .pcard-wrapper .slick-prev {
          left: -6px;
        }

        .pcard-wrapper .slick-next {
          right: -6px;
        }

        @media (max-width: 768px) {
          .pcard-box {
            height: 240px;
          }

          .pcard-image-area {
            height: 100px;
          }

          .pcard-title {
            font-size: 14px;
            min-height: 38px;
          }

          .pcard-desc {
            font-size: 11px;
            min-height: 30px;
          }

          .pcard-price {
            font-size: 15px;
          }

          .pcard-add-btn {
            padding: 5px 12px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCarousel;