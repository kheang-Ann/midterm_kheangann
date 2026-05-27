import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">Inventory Management</div>
        <div className="navbar-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/inventory" className="nav-link">Inventory</Link>
          <span className="nav-link">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
