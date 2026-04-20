const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetPlanRoutes = require('./routes/budgetPlanRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://nikhitha:12345@cluster0.dholbfa.mongodb.net/schooldb')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors(
  {
      origin: "http://localhost:3000",
      methods: ["POST", "GET", "DELETE", "PUT"],
      credentials: true
  }
))
app.use(userRoutes);
app.use(expenseRoutes);
app.use(budgetPlanRoutes);
app.use(categoryRoutes);
app.use(reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
