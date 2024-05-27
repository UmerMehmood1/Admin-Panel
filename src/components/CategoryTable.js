import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore/lite";
import Modal from "react-modal";
import { Puff } from "react-loader-spinner";
import { db } from "../firebase";
import { toast } from "sonner";
const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    id: "",
    title: "",
    description: "",
    position: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false); // New state for add modal

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleAddModalSubmit = async () => {
    if (
      !newCategory.title ||
      !newCategory.description ||
      !newCategory.position
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Derive the id from the title
      const id = newCategory.title.toLowerCase().replace(/\s+/g, "-");
      const categoryWithId = { ...newCategory, id };

      await addDoc(collection(db, "Category"), categoryWithId);
      console.log("Added category:", categoryWithId);
      setNewCategory({ id: "", title: "", description: "", position: "" });
      fetchCategories();
      closeAddModal(); // Close modal after adding
      toast.success("Category added Successfully.")
    } catch (error) {
      toast.error("Error adding category.");
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categoryCollection = collection(db, "Category");
      const categorySnapshot = await getDocs(categoryCollection);
      const categoriesData = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      // Query the document where categoryId matches
      const q = query(
        collection(db, "Category"),
        where("id", "==", categoryId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id; // Get the document ID of the first match
        const categoryRef = doc(db, "Category", docId);
        await deleteDoc(categoryRef);
        console.log("Category deleted:", categoryId);
        fetchCategories();
        toast.success("Category deleted Successfully.")
      } else {
        toast.error("No category found.")
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const handleEditCategory = async (categoryId, newData) => {
    try {
      const q = query(
        collection(db, "Category"),
        where("id", "==", categoryId)
      );
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.empty){
        const docId = querySnapshot.docs[0].id;
        const categoryRef = doc(db, "Category", docId);
        await updateDoc(categoryRef, newData);
        fetchCategories();
        setEditModalOpen(false);
        toast.success("Category Updated Successfully~")
      }
      else{
        toast.error("No category found!")
      }
    } catch (error) {
      toast.error(error)
      
    }
  };

  const openEditModal = (category) => {
    setEditCategory(category);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditModalSubmit = () => {
    handleEditCategory(editCategory.id, {
      title: editCategory.title,
      description: editCategory.description,
      position: editCategory.position,
    });
    closeEditModal();
  };

  const styles = {
    container: {
      width: '80vh',
      marginTop: "20px",
      fontFamily: "Arial, sans-serif",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      backgroundColor: "#f2f2f2",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      textAlign: "left",
    },
    input: {
      marginRight: "10px",
      marginBottom: "10px",
      padding: "5px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    addButton: {
      padding: "8px 12px",
      border: "none",
      borderRadius: "4px",
      backgroundColor: "#4CAF50",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
    },
    actionButtons: {
      display: "flex",
    },
    editButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      marginRight: "5px",
    },
    deleteButton: {
      backgroundColor: "#f44336",
      color: "white",
    },
    loader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    },
  };

  return (
    <div style={styles.container}>
      <h1>Categories</h1>
      <button style={styles.addButton} onClick={openAddModal}>
        Add Category
      </button>
      {loading ? (
        <div style={styles.loader}>
          <Puff color="#FF5722" height={80} width={80} />
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Position</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td style={styles.td}>{category.id}</td>
                <td style={styles.td}>{category.title}</td>
                <td style={styles.td}>{category.description}</td>
                <td style={styles.td}>{category.position}</td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.editButton}
                      onClick={() => openEditModal(category)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
        style={{
          overlay: {
            zIndex: 15000,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          },
          content: {
            zIndex: 15001,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          },
        }}
        isOpen={editModalOpen}
        onRequestClose={closeEditModal}
      >
        <h2>Edit Category</h2>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={editCategory.title}
            onChange={(e) =>
              setEditCategory({ ...editCategory, title: e.target.value })
            }
            style={styles.input}
          />
          <br />
          <input
            type="text"
            placeholder="Description"
            value={editCategory.description}
            onChange={(e) =>
              setEditCategory({ ...editCategory, description: e.target.value })
            }
            style={styles.input}
          />
          <br />
          <input
            type="text"
            placeholder="Position"
            value={editCategory.position}
            onChange={(e) =>
              setEditCategory({ ...editCategory, position: e.target.value })
            }
            style={styles.input}
          />
          <br />
          <button style={styles.addButton} onClick={handleEditModalSubmit}>
            Save Changes
          </button>
          <button
            style={{
              ...styles.addButton,
              backgroundColor: "#ccc",
              marginLeft: "10px",
            }}
            onClick={closeEditModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <Modal
        style={{
          overlay: {
            zIndex: 15000,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          },
          content: {
            zIndex: 15001,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          },
        }}
        isOpen={addModalOpen}
        onRequestClose={closeAddModal}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Add Category
        </h2>
        <div style={{ textAlign: "center" }}>
          <input
            type="text"
            placeholder="Title"
            value={newCategory.title}
            onChange={(e) =>
              setNewCategory({ ...newCategory, title: e.target.value })
            }
            style={styles.input}
          />
          <br />
          <input
            type="text"
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            style={styles.input}
          />
          <br />
          <input
            type="text"
            placeholder="Position"
            value={newCategory.position}
            onChange={(e) =>
              setNewCategory({ ...newCategory, position: e.target.value })
            }
            style={styles.input}
          />
          <br />
          <button style={styles.addButton} onClick={handleAddModalSubmit}>
            Add Category
          </button>
          <button
            style={{
              ...styles.addButton,
              backgroundColor: "#ccc",
              marginLeft: "10px",
            }}
            onClick={closeAddModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

CategoryTable.propTypes = {
  category_id: PropTypes.string,
  categoryName: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};
export default CategoryTable