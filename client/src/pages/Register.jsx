import '../assets/styles/auth.css';
import logo from '../assets/logo.png';
import { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Register = () => {

  const navigate=useNavigate();
  const [pass,setPass]=useState(true);


  const [formData,setFormData]=useState({
    name:"",
    email:"",
    password:"",
    phone:""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        formData,
        { withCredentials: true }
      );

      toast.success("Signup successful 🎉");

      // navigate after short delay so toast is visible
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed ❌"
      );
    }
  }

    const hangleClick=()=>{
    navigate('/')
  }

    const changeTypeText=()=>{
    setPass(!pass)
  }

  return (
    <>    <div className="back p-3"><button className="btn py-2 px-3 btn-primary" onClick={hangleClick}><IoArrowBackCircleSharp className="me-1"/>Back</button></div>
   
    <div className='form-box'>
        <div className='login-form'>
    
          <form onSubmit={handleSubmit}>
            <img src={logo} alt="logo" className='logo'/>
            <h4 className='text-center text-primary mt-2'>SIGN UP</h4>

             <label htmlFor="name" className='form-label'>Name</label>
            <input type="text" name="name" id="name" className='form-control' placeholder='Enter user name' required title="Enter your full name" onChange={handleChange}/>
    
            <label htmlFor="email" className='form-label'>Email</label>
            <input type="email" name="email" id="email" className='form-control' placeholder='Enter your email' pattern='[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$' required title="Enter a valid email address" onChange={handleChange}/>
    
            <label htmlFor="password" className='form-label mt-2'>Password</label>
                    <div class="input-group">
                    <input type={pass ? "password" : "text"} name="password" id="password" className='form-control' placeholder='Enter your password' required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"  onChange={handleChange}  title="Must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)" />
                      {pass && <span class="input-group-text" id="basic-addon2" onClick={changeTypeText}><AiOutlineEye /></span>}
                      {!pass && <span class="input-group-text" id="basic-addon2" onClick={changeTypeText}><AiOutlineEyeInvisible /></span>}
                      </div>

            <label htmlFor="phone" className='form-label mt-2'>Phone</label>
            <input type="tel" name="phone" id="phone" className='form-control' placeholder='Enter your phone number' required title="Enter your phone number (e.g. 638-456-7890)" onChange={handleChange}/>
            
            <div className='d-grid gap-2'>
              
            <button type="submit" className='btn btn-success mt-3' title='signup'>Signup</button>
            </div>
          </form>
          <hr />
          <p className='text-center mt-1'>Already have an account? <a href="/login" title='signin'>Signin</a> 
              
    </p>
        </div>
    
        </div>
         </>
  )
}

export default Register
