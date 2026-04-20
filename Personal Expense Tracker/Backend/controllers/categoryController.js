const Category = require('../models/category');

// GET all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET category by id
exports.getCategoryByID = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id); // Use findById for fetching by ID
        if (!category) {
            return res.status(404).json({ message: "No such category found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// POST a new category
exports.createNewCategory = async (req,res) => {
    try {
        const newCategory = new Category(req.body);
        const existingCategory = await Category.findOne({categoryName : newCategory.categoryName});
        if(existingCategory) {
            return res.json({message : "category already exists"})
        }
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({message : "Server error"});
    }
} 
