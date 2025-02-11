const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/userModel');

let authToken;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { authSource: "admin" });

    // Ensure test user exists
    let testUser = await User.findOne({ email: "testuser@example.com" });

    if (!testUser) {
        await request(app)
            .post('/api/auth/register')
            .send({ email: "testuser@example.com", password: "password123", role: "user" });
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

describe('Auth API Endpoints', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: "newuser@example.com", password: "password123", role: "user" });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
    });

    it('should not allow duplicate registration', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: "newuser@example.com", password: "password123", role: "user" });
        expect(response.status).toBe(400);
    });

    it('should login a user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "testuser@example.com", password: "password123" });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "testuser@example.com", password: "wrongpassword" });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid credentials");
    });

    it('should return an error for missing email or password on login', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: "testuser@example.com" });
        expect(response.status).toBe(400);
    });
});
