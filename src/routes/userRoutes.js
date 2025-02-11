const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser, restoreUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin & non-admin)
 *     tags: [Users]
 *     security:
 *       - AuthToken: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter users by role (e.g., admin, user)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, email, role]
 *           example: "createdAt"
 *         description: Sort users by a specific field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "asc"
 *         description: Sort order (ascending or descending)
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
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users with pagination
 *       400:
 *         description: Invalid sort field provided
 */
router.get('/', authMiddleware, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User ID to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Admin creates a new user
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass123"
 *               role:
 *                 type: string
 *                 enum: ["admin", "user"]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Forbidden - Only admins can create users
 */
router.post('/', authMiddleware, roleMiddleware('admin'), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Admin updates a user
 *     tags: [Users]
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
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "updateduser@example.com"
 *               role:
 *                 type: string
 *                 enum: ["admin", "user"]
 *                 example: "user"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Password cannot be updated here
 *       403:
 *         description: Forbidden - Only admins can update users
 *       404:
 *         description: User not found
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Admin soft deletes a user
 *     tags: [Users]
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
 *         description: User ID
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 *       403:
 *         description: Forbidden - Only admins can delete users
 *       404:
 *         description: User not found
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

/**
 * @swagger
 * /api/users/restore/{id}:
 *   put:
 *     summary: Admin restores a soft deleted user
 *     tags: [Users]
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
 *         description: User ID
 *     responses:
 *       200:
 *         description: User restored successfully
 *       403:
 *         description: Forbidden - Only admins can restore users
 *       404:
 *         description: User not found
 */
router.put('/restore/:id', authMiddleware, roleMiddleware('admin'), restoreUser);



module.exports = router;
