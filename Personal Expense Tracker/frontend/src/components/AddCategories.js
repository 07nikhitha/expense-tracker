import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCategories = () => {
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user._id;

  // Handle adding a new category
  const handleAddCategory = () => {
    if (category) {
      axios.post('http://localhost:5000/categories', { categoryName: category })
        .then(() => {
          setCategory('');
          alert('Category added successfully!');
        })
        .catch((error) => console.error('Error adding category:', error));
    } else {
      alert('Please enter a category name.');
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ backgroundColor: 'rgb(0,123,255)', minHeight: '100vh' }}
    >
      <div 
        className="card p-4" 
        style={{ width: '50%', maxWidth: '600px', textAlign: 'center', backgroundColor: 'white' }}
      >
        <h1 className="mb-4">Add Categories</h1>
        <input 
          type="text" 
          className="form-control mb-3" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="Enter category name" 
        />
        <button className="btn btn-primary w-100 mb-3" onClick={handleAddCategory}>
          Add Category
        </button>
        <button 
          className="btn btn-secondary w-100" 
          onClick={() => navigate(`/budget/${userId}`)}
        >
          Make Plan
        </button>
      </div>
    </div>
  );
};

export default AddCategories;
