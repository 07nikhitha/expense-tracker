const express = require('express');
const router = express.Router();
const budgetPlanController = require('../controllers/budgetPlanController');

router.get('/budget', budgetPlanController.getAllBudgetPlans);
router.post('/budget', budgetPlanController.createBudgetPlan);
router.get('/budget/user/:id', budgetPlanController.getAllBudgetPlansbyUserID);
router.get('/budget/plan/:id1', budgetPlanController.getBudgetPlanbyID);
router.get('/budget/:id/latest', budgetPlanController.getLatestBudgetPlan);

module.exports = router;
