import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TrackExpenses = () => {
  const [budgetPlan, setBudgetPlan] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [categories, setCategories] = useState({});
  const { id } = useParams();
  const lsBudgetPlan = JSON.parse(localStorage.getItem('budgetPlan'));

  useEffect(() => {
    if (lsBudgetPlan && typeof lsBudgetPlan === 'object') {
      const categoryIds = lsBudgetPlan.categories;
      const allocatedAmounts = lsBudgetPlan.allocatedAmounts;

      const budgetPlanData = categoryIds.map((categoryId, index) => ({
        categoryId,
        categoryName: categories[categoryId] || 'Unknown',
        allocatedAmount: allocatedAmounts[index],
      }));

      setBudgetPlan(budgetPlanData);
    } else {
      setBudgetPlan([]);
    }

    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/expenses/${id}`);
        setExpenses(response.data);
        const categoryIds = [...new Set(response.data.map(exp => exp.category))];
        fetchCategories(categoryIds);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [id, categories]);

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

  useEffect(() => {
    const calculateCategoryExpenses = () => {
      const expensesByCategory = expenses.reduce((acc, expense) => {
        const categoryId = expense.category;
        const amount = expense.amount;

        if (!acc[categoryId]) {
          acc[categoryId] = { categoryId, total: 0 };
        }
        acc[categoryId].total += amount;
        return acc;
      }, {});

      setCategoryExpenses(Object.values(expensesByCategory));
    };

    if (expenses.length > 0) {
      calculateCategoryExpenses();
    }
  }, [expenses]);

  const saveReport = async () => {
    try {
      const reportDetails = {
        budgetPlan,
        expenses,
        categoryExpenses,
      };

      await axios.post('http://localhost:5000/reports', {
        details: reportDetails,
        userId: id,
      });

      alert('Report saved successfully');
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  // Calculate summary by comparing budget and actual expenses
  const budgetSummary = budgetPlan.map(budget => {
    const categoryExpense = categoryExpenses.find(exp => exp.categoryId === budget.categoryId);
    const actualSpent = categoryExpense ? categoryExpense.total : 0;
    const difference = budget.allocatedAmount - actualSpent;
    return {
      categoryName: budget.categoryName,
      allocatedAmount: budget.allocatedAmount,
      actualSpent,
      difference,
      status: difference >= 0 ? 'Under Budget' : 'Over Budget',
    };
  });

  // Analysis and Suggestions
  const totalAllocated = budgetPlan.reduce((sum, item) => sum + item.allocatedAmount, 0);
  const totalSpent = categoryExpenses.reduce((sum, item) => sum + item.total, 0);
  const overallDifference = totalAllocated - totalSpent;
  const overallStatus = overallDifference >= 0 ? 'Within Budget' : 'Over Budget';

  const suggestions = budgetSummary.map((item) => {
    if (item.status === 'Over Budget') {
      return `Consider reducing expenses in the ${item.categoryName} category.`;
    } else if (item.status === 'Under Budget' && item.difference > 50) {
      return `You may be able to reallocate some funds from the ${item.categoryName} category.`;
    } else {
      return null;
    }
  }).filter(suggestion => suggestion);

  return (
    <div style={{ backgroundColor: 'rgb(0, 123, 255)', padding: '20px', borderRadius: '8px' }}>
      <h1 className="text-white text-center">Track Expenses</h1>

      {/* Budget Plan Table */}
      {budgetPlan.length > 0 ? (
        <div className="mb-4">
          <h2 className="text-white">Budget Plan</h2>
          <table className="table table-striped table-bordered text-white">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Allocated Amount</th>
              </tr>
            </thead>
            <tbody>
              {budgetPlan.map((item) => (
                <tr key={item.categoryId}>
                  <td>{item.categoryName}</td>
                  <td>{item.allocatedAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-white">You did not select any budget plan.</p>
      )}

      {/* Expenses Table */}
      {expenses.length > 0 && (
        <div className="mb-4">
          <h2 className="text-white">Expenses</h2>
          <table className="table table-striped table-bordered text-white">
            <thead className="table-light">
              <tr>
                <th>Expense Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.expenseTitle}</td>
                  <td>{expense.amount}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{categories[expense.category] || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Category Expenses Table */}
      {categoryExpenses.length > 0 && (
        <div className="mb-4">
          <h2 className="text-white">Expenses by Category</h2>
          <table className="table table-striped table-bordered text-white">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Total Expenses</th>
              </tr>
            </thead>
            <tbody>
              {categoryExpenses.map((category) => (
                <tr key={category.categoryId}>
                  <td>{categories[category.categoryId] || 'Unknown'}</td>
                  <td>{category.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Table */}
      <div className="mb-4">
        <h2 className="text-white">Summary</h2>
        <table className="table table-striped table-bordered text-white">
          <thead className="table-light">
            <tr>
              <th>Category</th>
              <th>Allocated Amount</th>
              <th>Actual Spent</th>
              <th>Difference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {budgetSummary.map((summary, index) => (
              <tr key={index}>
                <td>{summary.categoryName}</td>
                <td>{summary.allocatedAmount}</td>
                <td>{summary.actualSpent}</td>
                <td>{summary.difference}</td>
                <td>{summary.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analysis and Suggestions */}
      <div className="mb-4">
        <h2 className="text-white">Analysis and Suggestions</h2>
        <p className="text-white"><strong>Total Allocated:</strong> {totalAllocated}</p>
        <p className="text-white"><strong>Total Spent:</strong> {totalSpent}</p>
        <p className="text-white"><strong>Overall Status:</strong> {overallStatus}</p>
        <ul className="text-white">
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <button className="btn btn-light" onClick={saveReport}>Save Report</button>
    </div>
  );
};

export default TrackExpenses;
