const User = require('../models/userModel');

// Get All Users (With Filtering, Sorting, and Pagination)
exports.getUsers = async (req, res) => {
    try {
        const { role, sortBy = "createdAt", order = "asc", page = 1, limit = 10 } = req.query;
        const filter = role ? { role } : {};

        // Ensure sorting field is valid
        const validSortFields = ["createdAt", "email", "role"];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({ error: "Invalid sort field" });
        }

        const users = await User.find(filter)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
            .skip((page - 1) * Number(limit))
            .limit(Number(limit));

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Single User by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update User (Admin Only)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
