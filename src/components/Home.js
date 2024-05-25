import React, { useEffect, useState } from 'react';
import ProductTable from './ProductTable';
import CustomerTable from './CustomerTable';
import OrderTable from './OrderTable';
import CategoryTable from './CategoryTable';
import Sidebar from './SideBar';

function Home() {
  const [selectedOption, setSelectedOption] = useState("Category");
  const [marginTable, setMarginTable] = useState(false); // Default to true to apply margin
  useEffect(() => {
    const handleResize = () => {
      setMarginTable(window.innerWidth <= 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleMarginChange = (isMargin) => {
    setMarginTable(isMargin);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onOptionClick={handleOptionChange} updateMargin={handleMarginChange} />
      <div style={{ marginLeft: marginTable ? '300px' : '50px', padding: '20px',marginTop:'50px', width: 'calc(100% - 250px)'}}>
      {
          selectedOption === "Category" ? <CategoryTable /> 
          : selectedOption === "Product" ? <ProductTable />
          : selectedOption === "Customer" ? <CustomerTable />
          : <OrderTable />
          }
      </div>
    </div>
  );
}

export default Home;
