import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome to Train Booking</h1>
            <p>Your journey starts here</p>
          </div>
          <div className="auth-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
