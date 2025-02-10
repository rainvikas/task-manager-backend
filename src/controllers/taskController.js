const Task = require('../models/taskModel');

// Create Task
exports.createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Tasks with Filtering, Sorting, and Pagination
exports.getTasks = async (req, res) => {
    try {
        const { status, priority, due_date, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
        const filter = {};

        // Apply filtering
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (due_date) filter.due_date = { $lte: new Date(due_date) };

        // Fetch filtered and paginated tasks
        const tasks = await Task.find(filter)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * Number(limit))
            .limit(Number(limit))
            .populate('assigned_to');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Single Task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assigned_to');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
