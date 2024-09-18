# Job Portal Project

## Overview
This project is a job portal system where candidates can apply for jobs, and companies can post and manage job listings. The project includes the following key functionalities:

- User registration (both candidates and companies)
- User login and token generation (JWT-based authentication)
- Job posting (company-only access)
- Job application (candidate-only access)
- Application management (company-only access)

This guide will help you set up the project locally, test the APIs, and understand the edge cases covered by the system.

## Table of Contents
1. [Setup](#setup)
2. [APIs](#apis)
   - [Authentication (Register & Login)](#authentication)
   - [Job Management](#job-management)
   - [Job Application](#job-application)
3. [Edge Cases](#edge-cases)
4. [Testing](#testing)
5. [Additional Notes](#additional-notes)



## Setup

### Prerequisites
Ensure you have the following installed:

•⁠  ⁠Node.js (v14.x or later)

•⁠  ⁠MongoDB (local or cloud instance)

•⁠  ⁠Postman (for API testing)

### Installation
1.⁠ ⁠Clone the repository:
   ```bash
   git clone https://github.com/your-username/job-portal.git
   cd job-portal
   ```
2.⁠ ⁠Install the dependencies:
   ```bash
   npm install
   ```
3.⁠ Set up environment variables: Create a .env file in the root directory and add the following:
   ```bash
  SECRET_KEY=your_secret_key
  MONGO_URI=your_mongodb_uri
  PORT=port_number
   ```
4.⁠ ⁠Start the server:
   ```bash
   node app.js
   ```

The server will be running on http://localhost:{PORT}.

## APIs

### Authentication

#### 1. Register as a Candidate

**POST** `/auth/register`

```http
POST /auth/register HTTP/1.1
Content-Type: application/json

{
  "name": "test",
  "email": "test@gmail.com",
  "password": "password123",
  "role": "Candidate"
}
```

#### 2. Login (Generate Token)
After registering, you can log in to generate a token, which must be included in the header of future requests.

**POST** `/auth/login`

```http
POST /auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "your_generated_token"
}
```


**Note:** Copy the token from the response and use it in the Authorization header for subsequent requests.


### Job Management

#### 1. Post a Job (Company Only)

**POST** `/job`

- Only accessible by companies. Ensure you have a valid token generated from a company login.
- Add the token in the Authorization header.

```http
POST /job HTTP/1.1
Authorization: Bearer your_company_token
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "Develop and maintain web applications.",
  "location": "Remote",
  "salary": "100000"
}
```

#### 2. Get All Jobs

**GET** `/job`

```http
GET /job HTTP/1.1
```

#### 3. Get Job by ID

**GET** `/job/:jobId`

```http
GET /job/60d...dce1 HTTP/1.1
```

#### 4. Update Job by ID

**PATCH** `/job/:jobId`

```http
PATCH /job/60d...dce1 HTTP/1.1
```

#### 5. DELETE Job by ID

**DELETE** `/job/:jobId`

```http
DELETE /job/60d...dce1 HTTP/1.1
```


### Job Application

#### 1. Apply for a Job (Candidate Only)

**POST** `/application/:jobId`

- Candidates must be logged in and include the token in the request header.
- Pass the job ID in the URL and the resume link in the body.

```http
POST /application/60d...dce1 HTTP/1.1
Authorization: Bearer your_candidate_token
Content-Type: application/json

{
  "resume": "https://example.com/resume.pdf"
}
```

#### 2. Get Applications for a Job (Company Only)

**GET** `/application/:jobId`

- Companies can view all applications for their posted jobs by providing the job ID.

```http
GET /application/60d...dce1 HTTP/1.1
Authorization: Bearer your_company_token
```

### Edge Cases
1. Invalid Job ID Format: Ensure that the job ID is in the correct format. The system will return a 400 Bad Request for invalid IDs.
2. Non-existent Job: If a job ID does not exist, the system will return a 404 Not Found.
3. Resume Missing: Applying for a job without providing a resume will result in a 400 Bad Request.
4. Already Applied: If a candidate has already applied for a job, attempting to reapply will return a 400 Bad Request.
5. Company Access Only: Only users with the role of Company can post jobs or view applications.

### Testing

Unit and integration tests are provided for all major functionalities. To run the tests:

```bash
npm test -- --runInBand
```

### Additional Notes

1. Authentication: All requests (except for job listing and individual job view) require authentication via JWT. The token must be passed in the Authorization header in the format:

```bash
Authorization: Bearer <your_token>
```

2. Job Posting: Only companies can post jobs. Make sure to log in as a company and use the generated token in the job posting request.





   
