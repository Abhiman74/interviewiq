# Product Requirements Document (PRD) - InterviewIQ

## 1. Executive Summary
InterviewIQ is a SaaS platform designed to solve the interview preparation gap for students and experienced professionals. By simulating realistic, company-specific technical and behavioral interviews, InterviewIQ provides actionable, data-driven feedback that mirrors real interviewer assessments.

## 2. User Personas & Target Audience
- **Students**: Preparing for placements/internships; focuses on core concepts (DSA, DBMS, OS) and beginner projects.
- **Experienced Professionals**: Preparing for job switches; focuses on system design, technical depth, and situational behavior.
- **Recruiters (Future)**: Customize templates, view aggregated candidate evaluations.
- **Admins**: Monitor platform metrics, manage prompt templates.

## 3. Core Features & Functional Requirements
### 3.1 Resume Parsing Engine
- Upload format: PDF/DOCX (up to 10MB).
- Extraction: Skills, work history, projects, certifications, and achievements.
- Resume Rating & ATS Score.
- Gap Identification: Missing keywords relative to preferred target roles.

### 3.2 Job Description Matcher
- Paste JDs to compare against uploaded resume.
- Output: Role Match %, skill gap report, likely interview questions.

### 3.3 AI Interview Simulator
- Company styles: Google-style (heavy algorithmic/analytical), Amazon-style (14 Leadership Principles), Microsoft-style (system design and coding), Startup-style (high speed, broad full-stack troubleshooting).
- Question Categories: Resume-based, algorithmic (DSA), system design, behavior, scenario.
- Follow-up questioning engine that challenges user answers (e.g. asking "Why Redis instead of Memcached?").

### 3.4 Live Interview Workspace
- **Voice Mode**: Live Speech-to-Text and Text-to-Speech simulation.
- **Video Toggle**: Camera preview frame to simulate actual video call environments.
- **Interactive Timer**: Tracks overall time and per-question time.
- **AI Avatar**: Visual representation of the interviewer with dynamic facial reactions.

### 3.5 Scoring & Feedback Engine
- Granular Scoring: Technical Depth, Communication, Problem Solving, Confidence, Behavioral.
- Performance Dashboard: Historic trends, weekly heatmaps, weaknesses tracking.
- Personal Learning Roadmap: Tailored practice tracks (e.g. "Solve 20 Graph questions", "Practice STAR method").
