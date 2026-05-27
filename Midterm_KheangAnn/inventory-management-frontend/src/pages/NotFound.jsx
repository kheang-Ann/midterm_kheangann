import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1 data-testid="not-found-title">404</h1>
      <p data-testid="not-found-message">Page Not Found</p>
      <Link to="/dashboard">
        <button className="btn-primary">Go to Dashboard</button>
      </Link>
    </div>
  );
};

export default NotFound;
