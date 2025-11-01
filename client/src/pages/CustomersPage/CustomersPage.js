import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebaseClient';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import './CustomersPage.css';

const CustomersPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const fetchCustomers = useCallback(async () => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'customers'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const customersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchCustomers();
    }
  }, [currentUser, fetchCustomers]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      if (editingCustomerId) {
        // Update existing customer
        const customerDoc = doc(db, 'customers', editingCustomerId);
        await updateDoc(customerDoc, { ...formData });
      } else {
        // Add new customer
        await addDoc(collection(db, 'customers'), { ...formData, userId: currentUser.uid });
      }
      fetchCustomers();
      resetForm();
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
      const customerDoc = doc(db, 'customers', customerId);
      await deleteDoc(customerDoc);
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
