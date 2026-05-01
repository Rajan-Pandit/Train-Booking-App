import React from 'react';
import { Link } from 'react-router-dom';
import './QuickLinks.css';

const QuickLinks = () => {
  const links = [
    {
      title: 'Book Train Ticket',
      description: 'Search and book train tickets for your journey',
      path: '/trains',
      icon: '🚂'
    },
    {
      title: 'My Bookings',
      description: 'View and manage your train bookings',
      path: '/bookings',
      icon: '🎫'
    },
    {
      title: 'Profile',
      description: 'Update your personal information',
      path: '/profile',
      icon: '👤'
    },
    {
      title: 'Train Schedule',
      description: 'Browse available trains and schedules',
      path: '/trains',
      icon: '📅'
    }
  ];

  return (
    <div className="quick-links">
      <h2>Quick Actions</h2>
      <div className="links-grid">
        {links.map((link, index) => (
          <Link key={index} to={link.path} className="link-card">
            <div className="link-icon">{link.icon}</div>
            <div className="link-content">
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
