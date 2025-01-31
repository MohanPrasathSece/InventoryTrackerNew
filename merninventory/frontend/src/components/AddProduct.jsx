import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    supplier: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      setError('Error fetching suppliers: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/products', formData);
      // Navigate immediately after successful response
      navigate('/dashboard/products/manage');
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding product. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Product</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Supplier</label>
          <select
            className="form-control"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          >
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">
            Add Product
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard/products/manage')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
