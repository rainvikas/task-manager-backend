const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

let authToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { authSource: "admin" });
    
    // Create a test user and get a JWT token
    const userResponse = await request(app)
        .post('/api/auth/register')
        .send({ email: "testuser@example.com", password: "password123" });
    
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
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: "Test Task",
                description: "Task description",
                priority: "High"
            });
        expect(response.status).toBe(201);
        expect(response.body.title).toBe("Test Task");
    });

    it('should get all tasks', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should update a task', async () => {
        const task = await Task.create({ title: "Task to update", priority: "Medium" });
        const response = await request(app)
            .put(`/api/tasks/${task._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ priority: "High" });
        expect(response.status).toBe(200);
        expect(response.body.priority).toBe("High");
    });

    it('should delete a task', async () => {
        const task = await Task.create({ title: "Task to delete", priority: "Low" });
        const response = await request(app)
            .delete(`/api/tasks/${task._id}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Task deleted successfully");
    });
});
