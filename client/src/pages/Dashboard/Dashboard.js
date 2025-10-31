import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/invoices', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    if (currentUser) {
      fetchInvoices();
    }
  }, [currentUser]);

  return (
    <div className="dashboard">
      <h1>Welcome to Invoice Pro</h1>
      <Link to="/create-invoice">
        <button className="create-invoice-btn">Create New Invoice</button>
      </Link>
      <div className="recent-invoices">
        <h2>Recent Invoices</h2>
        {invoices.length > 0 ? (
          <ul>
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                Invoice ID: {invoice.id} - Customer: {invoice.customerName} - Total: ${invoice.total.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
