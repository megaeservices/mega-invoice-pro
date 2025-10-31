import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebaseClient';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    auth.signOut();
    setIsOpen(false);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Invoice Pro</h3>
        </div>
        <ul className="sidebar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>
              Settings
            </NavLink>
          </li>
          {currentUser && (
            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          )}
        </ul>
      </div>
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <div />
        <div />
        <div />
      </div>
    </>
  );
};

export default Sidebar;
