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
import { Link, useNavigate } from "react-router-dom";
import { TbAugmentedReality } from "react-icons/tb";
import { IoChevronDown } from "react-icons/io5";
import logo from '../../assets/logo.png';
import '../../App.css'
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';

const HeadNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();
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

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/search?q=${search}`);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary text-center">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} alt="logo" className='brand-logo' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <div className="input-group ig1 mx-2">
            <input
              type="search"
              className="form-control"
              value={search}
              placeholder="Search products..."
              aria-label="product"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={handleSearch}
            >
              <IoSearch />
            </span>
          </div>
          <Nav className="ms-auto fs-6">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            <Nav.Link as={Link} to="/cart" className='text-center position-relative'>
              Cart 🛒
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Nav.Link>
            <NavDropdown
              id="basic-nav-dropdown"
              className="custom-user-dropdown"
              title={
                <span className="user-dropdown-title">
                  <FaRegUserCircle className="me-1" />
                  User
                  <IoChevronDown className="custom-user-arrow" />
                </span>
              }
            >
              <NavDropdown.Item href="/dashboard">
                <FaRegUserCircle className='me-2' />
                My Profile</NavDropdown.Item>
              <NavDropdown.Item href="/orders">
                <MdOutlineShoppingCartCheckout className='me-2' />My Orders
              </NavDropdown.Item>
              <NavDropdown.Item href="/likedproduct"><MdFavoriteBorder className='me-2' />
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

              {/* {isAuthenticated && (
                <NavDropdown.Item as={Link} to="/3d">
                  <TbAugmentedReality className="me-2" />
                  3D Products
                </NavDropdown.Item>
              )} */}

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