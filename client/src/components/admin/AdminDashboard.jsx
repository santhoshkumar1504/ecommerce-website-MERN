import logo from '../../assets/logo.png'
import './style.css'
import { MdProductionQuantityLimits, MdSell } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { FaBell, FaBars } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RxDashboard } from "react-icons/rx";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from "react-router-dom";

const AdminDashboard = () => {

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [productMenuOpen, setProductMenuOpen] = useState(false);
    const [ordersMenuOpen, setOrdersMenuOpen] = useState(false);



    const location = useLocation();


    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/v1/notifications/unread-count",
                { withCredentials: true }
            );
            setUnreadCount(res?.data?.data?.unreadCount || 0);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 20000);
        return () => clearInterval(interval);
    }, []);



    useEffect(() => {
        setOrdersMenuOpen(location.pathname.includes("/admin/orders"));
        setProductMenuOpen(
            location.pathname.includes("/admin/products") ||
            location.pathname.includes("/admin/categories")
        );
    }, [location.pathname]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/v1/users", { withCredentials: true })
            .then((res) => {
                let role = res?.data?.data?.isUser?.role
                if (role === 3) {
                    toast.error("Unautherised Access")
                    navigate('/')
                }


            })
            .catch((err) => {

                navigate('/login');
                toast.info("Login Required")
            })
    }, [])

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
                                <RxDashboard className='me-2' /> Dashboard
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
                            <div
                                className="submenu-title"
                                onClick={() => setOrdersMenuOpen(!ordersMenuOpen)}
                            >
                                <MdSell className="me-2" />
                                Orders
                            </div>

                            <ul className={`submenu ${ordersMenuOpen ? "open" : ""}`}>
                                <li>
                                    <NavLink
                                        to="/admin/orders"
                                        className={({ isActive }) =>
                                            isActive ? "active-link" : ""
                                        }
                                        onClick={closeSidebar}
                                    >
                                        All Orders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/admin/orders/placed"
                                        className={({ isActive }) =>
                                            isActive ? "active-link" : ""
                                        }
                                        onClick={closeSidebar}
                                    >
                                        Orders Placed
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/admin/orders/delivered"
                                        className={({ isActive }) =>
                                            isActive ? "active-link" : ""
                                        }
                                        onClick={closeSidebar}
                                    >
                                        Delivered Orders
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/admin/orders/cancelled"
                                        className={({ isActive }) =>
                                            isActive ? "active-link" : ""
                                        }
                                        onClick={closeSidebar}
                                    >
                                        Cancelled Orders
                                    </NavLink>
                                </li>
                            </ul>
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
                                to="/admin/notifications"
                                className={({ isActive }) => (isActive ? "active-link" : "")}
                                onClick={() => {
                                    closeSidebar();
                                    // refresh count when open page
                                    fetchUnreadCount();
                                }}
                            >
                                <span className="notif-link">
                                    <FaBell className="me-2" /> Notifications
                                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                                </span>
                            </NavLink>
                        </li>

                    </ul>
                </aside>

                <Outlet />

            </section>

            <style>
                {
                    `
                    .notif-link {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notif-badge {
  margin-left: auto;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}
  `
                }
            </style>
        </div>
    );
};

export default AdminDashboard;