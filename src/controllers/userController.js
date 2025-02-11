const User = require('../models/userModel');

exports.createUser = async (req, res) => {
    try {
        // Ensure only admins can create users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only admins can create users' });
        }

        const { email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const user = new User({ email, password, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Users (With Filtering, Sorting, and Pagination)
exports.getUsers = async (req, res) => {
    try {
        const { role, sortBy = "createdAt", order = "asc", page = 1, limit = 10 } = req.query;

        const filter = { isDeleted: false };

        // Ensure case-insensitive role filtering
        if (role) filter.role = { $regex: `^${role}$`, $options: "i" };

        // Validate sorting fields
        const validSortFields = ["createdAt", "email", "role"];
        if (sortBy && !validSortFields.includes(sortBy)) {
            return res.status(400).json({ error: `Invalid sort field. Allowed values: ${validSortFields.join(", ")}` });
        }

        const users = await User.find(filter)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
            .skip((page - 1) * Number(limit))
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            total: await User.countDocuments(filter),
            page: Number(page),
            limit: Number(limit),
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Single User by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update User (Admin Only)
exports.updateUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const updateData = {};

        if (email) updateData.email = email;
        if (role) updateData.role = role;

        if (password) {
            return res.status(400).json({ message: "Password cannot be updated here." });
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Restore Soft Deleted User (Admin Only)
exports.restoreUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isDeleted: false },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User restored successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

