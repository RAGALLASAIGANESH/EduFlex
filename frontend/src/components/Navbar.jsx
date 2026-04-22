import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const styles = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2563eb',
      textDecoration: 'none',
    },
    mobileMenuBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px',
      fontSize: '24px',
    },
    mobileMenu: {
      position: 'absolute',
      top: '60px',
      right: '10px',
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    mobileLink: {
      textDecoration: 'none',
      color: '#333',
      padding: '8px 12px',
      borderRadius: '4px',
      transition: 'background 0.3s',
    },
    mobileUser: {
      padding: '8px 12px',
      fontWeight: 'bold',
    },
    mobileLogoutBtn: {
      background: '#dc3545',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    loginBtn: {
      background: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    signupBtn: {
      background: '#28a745',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    rightSection: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    navLink: {
      color: '#333',
      textDecoration: 'none',
      fontWeight: '500',
      padding: '8px 12px',
      borderRadius: '4px',
      transition: 'background 0.3s',
    },
    searchBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '4px',
      transition: 'background 0.3s',
    },
    userName: {
      fontWeight: 'bold',
      color: '#333',
    },
    logoutBtn: {
      background: '#dc3545',
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    navLinks: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    authButtons: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    profileContainer: {
      position: 'relative',
    },
    profileBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '4px',
      transition: 'background 0.3s',
    },
    profileDropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 1000,
    },
    userInfo: {
      marginBottom: '10px',
    },
    userEmail: {
      margin: '0',
      fontSize: '14px',
      color: '#666',
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        EduFlex
      </Link>
      <div style={styles.rightSection}>
        {user ? (
          <>
            <Link to="/" style={styles.navLink}>
              Home
            </Link>
            <Link to="/learn" style={styles.navLink}>
              Learn
            </Link>
            <Link to="/dashboard" style={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/roadmap" style={styles.navLink}>
              Roadmap
            </Link>
            <Link to="/interview" style={styles.navLink}>
              Interview
            </Link>
            <motion.button
              onClick={logout}
              style={styles.logoutBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link to="/login">
              <motion.button
                style={styles.loginBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                style={styles.signupBtn}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
