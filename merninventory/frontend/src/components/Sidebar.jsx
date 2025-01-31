import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false); 
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false); 

  const toggleOrdersDropdown = () => {
    setIsOrdersOpen(!isOrdersOpen);
  };

  const toggleSuppliersDropdown = () => {
    setIsSuppliersOpen(!isSuppliersOpen);
  };

  const toggleProductsDropdown = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  const toggleSalesDropdown = () => {
    setIsSalesOpen(!isSalesOpen);
  };

  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h4>Menu</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/dashboard" className="nav-link text-white d-flex align-items-center">
            <i></i> Dashboard
          </Link>
        </li>

        {/* Orders Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleOrdersDropdown}
            style={{ cursor: 'pointer' }}>
            <i ></i> Orders
            <i className={`bi ${isOrdersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isOrdersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/orders/add" className="nav-link text-white">
                  Add Orders
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/orders/view" className="nav-link text-white">
                  View Orders
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/orders/manage" className="nav-link text-white">
                  Manage Orders
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Suppliers Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleSuppliersDropdown}
            style={{ cursor: 'pointer' }}>
            <i ></i> Suppliers
            <i className={`bi ${isSuppliersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isSuppliersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/add" className="nav-link text-white">
                  Add Supplier
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/manage" className="nav-link text-white">
                  Manage Suppliers
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Products Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleProductsDropdown}
            style={{ cursor: 'pointer' }}>
            <i ></i> Products
            <i className={`bi ${isProductsOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isProductsOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/products/add" className="nav-link text-white">
                  Add Product
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/products/manage" className="nav-link text-white">
                  Manage Products
                </Link>
              </li>
            </ul>
          )}
        </li>
        
        {/* Sales Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleSalesDropdown}
            style={{ cursor: 'pointer' }}>
            <i></i> Sales & Reports
            <i className={`bi ${isSalesOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isSalesOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/add" className="nav-link text-white">
                Add Sales Record
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/manage" className="nav-link text-white">
                Manage Sales
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/report" className="nav-link text-white">
                Generate Report
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
