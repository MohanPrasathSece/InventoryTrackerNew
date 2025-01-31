import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddOrder from './components/AddOrder';
import Layout from './components/Layout';
import './App.css';
import ViewOrders from './components/ViewOrders';
import ManageOrders from './components/ManageOrders';
import AddSupplier from './components/AddSupplier';
import ManageSuppliers from './components/ManageSuppliers';
import EditSupplier from './components/EditSupplier';
import AddProduct from './components/AddProduct';
import ManageProducts from './components/ManageProducts';
import EditProduct from './components/EditProduct';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Nested routes under /dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="orders/add" element={<AddOrder />} />
          <Route path="orders/view" element={<ViewOrders />} />
          <Route path="orders/manage" element={<ManageOrders />} />
          <Route path="suppliers/add" element={<AddSupplier />} />
          <Route path="suppliers/manage" element={<ManageSuppliers />} />
          <Route path="suppliers/edit/:id" element={<EditSupplier />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/manage" element={<ManageProducts />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
