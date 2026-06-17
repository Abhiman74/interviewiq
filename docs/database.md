# Database Schema & Indexing Strategy - InterviewIQ

## 1. ERD Relationships
- **User** 1 --- 1 **Profile**
- **User** 1 --- * **Resume**
- **User** 1 --- * **Interview**
- **User** 1 --- * **ActivityLog**
- **User** 1 --- 1 **Subscription**
- **Resume** 1 --- * **Project**
- **Resume** 1 --- * **Skill**
- **Interview** 1 --- * **Question**
- **Question** 1 --- 1 **Answer**
- **Question** 1 --- 1 **Score**
- **Interview** 1 --- 1 **FeedbackReport**

## 2. Prisma Database Schema
Refer to the schema file in `/backend/prisma/schema.prisma` for the exact definitions.

## 3. Indexing Strategy
To optimize latency for high-frequency queries:
- `idx_user_email`: Unique index on `User(email)` for login verification.
- `idx_profile_userId`: Index on `Profile(userId)` for quick profile retrieval.
- `idx_interview_userId`: Index on `Interview(userId)` for populating the performance dashboard.
- `idx_question_interviewId`: Index on `Question(interviewId)` to retrieve the active session thread.
- `idx_activitylog_userId_createdAt`: Composite index on `ActivityLog(userId, createdAt)` for audit filtering.
