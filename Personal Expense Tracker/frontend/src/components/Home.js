import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id; // Use optional chaining
  const userName = user?.name; // Use optional chaining

  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('budgetPlan');
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/');
  };

  const handleMakeBudgetPlan = () => {
    if (categories.length === 0) {
      alert('No categories found, so you are directed to this page.');
      navigate(`/add-categories/${userId}`);
    } else {
      navigate(`/budget/${userId}`);
      console.log('Navigate to budget planning form');
    }
  };

  return (
    <>
      <nav className="navbar" style={{ backgroundColor: 'rgb(0,123,255)' }}>
        <span className="navbar-brand" style={{ fontWeight: 'bold', color: 'white' }}>&nbsp;   Personal Expense Tracker</span>
        <div className="ml-auto">
          <button className="btn btn-light rounded-circle" style={{ fontSize: '1.5rem' }} onClick={() => { navigate(`/my-profile/${userId}`) }}>👤</button>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          <>&nbsp;</>
        </div>
      </nav>

      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {user ? (
          <>
            <br />
            <h2>&nbsp;    Hello, {userName} 👋 </h2>
            <h6> &nbsp; &nbsp; &nbsp;  Save Money by keeping Track of your Expenses.  </h6>     
            <br />

            {/* Image Container */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <img className="d-block m-auto w-50" src="/images/first-image.avif" alt="First slide" style={{ maxHeight: '350px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
              <h5 style={{ marginTop: '10px', fontSize: '1.75rem' }}>Start Managing Your Finances</h5>
            </div>
            
            <br />
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <img src="/images/rb_1689.png" className="card-img-top" alt="Make a Budget Plan" style={{ height: '150px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">Make a Budget Plan</h5>
                    <p className="card-text">Create your budget plan.</p>
                    <button className="btn btn-primary" onClick={handleMakeBudgetPlan}>Go</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <img src="/images/rb_2188.png" className="card-img-top" alt="Add Expense" style={{ height: '150px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">Add Expense</h5>
                    <p className="card-text">Add your expenses.</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/expense/${userId}`)}>Go</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <img src="/images/rb_858.png" className="card-img-top" alt="Track Expenses" style={{ height: '150px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">Track Expenses</h5>
                    <p className="card-text">Keep track of your spending.</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/track-expenses/${userId}`)}>Go</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="card">
                  <img src="/images/rb_859.png" className="card-img-top" alt="View Reports" style={{ height: '150px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">View Reports</h5>
                    <p className="card-text">Analyze your spending.</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/reports/${userId}`)}>Go</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="card">
                  <img src="/images/rb_839.webp" className="card-img-top" alt="My Budget Plans" style={{ height: '150px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">My Budget Plans</h5>
                    <p className="card-text">View your budget plans.</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/budgetplans/${userId}`)}>Go</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mt-3">
                <div className="card">
                  <img src="/images/rb_22.png" className="card-img-top" alt="My Profile" style={{ height: '150px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">My Profile</h5>
                    <p className="card-text">View and edit your profile.</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/my-profile/${userId}`)}>Go</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>You have not yet logged in. Kindly log in.</div>
            <button className="btn btn-primary" onClick={handleLogin}>Login or Register</button>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
