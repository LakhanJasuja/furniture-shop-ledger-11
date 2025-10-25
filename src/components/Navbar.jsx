import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [showBuyerDropdown, setShowBuyerDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const sections = [
    { name: 'Cash Records', path: '/cash-records' },
    { name: 'Bank Records', path: '/bank-records' },
    { name: 'Record Transaction', path: '/record-transaction' },
    { name: 'Seller Records', path: '/seller-records' }
  ];

  const buyerRecordsOptions = [
    { name: 'Add a Customer', path: '/customer-records/add-customer' },
    { name: 'Customers', path: '/customer-records/customers' }
  ];

  const handleBuyerRecordsClick = () => {
    setShowBuyerDropdown(!showBuyerDropdown);
  };

  const handleBuyerOptionClick = () => {
    setShowBuyerDropdown(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleMobileMenuClick = () => {
    setShowMobileMenu(false);
    setShowBuyerDropdown(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isBuyerRecordsActive = () => {
    return location.pathname.startsWith('/buyer-records');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-header">
          <h1 className="navbar-title">Wood World Ledger</h1>
        </div>
        
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <ul className={`navbar-menu ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
        {sections.map((section) => (
          <li key={section.name} className="navbar-item">
            <Link
              to={section.path}
              className={`navbar-link ${isActive(section.path) ? 'active' : ''}`}
              onClick={handleMobileMenuClick}
            >
              {section.name}
            </Link>
          </li>
        ))}
        <li className="navbar-item dropdown">
          <button
            className={`navbar-link ${isBuyerRecordsActive() ? 'active' : ''}`}
            onClick={handleBuyerRecordsClick}
          >
            Customer Records ▼
          </button>
          {showBuyerDropdown && (
            <ul className="dropdown-menu">
              {buyerRecordsOptions.map((option) => (
                <li key={option.name} className="dropdown-item">
                  <Link
                    to={option.path}
                    className="dropdown-link"
                    onClick={handleBuyerOptionClick}
                  >
                    {option.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
