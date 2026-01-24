import { useEffect, useRef, useState } from "react";

const ARProductCard = ({ item }) => {
  const modelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="ar-card">

      <model-viewer
        ref={modelRef}
        src={item.modelSrc}
        ar
        ar-modes="scene-viewer webxr quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        environment-image="neutral"
      >
        {isMobile && (
          <button slot="ar-button" className="ar-btn">
            View in your space
          </button>
        )}
      </model-viewer>

      <div className="card-info">
        <div>
          <h4>{item.name}</h4>
          <div className="rating">⭐ {item.rating}</div>
          <p>₹ {item.price}</p>
          <button className="btn btn-outline-success px-5">Buy</button>
        </div>
      </div>

    </div>
  );
};

export default ARProductCard;
