# REST API Reference - InterviewIQ

## 1. Authentication
### POST `/api/auth/register`
- **Request**: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
- **Response**: `{ "token": "jwt_token", "user": { "id": "uuid", "email": "user@example.com" } }`

### POST `/api/auth/login`
- **Request**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "token": "jwt_token" }`

## 2. Resume & JD Matching
### POST `/api/resume/upload`
- **Request**: Multipart Form Data (`file`: pdf/docx)
- **Response**: `{ "resumeId": "uuid", "parsedData": { "skills": [...], "experience": [...] } }`

### POST `/api/resume/match-jd`
- **Request**: `{ "resumeId": "uuid", "jd": "text content" }`
- **Response**: `{ "matchPercentage": 85, "missingKeywords": [...], "suggestions": [...] }`

## 3. Interview Engine
### POST `/api/interview/start`
- **Request**: `{ "role": "Software Engineer", "difficulty": "Intermediate", "style": "Google" }`
- **Response**: `{ "interviewId": "uuid", "firstQuestion": "string" }`

### POST `/api/interview/question/next`
- **Request**: `{ "interviewId": "uuid", "answerText": "user response" }`
- **Response**: `{ "nextQuestion": "string", "isFinished": false }`

### GET `/api/interview/:id/results`
- **Response**: `{ "scores": { "overall": 82, ... }, "feedback": { "strengths": [...], "weaknesses": [...] } }`

### Rate Limiting
- Standard limits: 100 requests per 15 minutes.
