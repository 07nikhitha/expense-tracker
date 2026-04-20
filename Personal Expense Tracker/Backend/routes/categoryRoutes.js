const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/categories', categoryController.getAllCategories);
router.post('/categories', categoryController.createNewCategory);
router.get('/categories/:id',categoryController.getCategoryByID);
module.exports = router;
