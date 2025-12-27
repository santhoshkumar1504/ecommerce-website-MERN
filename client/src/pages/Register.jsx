import '../assets/styles/auth.css';
import logo from '../assets/logo.png';


const Register = () => {
  return (
    <div className='form-box'>
        <div className='login-form'>
    
          <form action="" method="post">
            <img src={logo} alt="logo" className='logo'/>
            <h4 className='text-center text-primary mt-2'>SIGN UP</h4>

             <label htmlFor="name" className='form-label'>Name</label>
            <input type="text" name="name" id="name" className='form-control' placeholder='Enter user name'/>
    
            <label htmlFor="email" className='form-label'>Email</label>
            <input type="email" name="email" id="email" className='form-control' placeholder='Enter your email'/>
    
            <label htmlFor="password" className='form-label mt-2'>Password</label>
            <input type="password" name="password" id="password" className='form-control' placeholder='Enter your password'/>

            <label htmlFor="phone" className='form-label mt-2'>Phone</label>
            <input type="tel" name="phone" id="phone" className='form-control' placeholder='Enter your phone number'/>
            
            <label htmlFor="pincode" className='form-label mt-2'>Pincode</label>
            <input type="number" name="password" id="password" className='form-control' placeholder='Enter area pincode'/>
    
            <div className='d-grid gap-2'>
            <button type="submit" className='btn btn-success mt-3'>Signup</button>
            </div>
          </form>
          <hr />
          <p className='text-center mt-1'>Already have an account? <a href="/login">Signin</a> 
              
    </p>
        </div>
    
        </div>
  )
}

export default Register
