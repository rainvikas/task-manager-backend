const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask, restoreTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks with filtering, sorting, and pagination
 *     tags: [Tasks]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "your_jwt_token"
 *         description: JWT token for authentication
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by task status (Pending, Completed)
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by task priority (High, Medium, Low)
 *       - in: query
 *         name: due_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks with a due date greater than or equal to the given date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title, priority, due_date]
 *           example: "createdAt"
 *         description: Sort by field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "desc"
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of tasks per page
 *     responses:
 *       200:
 *         description: List of tasks with pagination
 */
router.get('/', authMiddleware, getTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "your_jwt_token"
 *         description: JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *               priority:
 *                 type: string
 *                 enum: [High, Medium, Low]
 *               due_date:
 *                 type: string
 *                 format: date
 *               assigned_to:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', authMiddleware, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "your_jwt_token"
 *         description: JWT token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to retrieve
 *     responses:
 *       200:
 *         description: Task data
 */
router.get('/:id', authMiddleware, getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "your_jwt_token"
 *         description: JWT token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *               priority:
 *                 type: string
 *                 enum: [High, Medium, Low]
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put('/:id', authMiddleware, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Soft delete a task
 *     tags: [Tasks]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "your_jwt_token"
 *         description: JWT token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task soft deleted successfully
 */
router.delete('/:id', authMiddleware, deleteTask);

/**
 * @swagger
 * /api/tasks/{id}/restore:
 *   put:
 *     summary: Restore a soft deleted task
 *     tags: [Tasks]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "your_jwt_token"
 *         description: JWT token for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to restore
 *     responses:
 *       200:
 *         description: Task restored successfully
 */
router.put('/:id/restore', authMiddleware, restoreTask);

module.exports = router;
