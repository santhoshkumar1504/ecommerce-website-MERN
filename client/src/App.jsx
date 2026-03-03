import Allroutes from "./routes/Allroutes"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VoiceAssistant from "./voice/VoiceAssistant";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <>
      <CartProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Allroutes />
        <VoiceAssistant />
      </CartProvider>
    </>
  )
}

export default App
