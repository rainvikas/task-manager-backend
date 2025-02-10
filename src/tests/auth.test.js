const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/userModel');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { authSource: "admin" });
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
});

describe('Auth API Endpoints', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: "testuser@example.com", password: "password123" });
        expect(response.status).toBe(201);
    });

    it('should login a user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "testuser@example.com", password: "password123" });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });
});