import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Dashboard = () => {
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
    return <div className="text-center text-danger mt-5">{error} <br />
               <Link to='/login'>
             <div className="btn btn-success mt-3 px-4">
                Login
            </div>
            </Link></div>
  }

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">My Profile</h5>
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
                <span className="badge bg-warning ms-2">Not Verified</span>
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
          <button className="btn btn-outline-primary me-2">
            Edit Profile
          </button>
          <button className="btn btn-outline-danger">
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
