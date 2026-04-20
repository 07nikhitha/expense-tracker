const mongoose = require('mongoose');

const budgetPlanSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true
  },
  totalIncome: {
    type: Number,
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required : true
  }],
  allocatedAmounts : [{
    type: Number,
    required: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BudgetPlan', budgetPlanSchema);
