const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, due_date, assigned_to } = req.body;

        // Validate assigned_to field
        if (assigned_to) {
            const userExists = await User.findById(assigned_to);
            if (!userExists) return res.status(400).json({ error: "Assigned user does not exist" });
        }

        const task = new Task({ title, description, status, priority, due_date, assigned_to });
        await task.save();
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Tasks with Filtering, Sorting, and Pagination
exports.getTasks = async (req, res) => {
    try {
        const { status, priority, due_date, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
        const filter = { isDeleted: false };

        // Apply filtering
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (due_date) filter.due_date = { $gte: new Date(due_date) };

        // Validate sorting fields
        const validSortFields = ["createdAt", "title", "priority", "due_date"];
        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({ error: `Invalid sort field. Allowed values: ${validSortFields.join(", ")}` });
        }

        const tasks = await Task.find(filter)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * Number(limit))
            .limit(Number(limit))
            .populate('assigned_to', 'email role');

        res.status(200).json({
            success: true,
            total: await Task.countDocuments(filter),
            page: Number(page),
            limit: Number(limit),
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assigned_to', 'email role');
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const { assigned_to } = req.body;

        // Validate assigned_to field
        if (assigned_to) {
            const userExists = await User.findById(assigned_to);
            if (!userExists) return res.status(400).json({ error: "Assigned user does not exist" });
        }

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task || task.isDeleted) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ message: 'Task soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Restore Task (Soft Deleted)
exports.restoreTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ message: 'Task restored successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
