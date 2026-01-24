import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const ARViewer = ({ item, onClose }) => {
  const modelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  return (
    <div className="ar-modal">
      <button className="close-btn" onClick={onClose}>✕</button>

     <model-viewer
  src={item.modelSrc}
  ios-src={item.iosSrc}
  ar
  ar-modes="scene-viewer webxr quick-look"
  ar-placement="floor"
  ar-scale="fixed"
  camera-controls
  auto-rotate
  shadow-intensity="1"
  environment-image="neutral"
  style={{ width: "100%", height: "80vh" }}
>
  <button slot="ar-button" className="ar-btn">
    View in your space
  </button>
</model-viewer>

      {!isMobile && (
        <div className="qr-box">
          <p>Scan to view in AR</p>
          <QRCodeCanvas value={window.location.href} size={140} />
        </div>
      )}
    </div>
  );
};

export default ARViewer;
