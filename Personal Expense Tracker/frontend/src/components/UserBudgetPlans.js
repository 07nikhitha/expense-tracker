import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserReports.css';

const UserBudgetPlans = () => {
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [categories, setCategories] = useState({});
  const { id } = useParams(); // Get user ID from URL params

  useEffect(() => {
    const fetchBudgetPlans = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/budget/user/${id}`);
        setBudgetPlans(response.data);
        const categoryIds = [...new Set(response.data.flatMap(plan => plan.categories))];
        fetchCategories(categoryIds);
      } catch (error) {
        console.error('Error fetching budget plans:', error);
      }
    };

    fetchBudgetPlans();
  }, [id]);

  // Function to fetch category names
  const fetchCategories = async (categoryIds) => {
    try {
      const requests = categoryIds.map(categoryId =>
        axios.get(`http://localhost:5000/categories/${categoryId}`)
      );
      const responses = await Promise.all(requests);
      const categoryMap = {};
      responses.forEach(res => {
        categoryMap[res.data._id] = res.data.categoryName;
      });
      setCategories(categoryMap);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function to select a budget plan
  const selectBudgetPlan = (plan) => {
    localStorage.removeItem('budgetPlan');
    localStorage.setItem('budgetPlan', JSON.stringify(plan));
    alert('New budget plan selected!');
  };

  return (
    <div style={{ backgroundColor: 'rgb(0, 123, 255)', padding: '20px', borderRadius: '8px' }}>
      <h1 style={{ color: 'white' }}>Your Budget Plans</h1>
      {budgetPlans.length > 0 ? (
        <table className="table table-striped table-bordered" style={{ backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Allocated Amount</th>
              <th>Created Date</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {budgetPlans.map((plan) => (
              <tr key={plan._id}>
                <td>
                  {plan.categories.map((catId, index) => (
                    <div key={index}>{categories[catId] || 'Unknown'}</div>
                  ))}
                </td>
                <td>
                  {plan.allocatedAmounts.map((amt, index) => (
                    <div key={index}>{amt}</div>
                  ))}
                </td>
                <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => selectBudgetPlan(plan)} 
                    className="btn btn-primary"
                    style={{ backgroundColor: 'rgb(0, 123, 255)', border: 'none' }}
                  >
                    Select Budget Plan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: 'white' }}>No budget plans created yet.</p>
      )}
    </div>
  );
};

export default UserBudgetPlans;
