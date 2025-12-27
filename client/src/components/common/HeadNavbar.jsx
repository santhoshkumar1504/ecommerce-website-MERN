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


import logo from '../../assets/logo.png';
import '../../App.css'

const HeadNavbar=()=> {
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
              <NavDropdown.Item href="#action/3.2">
                <MdOutlineShoppingCartCheckout className='me-2'/>My Orders
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4"><MdFavoriteBorder className='me-2'/>
                Liked Products
              </NavDropdown.Item>
              <NavDropdown.Divider />

              <NavDropdown.Item href="/login">
              <MdLogin className='me-2'/>
                LogIn
              </NavDropdown.Item>

              <NavDropdown.Item href="#action/3.4" className='auth'>
              <MdLogout className='me-2'/>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeadNavbar;