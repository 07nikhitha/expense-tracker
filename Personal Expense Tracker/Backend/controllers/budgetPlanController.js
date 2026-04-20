const BudgetPlan = require('../models/budgetPlan');

// GET all budget plans
exports.getAllBudgetPlans = async (req, res) => {
    try {
        const budgetPlans = await BudgetPlan.find().populate('categories user');
        res.status(200).json(budgetPlans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET the latest budget plan made by the user
exports.getLatestBudgetPlan = async (req, res) => {
    const userId = req.params.id;
    try {
      const latestBudgetPlan = await BudgetPlan.findOne({ user: userId })
        .sort({ createdAt: -1 }) // Sort by `createdAt` descending
        .limit(1);
      if (!latestBudgetPlan) {
        return res.status(404).json({ message: 'No budget plan found for this user.' });
      }
      res.status(200).json(latestBudgetPlan);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving the budget plan.' });
    }
  };

// POST a new budget plan
exports.createBudgetPlan = async (req, res) => {
    try {
        const budgetPlan = new BudgetPlan(req.body);
        await budgetPlan.save();
        res.status(201).json(budgetPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET all budget plans for a specific user 
exports.getAllBudgetPlansbyUserID = async (req,res) => {
    try {
        const budgetPlan = await BudgetPlan.find({user : req.params.id});
        // if(!budgetPlan){
        //     return res.status(404).json({ message: 'No Budget Plans found' });
        // }
        res.status(200).json(budgetPlan);
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
}

// GET budget plan by id
exports.getBudgetPlanbyID = async (req,res) => {
    try {
        const budgetPlan = await BudgetPlan.findById(req.params.id1);
        if(!budgetPlan){
            return res.status(404).json({ message : 'Budget Plan not found'});
        }
        res.status(200).json(budgetPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
