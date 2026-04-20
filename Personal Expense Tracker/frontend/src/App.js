// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import BudgetPlan from './components/BudgetPlan';
import AddExpense from './components/AddExpense';
import AddCategories from './components/AddCategories';
import TrackExpenses from './components/TrackExpenses';
import UserReports from './components/UserReports';
import UserBudgetPlans from './components/UserBudgetPlans';
import UserProfile from './components/UserProfile';
import PublicUsers from './components/PublicUsers';

function App() {
  return (
    <div>
      {/* <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
          <Link to="/">Logo</Link>
          <div>
            <Link to="/friends" style={{ marginRight: '1rem' }}>Friends</Link>
            <Link to="/profile">👤</Link>
          </div>
        </nav> */}
       <Router>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/budget/:id" element={<BudgetPlan />} />
                <Route path="/expense/:id" element={<AddExpense />} />
                <Route path="/add-categories/:id" element={<AddCategories/>} />
                <Route path="/track-expenses/:id" element={<TrackExpenses/>} />
                <Route path="/reports/:id" element={<UserReports/>} />
                <Route path="/budgetplans/:id" element={<UserBudgetPlans/>} />
                <Route path="/my-profile/:id" element={<UserProfile/>} />
                <Route path="public-users/:id" element={<PublicUsers/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
