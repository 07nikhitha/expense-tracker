const User = require('../models/user');
// const bcrypt = require('bcrypt');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST a new user
exports.createUser = async (req, resp) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return resp.json({ Status: "Error", message: "User already exists" });
        }
        // Create a new user
        const newUser = new User({
            name: name,
            email: email,
            password: password // Store password as plain text
        });

        // Save the user to the database
        await newUser.save();
        
        resp.json({ Status: "Success", user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: "Error", message: "Server error" });
    }
};


//POST a existing user
exports.checkUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email:email });
        if (!existingUser) {
            return res.status(404).json({ message: "No Such User" });
        }
        if (existingUser.password === password) {
            return res.json({ Status: "Success", user: existingUser })
        } else {
            res.status(401).json("Incorrect Password")
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


// PUT update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET all public users
exports.getPublicUsers = async (req, res) => {
    try {
        const publicUsers = await User.find({ type: 'public' }).select('_id name');
        if(!publicUsers) return res.status(404).json({message: 'No such Users'});
        res.status(200).json(publicUsers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching public users' });
    }
}
