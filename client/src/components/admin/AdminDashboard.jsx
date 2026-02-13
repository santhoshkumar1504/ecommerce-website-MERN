import logo from '../../assets/logo.png'
import './style.css'
import { MdProductionQuantityLimits, MdSell } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { FaBell, FaBars } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RxDashboard } from "react-icons/rx";

const AdminDashboard = () => {

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [productMenuOpen, setProductMenuOpen] = useState(false);

    const handleClick = () => {
        navigate('/');
    };

    // Close sidebar
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Prevent body scroll when sidebar open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.classList.add("sidebar-open");
        } else {
            document.body.classList.remove("sidebar-open");
        }
    }, [sidebarOpen]);

    return (
        <div className='admin-container'>
            <section className='admin-section'>

                {/* HEADER */}
                <header className='header'>
                    <button
                        className='menu-toggle'
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <FaBars />
                    </button>
                    ShopNexa Dashboard
                </header>

                {/* OVERLAY (Mobile Only) */}
                {sidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={closeSidebar}
                    ></div>
                )}

                {/* SIDEBAR */}
                <aside className={`aside ${sidebarOpen ? "show-sidebar" : ""}`}>

                    <div className="p-1 text-center">
                        <button
                            className="btn py-2 px-3 btn-primary"
                            onClick={() => {
                                handleClick();
                                closeSidebar();
                            }}
                        >
                            <IoArrowBackCircleSharp className="me-1" />
                            Go To Website
                        </button>
                    </div>

                    <img src={logo} alt="ShopNexa" className='nav-icon' />
                    <h1>Admin Panel</h1>
                    <h3>Ecommerce Dashboard</h3>

                    <ul className='menu-list'>
                        <li>
                            <NavLink
                                to='/admin/dashboard'
                                className={({ isActive }) =>
                                    isActive ? "active-link" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <RxDashboard className='me-2'/> Dashboard
                            </NavLink>
                        </li>
                        {/* PRODUCTS */}
                        <li>
                            <div
                                className='submenu-title'
                                onClick={() => setProductMenuOpen(!productMenuOpen)}
                            >
                                <MdProductionQuantityLimits className='me-2' />
                                Products
                            </div>

                            <ul className={`submenu ${productMenuOpen ? "open" : ""}`}>

                                <li>
                                    <NavLink
                                        to='/admin/products'
                                        className={({ isActive }) =>
                                            isActive ? "active-link" : ""
                                        }
                                        onClick={closeSidebar}
                                    >
                                        Products List
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to='/admin/categories'
                                        className={({ isActive }) =>
                                            isActive ? "active-link" : ""
                                        }
                                        onClick={closeSidebar}
                                    >
                                        Categories
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        {/* OTHER LINKS */}
                        <li>
                            <NavLink
                                to='/admin/sales'
                                className={({ isActive }) =>
                                    isActive ? "active-link" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <MdSell className='me-2' /> Sales
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to='/admin/customers'
                                className={({ isActive }) =>
                                    isActive ? "active-link" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <HiUsers className='me-2' /> Customers
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to='/admin/notifications'
                                className={({ isActive }) =>
                                    isActive ? "active-link" : ""
                                }
                                onClick={closeSidebar}
                            >
                                <FaBell className='me-2' /> Notifications
                            </NavLink>
                        </li>

                    </ul>
                </aside>

                <Outlet />

            </section>
        </div>
    );
};

export default AdminDashboard;