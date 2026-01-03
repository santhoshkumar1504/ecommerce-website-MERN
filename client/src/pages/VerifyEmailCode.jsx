import '../assets/styles/auth.css';
import logo from '../assets/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyEmailCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [code, setCode] = useState("");

useEffect(() => {
    if (!email) {
      navigate("/verify-email");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
  await axios.post(
  "http://localhost:5000/api/v1/auth/verify-email",
  {
    email,
    code
  }
);


      toast.success("Code verified successfully");
      navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code");
    }
  };

  return (
    <div className="form-box">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="logo" className="logo" />
          <h4 className="text-center text-primary mt-2">
            VERIFY CODE
          </h4>

          <label className="form-label">Verification Code</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success mt-3">
              Verify Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailCode;
