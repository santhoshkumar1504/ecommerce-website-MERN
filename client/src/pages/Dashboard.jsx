import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import usernotfount from '../assets/401.png'
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Dashboard = () => {
  const navigate=useNavigate();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/v1/users', {
        withCredentials: true, // remove if using token header
      })
      .then((res) => {
        setUser(res.data.data.isUser)
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load your profile')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center mt-5">Loading profile...
    </div>
  }

  if (error) {
    return <div className="text-center text-danger mt-5 fs-4 fw-bold">{error} <br />
               <Link to='/login'>
             <div className="btn btn-success mt-5 px-4">
                Login
            </div>
            </Link>
            <br />
            <img src={usernotfount} alt="404 Error" className='mt-5' style={{height:"50vh"}}/>
            </div>
  }

  const verifyAccount=()=>{
    navigate('/verify-email')
  }

    const hangleClick=()=>{
    navigate('/')
  }


  return (
    <div className="container my-4">
          <div className="p-3"><button className="btn py-2 px-3 btn-primary" onClick={hangleClick}><IoArrowBackCircleSharp className="me-1"/>Back</button></div>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0 py-2">My Profile</h5>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4 fw-semibold">Name</div>
            <div className="col-md-8">{user.name}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4 fw-semibold">Email</div>
            <div className="col-md-8">
              {user.email}{' '}
              {user.isVerified ? (
                <span className="badge bg-success ms-2">Verified</span>
              ) : (
                <span className="badge bg-warning ms-2" style={{cursor:'pointer'}} onClick={verifyAccount}>Not Verified</span>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4 fw-semibold">Phone</div>
            <div className="col-md-8">{user.phone || '—'}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4 fw-semibold">Address</div>
            <div className="col-md-8">{user.address || '—'}</div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4 fw-semibold">Pincode</div>
            <div className="col-md-8">{user.pincode || '—'}</div>
          </div>
        </div>

        <div className="card-footer text-end">
          <Link to={'edit'}>
          <button className="btn btn-outline-primary me-2">
            Edit Profile
          </button>
          </Link>
          <Link to={'change-password'}>
          <button className="btn btn-outline-danger">
            Change Password
          </button>
          </Link>
        </div>
      </div>

      <Outlet/>
    </div>
  )
}

export default Dashboard
