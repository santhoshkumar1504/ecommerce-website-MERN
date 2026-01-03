import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { MdLogout } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdLogin } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import logo from '../../assets/logo.png';
import '../../App.css'
import { useEffect, useState } from 'react';

const HeadNavbar=()=> {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  // 🔹 Check auth on page load
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/users", {
        withCredentials: true,
      })
      .then((res) => {
        setIsAuthenticated(true);
        setUserRole(res.data.data.isUser.role);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserRole(null);
      });
  }, []);

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );

      toast.success("Logged out successfully");
      setIsAuthenticated(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary text-center">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} alt="logo" className='brand-logo'/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

       <div className="input-group mx-2">
  <input type="search" className="form-control" placeholder="Search" aria-label="product" aria-describedby="basic-addon2"/>
  <span className="input-group-text" id="basic-addon2">
  <IoSearch />
    </span>
</div>
          <Nav className="ms-auto fs-6">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/products">Products</Nav.Link>
            <Nav.Link href="/categories">Categories</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            <Nav.Link href="#link" className='text-center'>
              <div className='cartNotify'>
                     <FaCartShopping className='me-1 text-dark cart-icon'/>
              <div className='cart-title me-1'>Cart</div>
              <div className="cartCount">3</div>
              </div>
            </Nav.Link>
            <NavDropdown title="User " id="basic-nav-dropdown">
              <NavDropdown.Item href="/dashboard">
              <FaRegUserCircle className='me-2'/>
              My Profile</NavDropdown.Item>
              <NavDropdown.Item href="/orders">
                <MdOutlineShoppingCartCheckout className='me-2'/>My Orders
              </NavDropdown.Item>
              <NavDropdown.Item href="/likedproduct"><MdFavoriteBorder className='me-2'/>
                Liked Products
              </NavDropdown.Item>
              <NavDropdown.Divider />
              {isAuthenticated && (userRole === 1 || userRole === 2) && (
                <NavDropdown.Item href="/admin/dashboard">
                  <FaRegUserCircle className="me-2" />
                  Admin Dashboard
                </NavDropdown.Item>
              )}

              {!isAuthenticated && (
                <NavDropdown.Item href="/login">
                  <MdLogin className="me-2" />
                  LogIn
                </NavDropdown.Item>
              )}

            {isAuthenticated && (
              <NavDropdown.Item onClick={handleLogout}>
                <MdLogout className="me-2" />
                Logout
              </NavDropdown.Item>
            )}

            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeadNavbar;