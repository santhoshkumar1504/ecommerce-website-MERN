import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoArrowBackCircleSharp } from "react-icons/io5";

import logo from '../assets/logo.png';
import '../assets/styles/auth.css';

const Login = () => {

  const navigate = useNavigate();
  const [pass,setPass]=useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/signin",
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const changeTypeText=()=>{
    setPass(!pass)
  }

  const hangleClick=()=>{
    navigate('/')
  }

  return (
    <>
    <div className="back p-3"><button className="btn py-2 px-3 btn-primary" onClick={hangleClick}><IoArrowBackCircleSharp className="me-1"/>Back</button></div>
    <div className='form-box'>
    <div className='login-form'>

      <form onSubmit={handleSubmit}>
        <img src={logo} alt="logo" className='logo'/>
        <h4 className='text-center text-primary mt-2'>SIGN IN</h4>

        <label htmlFor="email" className='form-label'>Email</label>
        <input type="email" name="email" id="email" className='form-control' placeholder='Enter your email' onChange={handleChange}/>

        <label htmlFor="password" className='form-label mt-2'>Password</label>
        <div class="input-group mb-3">
        <input type={pass ? "password" : "text"} name="password" id="password" className='form-control' placeholder='Enter your password' onChange={handleChange} />
          {pass && <span class="input-group-text" id="basic-addon2" onClick={changeTypeText}><AiOutlineEye /></span>}
          {!pass && <span class="input-group-text" id="basic-addon2" onClick={changeTypeText}><AiOutlineEyeInvisible /></span>}
          </div>

        <div className='d-grid gap-2'>
        <button type="submit" className='btn btn-success mt-3'>Login</button>
        </div>
      </form>
      <hr />
     <small><a href="/send-code">Forgot Password?</a></small><br />
      <p className='text-center mt-1'>New User? <a href="/register">Create an account</a> 
          
</p>
    </div>

    </div>
    </>
  )
}

export default Login
