import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserReports.css';

const UserReports = () => {
  const [reports, setReports] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const { id } = useParams(); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reports/user/${id}`);
        setReports(response.data);
        const categoryIds = getCategoryIds(response.data);
        fetchCategoryNames(categoryIds);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [id]);

  const getCategoryIds = (reports) => {
    const categoryIds = new Set();
    reports.forEach((report) => {
      const { budgetPlan, expenses, categoryExpenses } = JSON.parse(report.details);
      budgetPlan.forEach((item) => categoryIds.add(item.categoryId));
      expenses.forEach((expense) => categoryIds.add(expense.category));
      categoryExpenses.forEach((catExpense) => categoryIds.add(catExpense.categoryId));
    });
    return Array.from(categoryIds);
  };

  const fetchCategoryNames = async (categoryIds) => {
    try {
      const requests = categoryIds.map(id =>
        axios.get(`http://localhost:5000/categories/${id}`)
      );
      const responses = await Promise.all(requests);
      const namesMap = {};
      responses.forEach((res) => {
        namesMap[res.data._id] = res.data.categoryName;
      });
      setCategoryNames(namesMap);
    } catch (error) {
      console.error('Error fetching category names:', error);
    }
  };

  const renderBudgetPlanTable = (budgetPlan) => (
    <table className="table table-striped" style={{ backgroundColor: 'white' }}>
      <thead>
        <tr>
          <th>Category Name</th>
          <th>Allocated Amount</th>
        </tr>
      </thead>
      <tbody>
        {budgetPlan.map((item, index) => (
          <tr key={index}>
            <td>{categoryNames[item.categoryId] || 'Unknown'}</td>
            <td>{item.allocatedAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderExpensesTable = (expenses) => (
    <table className="table table-striped" style={{ backgroundColor: 'white' }}>
      <thead>
        <tr>
          <th>Expense Title</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense, index) => (
          <tr key={index}>
            <td>{expense.expenseTitle}</td>
            <td>{expense.amount}</td>
            <td>{expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</td>
            <td>{categoryNames[expense.category] || 'Unknown'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCategoryExpensesTable = (categoryExpenses) => (
    <table className="table table-striped" style={{ backgroundColor: 'white' }}>
      <thead>
        <tr>
          <th>Category</th>
          <th>Total Expenses</th>
        </tr>
      </thead>
      <tbody>
        {categoryExpenses.map((category, index) => (
          <tr key={index}>
            <td>{categoryNames[category.categoryId] || 'Unknown'}</td>
            <td>{category.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderReportDetails = (details) => {
    const { budgetPlan, expenses, categoryExpenses } = JSON.parse(details);
    return (
      <div className="report-container">
        <h3>Budget Plan</h3>
        {renderBudgetPlanTable(budgetPlan)}

        <h3>Expenses</h3>
        {renderExpensesTable(expenses)}

        <h3>Expenses by Category</h3>
        {renderCategoryExpensesTable(categoryExpenses)}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'rgb(0, 123, 255)', padding: '20px', borderRadius: '8px' }}>
      <h1 style={{ color: 'white' }}>Generated Reports</h1>
      {reports.length > 0 ? (
        <table className="table table-bordered" style={{ backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th>Generated Date</th>
              <th>Report Details</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{new Date(report.generatedDate).toLocaleDateString()}</td>
                <td>{renderReportDetails(report.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: 'white' }}>No reports generated yet.</p>
      )}
    </div>
  );
};

export default UserReports;
