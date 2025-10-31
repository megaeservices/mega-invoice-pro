import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './CustomersPage.css';

const CustomersPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const token = await currentUser.getIdToken();
    const method = editingCustomerId ? 'PUT' : 'POST';
    const url = editingCustomerId ? `/api/customers/${editingCustomerId}` : '/api/customers';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCustomers();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address });
    setEditingCustomerId(customer.id);
  };

  const handleDelete = async (customerId) => {
    if (!currentUser) return;
    try {
      const token = await currentUser.getIdToken();
      await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingCustomerId(null);
  };

  return (
    <div className="customers-page">
      <div className="customers-container">
        <h1>Customer Management</h1>
        <div className="customer-form-container">
          <h2>{editingCustomerId ? 'Edit Customer' : 'Add Customer'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
            </div>
            <button type="submit" className="save-button">{editingCustomerId ? 'Update' : 'Save'}</button>
            {editingCustomerId && <button type="button" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
        <div className="customer-list-container">
          <h2>Customer List</h2>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td className="actions-cell">
                    <button className="edit-button" onClick={() => handleEdit(customer)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(customer.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
