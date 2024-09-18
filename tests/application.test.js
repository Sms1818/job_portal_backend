import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import applicationRoutes from '../routes/applicationRoute.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/applications', applicationRoutes);

let token;
let userId;
let jobId;
let companyToken;
beforeAll(async () => {
    const url = 'mongodb://localhost:27017/testdb'; 
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user
    const user = new User({
        name: 'Test Candidate',
        email: 'candidate@test.com',
        password: 'password123',
        role: 'Candidate'
    });
    await user.save();
    userId = user._id;

    // Create a test job
    const job = new Job({
        title: 'Software Engineer',
        description: 'Responsible for developing web applications.',
        location: 'Remote',
        salary: '100000',
        postedBy: userId
    });
    await job.save();
    jobId = job._id;

    // Generate a token for the test user
    token = jwt.sign({ userId: user._id, role: 'Candidate' }, process.env.SECRET_KEY, { expiresIn: '1h' });
    companyToken=jwt.sign({ userId: user._id, role: 'Company' }, process.env.SECRET_KEY, { expiresIn: '1h' });
});

beforeEach(async () => {
    await Application.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await mongoose.connection.close();
});

describe('Application API', () => {
    test('should apply for a job', async () => {
        const applicationData = {
            resume: 'https://example.com/resume.pdf'
        };

        const response = await request(app)
            .post(`/applications/${jobId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(applicationData);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Application submitted successfully');
        expect(response.body.newApplication).toHaveProperty('resume', 'https://example.com/resume.pdf');
    });

    test('should not apply for a job if already applied', async () => {
        const application = new Application({
            candidate: userId,
            job: jobId,
            resume: 'https://example.com/resume.pdf'
        });
        await application.save();

        const response = await request(app)
            .post(`/applications/${jobId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ resume: 'https://example.com/new_resume.pdf' });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('You have already applied for this role');
    });

    test('should not apply for a job without a resume', async () => {
        const response = await request(app)
            .post(`/applications/${jobId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({}); // No resume provided

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Resume is required to apply for the job');
    });

    test('should get all applications for a job', async () => {
        const application = new Application({
            candidate: userId,
            job: jobId,
            resume: 'https://example.com/resume.pdf'
        });
        await application.save();

        const response = await request(app)
            .get(`/applications/${jobId}`)
            .set('Authorization', `Bearer ${companyToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('resume', 'https://example.com/resume.pdf');
    });

    test('should return 404 for non-existent job when applying', async () => {
        const response = await request(app)
            .post('/applications/610c1b8f0f1b2c1a40a9e6d9') // Invalid Job ID
            .set('Authorization', `Bearer ${token}`)
            .send({ resume: 'https://example.com/resume.pdf' });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Job not found');
    });

    test('should return 404 for non-existent job when fetching applications', async () => {
        const response = await request(app)
            .get('/applications/610c1b8f0f1b2c1a40a9e6d9') // Invalid Job ID
            .set('Authorization', `Bearer ${companyToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Job not found');
    });
});
