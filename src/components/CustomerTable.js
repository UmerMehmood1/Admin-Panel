import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs,  deleteDoc, doc, query, where } from 'firebase/firestore/lite';
import { Puff } from 'react-loader-spinner';
import { db } from '../firebase';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', address: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const customerCollection = collection(db, 'Customer');
      const customerSnapshot = await getDocs(customerCollection);
      const customersData = customerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteCustomer = async (customerId) => {
    try {
      // Query the document where the id attribute matches customerId
      const q = query(collection(db, 'Customer'), where('id', '==', customerId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id; // Get the document ID of the first match
        const customerRef = doc(db, 'Customer', docId);
        await deleteDoc(customerRef);
        console.log('Customer deleted:', customerId);
        fetchCustomers(); // Refresh customers list
      } else {
        console.log('No customer found with id:', customerId);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const styles = {
    container: {
      marginTop: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f2f2f2',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
      textAlign: 'left',
    },
    input: {
      marginRight: '10px',
      marginBottom: '10px',
      padding: '5px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    addButton: {
      padding: '8px 12px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#4CAF50',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
    },
    deleteButton: {
      backgroundColor: '#f44336',
      color: 'white',
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
    }
  };

  return (
    <div style={styles.container}>
      <h1>Customers</h1>
    
      {loading ? (
        <div style={styles.loader}>
          <Puff color="#FF5722" height={80} width={80} />
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Password</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td style={styles.td}>{customer.id}</td>
                <td style={styles.td}>{customer.name}</td>
                <td style={styles.td}>{customer.email}</td>
                <td style={styles.td}>{customer.address}</td>
                <td style={styles.td}>{customer.password}</td>
                <td style={styles.td}>
                  <button style={styles.deleteButton} onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

CustomerTable.propTypes = {
  customer_id: PropTypes.string,
  customerName: PropTypes.string,
  email: PropTypes.string,
  address: PropTypes.string,
  password: PropTypes.string,
  onDelete: PropTypes.func,
};

export default CustomerTable;
