const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

let authToken;
let testUser;
let testTask;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { authSource: "admin" });
    
    // Ensure test user exists
    testUser = await User.findOne({ email: "testuser@example.com" });
    
    if (!testUser) {
        await request(app)
            .post('/api/auth/register')
            .send({ email: "testuser@example.com", password: "password123", role: "admin" });
        testUser = await User.findOne({ email: "testuser@example.com" });
    }

    // Get the auth token
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: "testuser@example.com", password: "password123" });
    
    authToken = loginResponse.body.token;
});

afterAll(async () => {
    await Task.deleteMany();
    await User.deleteMany();
    await mongoose.connection.close();
});

describe('Task API Endpoints', () => {
    it('should create a new task', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `${authToken}`)
            .send({
                title: "Test Task",
                description: "Task description",
                priority: "High",
                assigned_to: testUser ? testUser._id : null
            });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        testTask = response.body.data;
    });

    it('should get all tasks with filtering, sorting, and pagination', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `${authToken}`)
            .query({ sortBy: "createdAt", order: "asc", page: 1, limit: 5 });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should get a task by ID', async () => {
        if (!testTask) return;
        const response = await request(app)
            .get(`/api/tasks/${testTask._id}`)
            .set('Authorization', `${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should update a task', async () => {
        if (!testTask) return;
        const response = await request(app)
            .put(`/api/tasks/${testTask._id}`)
            .set('Authorization', `${authToken}`)
            .send({ priority: "Medium" });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should soft delete a task', async () => {
        if (!testTask) return;
        const response = await request(app)
            .delete(`/api/tasks/${testTask._id}`)
            .set('Authorization', `${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Task soft deleted successfully");
    });

    it('should restore a soft deleted task', async () => {
        if (!testTask) return;
        const response = await request(app)
            .put(`/api/tasks/${testTask._id}/restore`)
            .set('Authorization', `${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Task restored successfully");
    });
});
