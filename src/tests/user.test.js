const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/userModel');

let authToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { authSource: "admin" });

    // Ensure a test user exists
    let testUser = await User.findOne({ email: "testuser@example.com" });

    if (!testUser) {
        await request(app)
            .post('/api/auth/register')
            .send({ email: "testuser@example.com", password: "password123", role: "admin" });
    }

    // Get the auth token
    const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: "testuser@example.com", password: "password123" });

    authToken = loginResponse.body.token;
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
});

describe('User API Endpoints', () => {
    it('should get all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ sortBy: "createdAt", order: "asc", page: 1, limit: 5 });

        expect(response.status).toBe(200);
    });
});