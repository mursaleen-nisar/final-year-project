import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FaHome } from 'react-icons/fa';
import './PageNotFound.css';

const PageNotFound = () => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`not-found-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="not-found-content">
        <div className="error-code">
          <h1>404</h1>
        </div>
        
        <div className="error-message">
          <h2>Page Not Found</h2>
          
          <p>
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="home-button-container">
          <Link to="/" className="home-button">
            <FaHome className="home-icon" />
            Back to Home
          </Link>
        </div>
        
        <div className="separator-container">
          <div className="separator"></div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
