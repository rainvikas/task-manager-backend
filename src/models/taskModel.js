const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    due_date: { type: Date },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);