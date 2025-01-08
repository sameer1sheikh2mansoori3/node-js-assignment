import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js'; // Your Express app
import User from '../models/User.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany(); // Clean up after each test
});

describe('User Authentication Tests', () => {
    const mockUser = {
        email: 'test@example.com',
        password: 'password123',
    };

    test('Should register a new user successfully', async () => {
        const response = await request(app).post('/api/users/register').send(mockUser);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('You have successfully registered. Welcome aboard!');
        expect(response.body.data.email).toBe(mockUser.email);

        // Check if user is saved in the database
        const user = await User.findOne({ email: mockUser.email });
        expect(user).not.toBeNull();
        expect(user.email).toBe(mockUser.email);
    });

    test('Should not register a user with an existing email', async () => {
        await new User({ email: mockUser.email, password: 'hashedPassword123' }).save(); // Save mock user

        const response = await request(app).post('/api/users/register').send(mockUser);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('A user with this email already exists. Please try another one.');
        expect(response.body.errorCode).toBe('USER_EXISTS');
    });

    test('Should log in a user successfully', async () => {
        // Create a new user
        const hashedPassword = await bcrypt.hash(mockUser.password, 10);
        await new User({ email: mockUser.email, password: hashedPassword }).save();

        const response = await request(app).post('/api/users/login').send(mockUser);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login successful! You are now authenticated.');
        expect(response.body.data.token).toBeDefined(); // Ensure token is present
    });

    test('Should not log in with incorrect credentials', async () => {
        const response = await request(app).post('/api/users/login').send({
            email: 'wrong@example.com',
            password: 'wrongpassword',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Oops! The email or password you entered is incorrect.');
        expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
    });

    test('Should not log in a non-existent user', async () => {
        const response = await request(app).post('/api/users/login').send(mockUser);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Oops! The email or password you entered is incorrect.');
        expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
    });
});
