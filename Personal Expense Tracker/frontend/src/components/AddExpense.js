import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddExpense = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [expense, setExpense] = useState({ expenseTitle: '', amount: '', category: '', date: '', user: id });

  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/expenses', expense);
      alert('Expense Added');
      setExpense({ expenseTitle: '', amount: '', category: '', date: '', user: id });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'rgb(0,123,255)' }}>
      <div className="card p-4" style={{ width: '50%', maxWidth: '500px', backgroundColor: 'white' }}>
        <h2 className="text-center mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="expenseTitle"
              className="form-control"
              placeholder="Expense Title"
              value={expense.expenseTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="Amount"
              value={expense.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <select
              name="category"
              className="form-select"
              value={expense.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="date"
              name="date"
              className="form-control"
              value={expense.date}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Expense</button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
