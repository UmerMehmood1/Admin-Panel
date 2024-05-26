import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore/lite';
import { Puff } from 'react-loader-spinner';
import { db } from '../firebase';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const orderCollection = collection(db, 'Order');
      const orderSnapshot = await getDocs(orderCollection);
      const ordersData = orderSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const customerCollection = collection(db, 'Customer');
      const customerSnapshot = await getDocs(customerCollection);
      const customersData = {};
      customerSnapshot.forEach(doc => {
        customersData[doc.id] = doc.data().name;
      });
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderCollection = collection(db, 'Order');
      const querySnapshot = await getDocs(orderCollection);
      querySnapshot.forEach(async (doc) => {
        const orderData = doc.data();
        if (orderData.id === orderId) {
          await updateDoc(doc.ref, { status: newStatus });
          console.log('Order status updated:', orderId);
          fetchOrders(); // Refresh orders list
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      fetchOrders(); // Refresh orders list
    }
  };
  const renderStatusOptions = (orderId, currentStatus) => {
    return (
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(orderId, parseInt(e.target.value))}
      >
        <option value={0}>Pending</option>
        <option value={1}>Cancelled</option>
        <option value={2}>Delivered</option>
      </select>
    );
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
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50vh',
    }
  };

  return (
    <div style={styles.container}>
      <h1>Orders</h1>
      {(loadingOrders || loadingCustomers) ? (
        <div style={styles.loader}>
          <Puff color="#FF5722" height={80} width={80} />
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Customer Name</th>
              <th style={styles.th}>Customer ID</th>
              <th style={styles.th}>Product ID</th>
              <th style={styles.th}>Order Date</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={styles.td}>{order.id}</td>
                <td style={styles.td}>{customers[order.customerId]}</td>
                <td style={styles.td}>{order.customerId}</td>
                <td style={styles.td}>{order.productId}</td>
                <td style={styles.td}>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td style={styles.td}>{order.quantity}</td>
                <td style={styles.td}>
                  {renderStatusOptions(order.id, order.status)}
                </td>
                <td style={styles.td}>${order.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

OrderTable.propTypes = {
  orderId: PropTypes.string,
  customerId: PropTypes.string,
  productId: PropTypes.string,
  orderDate: PropTypes.number,
  quantity: PropTypes.number,
  status: PropTypes.number,
  totalPrice: PropTypes.number,
};

export default OrderTable;
