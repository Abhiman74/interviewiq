# System Architecture Document - InterviewIQ

## 1. High-Level Architecture
InterviewIQ uses a modern 3-tier architecture with a decoupled client, API server, relational database, vector database, and caching layer.

```
                  +-----------------------+
                  |  React SPA (Vite)     |
                  +-----------+-----------+
                              | HTTPS / WSS
                              v
                  +-----------------------+
                  |  Express API Server   |
                  +---+-------+-------+---+
                      |       |       |
         +------------+       |       +-------------+
         | Prisma             | Redis               | Pinecone SDK
         v                    v                     v
+--------+--------+  +--------+--------+  +---------+--------+
| PostgreSQL      |  | Redis Cache     |  | Pinecone Vector  |
| (Relational DB) |  | & Rate Limiter  |  | Database         |
+-----------------+  +-----------------+  +------------------+
```

## 2. Service Responsibilities
- **Frontend SPA**: React with TypeScript, styling via TailwindCSS & Shadcn UI, state management via Zustand, data fetching via React Query, and animations via Framer Motion. Uses Web Speech API for local client-side TTS/STT to reduce latency.
- **Express Backend API**: Auth handling, resume upload orchestration, database queries via Prisma, session validation, and Gemini API middleware.
- **Redis Service**: Caches user dashboards, session tokens, and enforces endpoint rate limits.
- **Pinecone Vector Store**: Stores resume chunk embeddings to perform fast semantic lookups during the interview.

## 3. RAG Data Pipeline
1. **Resume Upload**: User uploads resume.
2. **Text Chunking**: Parsed text is split into semantic paragraphs (skills, experience, projects).
3. **Embedding Generation**: Gemini text embedding models convert chunks to 768-dimensional vectors.
4. **Vector Upsert**: Vectors are indexed in Pinecone.
5. **Contextual Retrieval**: During the interview, when the AI generates a question, it queries Pinecone for the most relevant resume sections, appending them to the LLM prompt.
