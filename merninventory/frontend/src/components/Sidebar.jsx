import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false); 
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRefs = useRef({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries({
        orders: isOrdersOpen,
        suppliers: isSuppliersOpen,
        products: isProductsOpen
      }).forEach(([key, isOpen]) => {
        if (isOpen && dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          closeDropdown(key);
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOrdersOpen, isSuppliersOpen, isProductsOpen]);

  // Close dropdowns when route changes
  useEffect(() => {
    closeAllDropdowns();
    setIsMobileMenuOpen(false);
  }, [location]);

  const closeAllDropdowns = () => {
    setIsOrdersOpen(false);
    setIsSuppliersOpen(false);
    setIsProductsOpen(false);
  };

  const closeDropdown = (dropdown) => {
    switch(dropdown) {
      case 'orders':
        setIsOrdersOpen(false);
        break;
      case 'suppliers':
        setIsSuppliersOpen(false);
        break;
      case 'products':
        setIsProductsOpen(false);
        break;
      default:
        break;
    }
  };

  const toggleDropdown = (dropdown, event) => {
    event.stopPropagation();
    closeAllDropdowns();
    switch(dropdown) {
      case 'orders':
        setIsOrdersOpen(!isOrdersOpen);
        break;
      case 'suppliers':
        setIsSuppliersOpen(!isSuppliersOpen);
        break;
      case 'products':
        setIsProductsOpen(!isProductsOpen);
        break;
      default:
        break;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom fixed-top">
      <div className="container-fluid">
        <Link to="/dashboard" className="navbar-brand">Inventory Tracker</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                to="/dashboard" 
                className={`nav-link text-black ${location.pathname === '/dashboard' ? 'active fw-bold' : ''}`}
              >
                Dashboard
              </Link>
            </li>

            {/* Orders Dropdown */}
            <li className="nav-item dropdown" ref={el => dropdownRefs.current.orders = el}>
              <button 
                className={`nav-link dropdown-toggle text-black bg-transparent border-0 ${location.pathname.includes('/dashboard/orders') ? 'active fw-bold' : ''}`}
                onClick={(e) => toggleDropdown('orders', e)}
                aria-expanded={isOrdersOpen}
              >
                Orders
              </button>
              <ul className={`dropdown-menu ${isOrdersOpen ? 'show' : ''}`}>
                <li>
                  <Link 
                    to="/dashboard/orders/add" 
                    className={`dropdown-item ${location.pathname === '/dashboard/orders/add' ? 'active' : ''}`}
                  >
                    Add Orders
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard/orders/view" 
                    className={`dropdown-item ${location.pathname === '/dashboard/orders/view' ? 'active' : ''}`}
                  >
                    View Orders
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard/orders/manage" 
                    className={`dropdown-item ${location.pathname === '/dashboard/orders/manage' ? 'active' : ''}`}
                  >
                    Manage Orders
                  </Link>
                </li>
              </ul>
            </li>

            {/* Suppliers Dropdown */}
            <li className="nav-item dropdown" ref={el => dropdownRefs.current.suppliers = el}>
              <button 
                className={`nav-link dropdown-toggle text-black bg-transparent border-0 ${location.pathname.includes('/dashboard/suppliers') ? 'active fw-bold' : ''}`}
                onClick={(e) => toggleDropdown('suppliers', e)}
                aria-expanded={isSuppliersOpen}
              >
                Suppliers
              </button>
              <ul className={`dropdown-menu ${isSuppliersOpen ? 'show' : ''}`}>
                <li>
                  <Link 
                    to="/dashboard/suppliers/add" 
                    className={`dropdown-item ${location.pathname === '/dashboard/suppliers/add' ? 'active' : ''}`}
                  >
                    Add Supplier
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard/suppliers/manage" 
                    className={`dropdown-item ${location.pathname === '/dashboard/suppliers/manage' ? 'active' : ''}`}
                  >
                    Manage Suppliers
                  </Link>
                </li>
              </ul>
            </li>

            {/* Products Dropdown */}
            <li className="nav-item dropdown" ref={el => dropdownRefs.current.products = el}>
              <button 
                className={`nav-link dropdown-toggle text-black bg-transparent border-0 ${location.pathname.includes('/dashboard/products') ? 'active fw-bold' : ''}`}
                onClick={(e) => toggleDropdown('products', e)}
                aria-expanded={isProductsOpen}
              >
                Products
              </button>
              <ul className={`dropdown-menu ${isProductsOpen ? 'show' : ''}`}>
                <li>
                  <Link 
                    to="/dashboard/products/add" 
                    className={`dropdown-item ${location.pathname === '/dashboard/products/add' ? 'active' : ''}`}
                  >
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard/products/manage" 
                    className={`dropdown-item ${location.pathname === '/dashboard/products/manage' ? 'active' : ''}`}
                  >
                    Manage Products
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
