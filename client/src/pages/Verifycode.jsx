import '../assets/styles/auth.css';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Verifycode = () => {
    return (
        <div className='form-box'>
            <div className='login-form'>

                <form action="" method="post">
                    <img src={logo} alt="logo" className='logo' />
                    <h4 className='text-center text-primary mt-2'>VERIFY CODE</h4>

                    <label htmlFor="code" className='form-label'>Code</label>
                    <input type="number" name="code" id="code" className='form-control' placeholder='Enter verification code' />

                        <div className='d-grid gap-2'>
                        <Link to={"/"} className='text-decoration-none text-white'>
                            <button type="submit" className='btn btn-success mt-3'>
                                Verify Code
                            </button>
                        </Link>
                        </div>
                </form>
            </div>

        </div>
    )
}

export default Verifycode
