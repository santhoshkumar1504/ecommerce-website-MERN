import '../assets/styles/auth.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Email = () => {
  return (
    <div className='form-box'>
            <div className='login-form'>
        
              <form action="" method="post">
                <img src={logo} alt="logo" className='logo'/>
                <h4 className='text-center text-primary mt-2'>SEND VERIFICATION EMAIL</h4>
    
                 <label htmlFor="email" className='form-label'>Email</label>
                <input type="email" name="email" id="email" className='form-control' placeholder='Enter email to send verification code'/> 
                 <div className='d-grid gap-2'>
                    <Link to={"/verify-code"} className='text-decoration-none text-white'>
                <button type="submit" className='btn btn-success mt-3'>
                    Send Code
                    
                    </button>
                    </Link>
                </div>
          
              </form>
            </div>
        
            </div>
  )
}

export default Email
