import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PublicUsers = () => {
  const [publicUsers, setPublicUsers] = useState([]);
  const [selectedUserPlans, setSelectedUserPlans] = useState([]);
  const [categories, setCategories] = useState({});

  // Fetch all public users
  useEffect(() => {
    const fetchPublicUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/publicUsers');
        setPublicUsers(response.data);
      } catch (error) {
        console.error('Error fetching public users:', error);
      }
    };

    fetchPublicUsers();
  }, []);

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

  // Fetch budget plans for a selected user
  const fetchUserBudgetPlans = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/budget/user/${userId}`);
      const budgetPlans = response.data;

      setSelectedUserPlans(budgetPlans);

      // Extract unique category IDs from the plans
      const categoryIds = [
        ...new Set(budgetPlans.flatMap(plan => plan.categories))
      ];

      // Fetch category names for these IDs
      fetchCategories(categoryIds);
    } catch (error) {
      console.error('Error fetching user budget plans:', error);
    }
  };

  return (
    <div style={{ backgroundColor: 'rgb(0, 123, 255)', padding: '20px', borderRadius: '8px' }}>
      <h1 className="text-white text-center">Public Users</h1>
      <ul className="list-group mb-4">
        {publicUsers.length > 0 ? (
          publicUsers.map((user) => (
            <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span className="text-dark ">{user.name} ({user.email})</span>
              <button 
                className="btn btn-light btn-sm" 
                onClick={() => fetchUserBudgetPlans(user._id)}>
                View Budget Plans
              </button>
            </li>
          ))
        ) : (
          <p className="text-white text-center">No public users found.</p>
        )}
      </ul>

      {selectedUserPlans.length > 0 && (
        <div className="table-responsive">
          <h2 className="text-white text-center mb-4">Selected User's Budget Plans</h2>
          <table className="table table-striped table-bordered text-white">
            <thead className="table-light">
              <tr>
                <th>Plan Name</th>
                <th>Categories</th>
                <th>Allocated Amounts</th>
              </tr>
            </thead>
            <tbody>
              {selectedUserPlans.map((plan) => (
                <tr key={plan._id}>
                  <td>{plan.planName}</td>
                  <td>
                    {plan.categories.map((catId, index) => (
                      <div key={index}>{categories[catId] || catId}</div>
                    ))}
                  </td>
                  <td>
                    {plan.allocatedAmounts.map((amt, index) => (
                      <div key={index}>{amt}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublicUsers;
