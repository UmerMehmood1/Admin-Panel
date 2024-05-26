import React, { useEffect, useState } from 'react';
import ProductTable from './ProductTable';
import CustomerTable from './CustomerTable';
import OrderTable from './OrderTable';
import CategoryTable from './CategoryTable';
import Sidebar from './SideBar';

export const Home = () => {
  const [selectedOption, setSelectedOption] = useState('Category');
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setSidebarVisible(window.innerWidth > 900);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handleResize initially to set the initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleMarginChange = (isVisible) => {
    setSidebarVisible(isVisible);
  };

  const getContentComponent = () => {
    switch (selectedOption) {
      case 'Category':
        return <CategoryTable />;
      case 'Product':
        return <ProductTable />;
      case 'Customer':
        return <CustomerTable />;
      case 'Order':
        return <OrderTable />;
      default:
        return null;
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onOptionClick={handleOptionChange} updateMargin={handleMarginChange} />
      <div style={{ marginLeft: isSidebarVisible ? '40vh' : '10vh', padding: '20px', marginTop: '50px', width: 'calc(100% - 250px)' }}>
        {getContentComponent()}
      </div>
    </div>
  );
}
export default Home