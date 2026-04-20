import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BudgetPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [inputs, setInputs] = useState([{ category: '', amount: '' }]);
  const [planName, setPlanName] = useState('');
  const [income, setIncome] = useState('');

  // Fetch categories from backend
  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // Add new input field for a category and amount
  const handleAddInput = () => setInputs([...inputs, { category: '', amount: '' }]);

  // Handle input changes for each category/amount pair
  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  // Submit the budget plan to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.some(input => !input.category || input.amount <= 0)) {
      alert('Please fill in all categories and ensure amounts are positive.');
      return;
    }

    const budgetPlan = {
      planName,
      totalIncome: income,
      categories: inputs.map(input => input.category),
      allocatedAmounts: inputs.map(input => parseFloat(input.amount)), // Ensure amounts are numbers
      user: id  // Ensure id is included
    };
    localStorage.removeItem('budgetPlan');
    try {
      await axios.post('http://localhost:5000/budget', budgetPlan);
      localStorage.setItem('budgetPlan', JSON.stringify(budgetPlan));
      alert('Budget Plan Saved');
    } catch (error) {
      console.error('Error saving budget plan:', error);
      alert('Some error occurred while saving the budget plan.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'rgb(0,123,255)' }}>
      <div className="card p-4" style={{ width: '50%', maxWidth: '600px', backgroundColor: 'white' }}>
        <h2 className="text-center mb-4">Create Budget Plan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Plan Name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Total Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />
          </div>
          {inputs.map((input, index) => (
            <div key={index} className="mb-3 d-flex align-items-center">
              <select
                className="form-select me-2"
                value={input.category}
                onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                ))}
              </select>
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                value={input.amount}
                onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary w-100 mb-3"
            style={{ fontSize: '1.5rem' }}
            onClick={handleAddInput}
          >
            +
          </button>

          <button type="submit" className="btn btn-primary w-100 mb-3">Submit</button>
        </form>
        <div className="text-center mb-3">
          Wish to add more Categories?
          <button className="btn btn-link" onClick={() => navigate(`/add-categories/${id}`)}>Add More Categories</button>
        </div>
        <div className="text-center">
          See how people create their Budget Plans
          <button className="btn btn-link" onClick={() => navigate(`/public-users/${id}`)}>Here</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlan;
