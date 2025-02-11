const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/userModel');

let authToken;
let adminUser;
let testUser;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { authSource: "admin" });

    // Cleanup before tests
    await User.deleteMany();

    // Ensure admin user exists
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (!adminExists) {
        await request(app)
            .post('/api/auth/register')
            .send({ email: "admin@example.com", password: "password123", role: "admin" });
    }

    // Login admin and get token
    const adminLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: "admin@example.com", password: "password123" });

    authToken = adminLogin.body.token;

    // Ensure test user does not exist
    await User.deleteOne({ email: "testuser2@example.com" });

    // Create a fresh test user
    const userResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `${authToken}`)
        .send({ email: "testuser2@example.com", password: "password123", role: "user" });

    testUser = userResponse.body.user;
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
});

describe('User API Endpoints', () => {
    let testUser;

    it('should create a new user (Admin Only)', async () => {
        const response = await request(app)
            .post('/api/users')
            .set('Authorization', `${authToken}`)
            .send({ email: "testuser2@example.com", password: "password123", role: "user" });

        console.log(response.body);  // Debugging line to print the response body
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User created successfully");
        testUser = response.body.user;
    });

    it('should not allow non-admins to create users', async () => {
        const nonAdminUser = await request(app)
            .post('/api/auth/register')
            .send({ email: "testuser3@example.com", password: "password123", role: "user" });

        const nonAdminLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: "testuser3@example.com", password: "password123" });

        const nonAdminToken = nonAdminLogin.body.token;

        const response = await request(app)
            .post('/api/users')
            .set('Authorization', `${nonAdminToken}`)
            .send({ email: "testuser4@example.com", password: "password123", role: "user" });

        expect(response.status).toBe(403);
    });


    it('should get all users with filtering, sorting, and pagination', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `${authToken}`)
            .query({ sortBy: "createdAt", order: "asc", page: 1, limit: 5 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should update a user (Admin Only)', async () => {
        if (!testUser) return;

        const response = await request(app)
            .put(`/api/users/${testUser._id}`)
            .set('Authorization', `${authToken}`)
            .send({ role: "admin" });

        expect(response.status).toBe(200);
    });

    it('should soft delete a user (Admin Only)', async () => {
        if (!testUser) return;

        const response = await request(app)
            .delete(`/api/users/${testUser._id}`)
            .set('Authorization', `${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User soft deleted successfully");
    });

    it('should restore a soft deleted user (Admin Only)', async () => {
        if (!testUser) return;

        const response = await request(app)
            .put(`/api/users/restore/${testUser._id}`)
            .set('Authorization', `${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User restored successfully");
    });
});
