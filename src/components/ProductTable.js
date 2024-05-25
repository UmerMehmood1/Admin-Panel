import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore/lite';
import Modal from 'react-modal';
import { Puff } from 'react-loader-spinner';
import { db } from '../firebase';

const ProductTable = () => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState({
        categoryId: '',
        name: '',
        description: '',
        imageUrl: '',
        price: '',
        stock: '',
        weight: '',
        cost: '',
    });
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        categoryId: '',
        name: '',
        description: '',
        imageUrl: '',
        price: '',
        stock: '',
        weight: '',
        cost: '',
    });
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const productCollection = collection(db, 'Product');
            const productSnapshot = await getDocs(productCollection);
            const productsData = productSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            setNotification('Error fetching products:', error)
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoryCollection = collection(db, 'Category');
            const categorySnapshot = await getDocs(categoryCollection);
            const categoriesData = categorySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.categoryId || !newProduct.name || !newProduct.description || !newProduct.imageUrl || !newProduct.price || !newProduct.stock) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const productData = {
                categoryId: newProduct.categoryId,
                name: newProduct.name,
                description: newProduct.description,
                imageUrl: newProduct.imageUrl,
                price: newProduct.price,
                stock: newProduct.stock,
                weight: newProduct.weight,
                cost: newProduct.cost,
            };

            // Add the product data to the Firestore collection
            await addDoc(collection(db, 'Product'), productData);
            console.log('Product added:', productData);
            setNewProduct({
                categoryId: '',
                name: '',
                description: '',
                imageUrl: '',
                price: '',
                stock: '',
                weight: '',
                cost: '',
            });
            fetchProducts(); // Refresh products list
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const categoryCollection = collection(db, 'Product');
            const categorySnapshot = await getDocs(categoryCollection);
            const categoriesData = categorySnapshot.docs.map(doc => ({
                docId: doc.id,
                ...doc.data()
            }));
    
            const categoryToDelete = categoriesData.find(category => category.id === productId);
    
            if (categoryToDelete) {
                const categoryRef = doc(db, 'Product', categoryToDelete.docId);
                await deleteDoc(categoryRef);
                console.log('Product deleted:', productId);
                fetchProducts()
            } else {
                console.error('Product not found with id:', productId);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    
    
    
    const openAddModal = () => {
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
    };

    const handleEditProduct = async (productId, newData) => {
        try {
            // Find the product to update based on the productId
            const productToUpdate = products.find(product => product.id === productId);
    
            if (productToUpdate) {
                // Get the reference to the document in Firestore
                const productRef = doc(db, 'Product', productToUpdate.id);
                
                // Update the document with the new data
                await updateDoc(productRef, newData);
                
                console.log('Product updated:', productId);
                
                // Refresh products list
                fetchProducts();
                
                // Close edit modal after updating
                setEditModalOpen(false);
            } else {
                console.error('Product not found with id:', productId);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const openEditModal = (product) => {
        setEditProduct(product);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const handleEditModalSubmit = () => {
        handleEditProduct(editProduct.id, editProduct); // For demonstration, update with all fields
        closeEditModal();
    };

    const styles = {
        container: {
            marginTop: '20px',
            fontFamily: 'Arial,sans-serif',
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
        actionButtons: {
            display: 'flex',
            zIndex: 20,
        },
        editButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            marginRight: '5px',
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
        },
        modal: {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
        },
        modalInput: {
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
        },
        modalButton: {
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px',
        },
        modalLabel: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
        },
    };
    return (
        <div style={styles.container}>
            <h1>Products</h1>
            <button style={styles.addButton} onClick={openAddModal}>Add Product</button>
            <Modal
                isOpen={addModalOpen}
                onRequestClose={closeAddModal}
                style={styles.modal}
            >
                <h2>Add Product</h2>
                {notification && <div style={styles.notification}>{notification}</div>}
                <div>
                    <label style={styles.modalLabel}>Name</label>
                    <input
                        type="text"
                        style={styles.modalInput}
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Description</label>
                    <input
                        type="text"
                        style={styles.modalInput}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Category ID</label>
                    <select
                        style={styles.modalInput}
                        value={newProduct.categoryId}
                        onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.title}</option>
                        ))}
                    </select>
                    <label style={styles.modalLabel}>Price</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Stock</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Weight</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Cost</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={newProduct.cost}
                        onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Image URL</label>
                    <input
                        type="text"
                        style={styles.modalInput}
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        placeholder="Image URL"
                    />
                </div>
                <button style={styles.modalButton} onClick={handleAddProduct}>Add Product</button>
            </Modal>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Image</th>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Category ID</th>
                        <th style={styles.th}>Price</th>
                        <th style={styles.th}>Stock</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" style={styles.loader}>
                                <Puff color="#FF5722" height={80} width={80} />
                            </td>
                        </tr>
                    ) : (
                        products.map(product => (
                            <tr key={product.id}>
                                <td style={styles.td}><img src={product.imageUrl} width={100} height={80} alt="Product" /></td>
                                <td style={styles.td}>{product.id}</td>
                                <td style={styles.td}>{product.name}</td>
                                <td style={styles.td}>{product.description}</td>
                                <td style={styles.td}>{product.categoryId}</td>
                                <td style={styles.td}>${product.price}</td>
                                <td style={styles.td}>{product.stock}</td>
                                <td style={styles.td}>
                                    <div style={styles.actionButtons}>
                                    <button style={styles.editButton} onClick={() => openEditModal(product)}>Edit</button>
                                        <button style={styles.deleteButton} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Modal
                isOpen={editModalOpen}
                onRequestClose={closeEditModal}
                style={styles.modal}
            >
                <h2>Edit Product</h2>
                <div>
                    <label style={styles.modalLabel}>Name</label>
                    <input
                        type="text"
                        style={styles.modalInput}
                        value={editProduct.name}
                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Description</label>
                    <input
                        type="text"
                        style={styles.modalInput}
                        value={editProduct.description}
                        onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Category ID</label>
                    <select
                        style={styles.modalInput}
                        value={editProduct.categoryId}
                        onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.title}</option>
                        ))}
                    </select>
                    <label style={styles.modalLabel}>Price</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Stock</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={editProduct.stock}
                        onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Weight</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={editProduct.weight}
                        onChange={(e) => setEditProduct({ ...editProduct, weight: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Cost</label>
                    <input
                        type="number"
                        style={styles.modalInput}
                        value={editProduct.cost}
                        onChange={(e) => setEditProduct({ ...editProduct, cost: e.target.value })}
                    />
                    <label style={styles.modalLabel}>Image URL</label>
                    <input
                        type="text"
                        style={styles.modalInput}
                        value={editProduct.imageUrl}
                        onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                    />
                    <button style={styles.modalButton} onClick={handleEditModalSubmit}>Save</button>
                    <button style={styles.modalButton} onClick={closeEditModal}>Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

ProductTable.propTypes = {
    product_id: PropTypes.string,
    productName: PropTypes.string,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func
};

export default ProductTable;
