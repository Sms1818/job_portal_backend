import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import Job from '../models/Job.js';
import User from '../models/User.js';
import jobRoutes from '../routes/jobRoute.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/jobs', jobRoutes);

let token;
let userId;

beforeAll(async () => {
    const url = 'mongodb://localhost:27017/testdb'; 
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    const user = new User({
        name: 'Test Company',
        email: 'company@test.com',
        password: 'password123',
        role: 'Company'
    });
    await user.save();
    userId = user._id;

    token = jwt.sign({ userId: user._id, role: 'Company' }, process.env.SECRET_KEY, { expiresIn: '1h' });
});

beforeEach(async () => {
    await Job.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Job API', () => {
    test('should post a job', async () => {
        const jobData = {
            title: 'Software Engineer',
            description: 'Responsible for developing web applications.',
            location: 'Remote',
            salary: '100000'
        };

        const response = await request(app)
            .post('/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send(jobData);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Job posted successfully');
        expect(response.body.newJob).toHaveProperty('title', 'Software Engineer');
    });

    test('should not post a job with missing fields', async () => {
        const jobData = {
            title: 'Software Engineer',
            location: 'Remote'
        };

        const response = await request(app)
            .post('/jobs')
            .set('Authorization', `Bearer ${token}`)
            .send(jobData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('All fields (title, description, location, salary) are required');
    });

    test('should get all job details', async () => {
        await new Job({
            title: 'Software Engineer',
            description: 'Develop software applications.',
            location: 'Remote',
            salary: '120000',
            postedBy: userId
        }).save();

        const response = await request(app)
            .get('/jobs')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.jobs.length).toBeGreaterThan(0);
    });

    test('should get job details by ID', async () => {
        const job = await new Job({
            title: 'Backend Developer',
            description: 'Responsible for building APIs.',
            location: 'New York',
            salary: '90000',
            postedBy: userId
        }).save();

        const response = await request(app)
            .get(`/jobs/${job._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.job).toHaveProperty('title', 'Backend Developer');
    });

    test('should return 404 for non-existent job by ID', async () => {
        const response = await request(app)
            .get('/jobs/610c1b8f0f1b2c1a40a9e6d9') // Invalid ID
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Job not found');
    });

    test('should update job details', async () => {
        const job = await new Job({
            title: 'Frontend Developer',
            description: 'Responsible for UI development.',
            location: 'San Francisco',
            salary: '110000',
            postedBy: userId
        }).save();

        const updatedData = {
            title: 'Frontend Engineer',
            location: 'Remote',
            salary: '120000'
        };

        const response = await request(app)
            .patch(`/jobs/${job._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.updatedJob).toHaveProperty('title', 'Frontend Engineer');
    });

    test('should delete a job by ID', async () => {
        const job = await new Job({
            title: 'Data Scientist',
            description: 'Analyze data for insights.',
            location: 'Boston',
            salary: '130000',
            postedBy: userId
        }).save();

        const response = await request(app)
            .delete(`/jobs/${job._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Job Deleted successfully');
    });

    test('should return 404 for non-existent job when deleting', async () => {
        const response = await request(app)
            .delete('/jobs/610c1b8f0f1b2c1a40a9e6d9') // Invalid ID
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Job not found');
    });
});