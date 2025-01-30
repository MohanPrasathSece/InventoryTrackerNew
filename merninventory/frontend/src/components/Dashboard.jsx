import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get total orders
      const ordersResponse = await axios.get('http://localhost:5000/api/orders');
      setTotalOrders(ordersResponse.data.length);

      // Get total suppliers
      const suppliersResponse = await axios.get('http://localhost:5000/api/suppliers');
      setTotalSuppliers(suppliersResponse.data.length);

      // Get total products
      const productsResponse = await axios.get('http://localhost:5000/api/products');
      setTotalProducts(productsResponse.data.length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message || error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0 vh-100 bg-dark" style={{ position: 'fixed', left: 0, top: 0 }}>
            <Sidebar />
          </div>

          <div className="col-md-10 offset-md-2" style={{ marginTop: '60px' }}>
            <div className="mt-4 px-3">
              <h1>Admin Dashboard</h1>

              <div className="row mt-5">
                <div className="col-md-4">
                  <Card className="custom-card text-center mb-4">
                    <Card.Body>
                      <Card.Title>Total Orders</Card.Title>
                      <Card.Text>{totalOrders}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-4">
                  <Card className="custom-card text-center mb-4">
                    <Card.Body>
                      <Card.Title>Total Suppliers</Card.Title>
                      <Card.Text>{totalSuppliers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-4">
                  <Card className="custom-card text-center mb-4">
                    <Card.Body>
                      <Card.Title>Total Products</Card.Title>
                      <Card.Text>{totalProducts}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
