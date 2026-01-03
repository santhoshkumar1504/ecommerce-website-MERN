import '../assets/styles/auth.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/v1/auth/verify-email-code",
        { email :email }
      );

      toast.success("Verification code sent to email");

      // 👉 navigate with email
      navigate("/verify-email-code", {
        state: { email },
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-box">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="logo" className="logo" />
          <h4 className="text-center text-primary mt-2">
            SEND VERIFICATION EMAIL
          </h4>

          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-success mt-3">
              Send Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
