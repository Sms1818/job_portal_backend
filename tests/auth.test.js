import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { loginUser, registerUser } from '../controllers/authController.js';
import User from '../models/User.js';
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.post('/register', registerUser);
app.post('/login', loginUser);




beforeAll(async () => {
    const url = 'mongodb://localhost:27017/testdb'; 
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});


beforeEach(async () => {
    await User.deleteMany({});
});


afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    test('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                name: 'Sahil Shitole',
                email: 'sahil@gmail.com',
                password: 'password123',
                role: 'Candidate'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.msg).toBe('User created successfully');
        expect(response.body.newUser).toHaveProperty('name', 'Sahil Shitole');
    });

    test('should not register a user with the same email', async () => {
        await new User({
            name: 'Sahil Shitole',
            email: 'sahil@gmail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'Candidate'
        }).save();

        const response = await request(app)
            .post('/register')
            .send({
                name: 'Vishwakarma',
                email: 'sahil@gmail.com',
                password: 'password123',
                role: 'Candidate'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.msg).toBe('User already exists');
    });

    test('should login with correct credentials', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await new User({
            name: 'Sahil Shitole',
            email: 'sahil@gmail.com',
            password: hashedPassword,
            role: 'Candidate'
        }).save();

        const response = await request(app)
            .post('/login')
            .send({
                email: 'sahil@gmail.com',
                password: 'password123'
            });


        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login Successful');
        expect(response.body.token).toBeDefined();
    });

    test('should not login with incorrect password', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await new User({
            name: 'Sahil Shitole',
            email: 'sahil@gmail.com',
            password: hashedPassword,
            role: 'Candidate'
        }).save();

        const response = await request(app)
            .post('/login')
            .send({
                email: 'sahil@gmail.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.msg).toBe('Invalid password');
    });

    test('should not login with non-existent user', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'test@gmail.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.msg).toBe('User not found');
    });
});
