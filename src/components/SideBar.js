import React, { useState, useEffect } from 'react';
import { FaAlignJustify } from 'react-icons/fa';

// Define the CSS as a JavaScript object
const styles = {
  topbarContainer: {
    width: '100%',
    height: '60px',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 0px',
    color: 'white',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '1000',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateY(0)', // Show topbar by default
  },
  topbarLinksContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // Ensure all links are vertically centered
  },
  sidebarContainer: {
    width: '200px',
    height: '100vh',
    backgroundColor: '#333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '20px',
    color: 'white',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1000',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(0)', // Show sidebar by default
  },
  sidebarContainerHidden: {
    transform: 'translateX(-200px)', // Hide sidebar by moving it to the left
  },
  topbarContainerHidden: {
    transform: 'translateY(-60px)', // Hide topbar by moving it up
  },
  topbarLogo: {
    margin: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  logo:{
    fontSize: '24px',
    fontWeight: 'bold',
  },
  linksContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '20px',
  },
link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '18px',
    margin: '10px',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  linkHover: {
    backgroundColor: '#575757',
  },
  burgerMenu: {
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
    display: 'none',
  },
  toggleButton: {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    position: 'relative',
    bottom: "300px",
    left: "100px"
  },
  // Media query for mobile devices
  '@media (max-width: 768px)': {
    sidebarContainer: {
      display: 'none',
    },
    burgerMenu: {
      display: 'block',
    },
  },
};

const Sidebar = ({ onOptionClick, updateMargin }) => {
  const [isMobileView, setMobileView] = useState(window.innerWidth <= 900);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isTopbarVisible, setTopbarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const newSidebarState = !isSidebarVisible;
    setSidebarVisible(newSidebarState);
    updateMargin(newSidebarState);
    if (isMobileView) {
      updateMargin(newSidebarState); // Update margin only when sidebar visibility changes
    }
  };

  const handleOptionClick = (option) => {
    onOptionClick(option);
    if (isMobileView) {
      setSidebarVisible(false); // Hide sidebar on mobile after selecting an option
    }
  };

  return (
    <>
      {isMobileView ? (
        <>
          <div
            style={styles.burgerMenu}
            onClick={toggleSidebar}
          >
            &#9776; {/* Burger menu icon */}
          </div>
          <div
            style={{
              ...styles.topbarContainer,
              ...(isTopbarVisible ? {} : styles.topbarContainerHidden),
            }}
          >
            <div style={styles.topbarLogo}>
              MyLogo
            </div>
            <div style={styles.topbarLinksContainer}>
              <a
                onClick={() => handleOptionClick("Category")}
                style={styles.link}
                onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                Category
              </a>
              <a
                onClick={() => handleOptionClick("Product")}
                style={styles.link}
                onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                Product
              </a>
              <a
                onClick={() => handleOptionClick("Customer")}
                style={styles.link}
                onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                Customer
              </a>
              <a
                onClick={() => handleOptionClick("Order")}
                style={styles.link}
                onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
              >
                Order
              </a>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            ...styles.sidebarContainer,
            ...(isSidebarVisible ? {} : styles.sidebarContainerHidden),
          }}
        >
          <div style={styles.logo}>
            MyLogo
          </div>
          <div style={styles.linksContainer}>
            <a
              onClick={() => handleOptionClick("Category")}
              style={styles.link}
              onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              Category
            </a>
            <a
              onClick={() => handleOptionClick("Product")}
              style={styles.link}
              onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              Product
            </a>
            <a
              onClick={() => handleOptionClick("Customer")}
              style={styles.link}
              onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              Customer
            </a>
            <a
              onClick={() => handleOptionClick("Order")}
              style={styles.link}
              onMouseEnter={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              Order
            </a>
          </div>
          <FaAlignJustify style={styles.toggleButton}  onClick={toggleSidebar}/>
        </div>
      )}
    </>
  );
};

export default Sidebar;
