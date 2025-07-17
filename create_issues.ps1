# GitHub Issues Creation Script for Corporate AI LangChain Project

# Issue 1: Project Initialization and Tooling
gh issue create --title "Project Initialization and Tooling" --body @"
Set up the foundational structure, repositories, and environment for the project.

- [ ] Create Next.js 14 (App Router) frontend project
- [ ] Create Nest.js 10 backend project
- [ ] Set up monorepo or separate repos as needed
- [ ] Initialize Git and configure .gitignore
- [ ] Set up README and project documentation
- [ ] Configure environment variable management for both frontend and backend
"@

# Issue 2: Backend Project and Dependency Setup
gh issue create --title "Backend: Project and Dependency Setup" --body @"
Install and configure all necessary backend dependencies and environment variables.

- [ ] Install and configure Nest.js 10
- [ ] Install dependencies: @nestjs/multer, pdf-parse, csv-parse, docx, @langchain/openai, @langchain/community, typeorm/prisma, sqlite3/pg
- [ ] Set up environment variables: OPENAI_API_KEY, CHROMA_URL or PINECONE_API_KEY
"@

# Issue 3: Backend Database Design and Implementation
gh issue create --title "Backend: Database Design and Implementation" --body @"
Design and implement the database schema and ORM models for documents and chat histories.

- [ ] Design schema for documents and chat histories
- [ ] Implement ORM models/entities
- [ ] Set up migrations and seed data (if needed)
- [ ] Test database connection and CRUD operations
"@

# Issue 4: Backend API Endpoints
gh issue create --title "Backend: Implement API Endpoints" --body @"
Develop all required backend API endpoints for document upload, querying, and chat management.

- [ ] POST /upload: Accept and process document uploads
- [ ] POST /query: Process employee queries using LangChain RAG pipeline
- [ ] GET /chats: Retrieve list of chat histories
- [ ] GET /chat/:id: Retrieve specific chat history
- [ ] POST /chat: Create new chat session
"@

# Issue 5: Backend LangChain Integration
gh issue create --title "Backend: Integrate LangChain RAG Pipeline" --body @"
Integrate LangChain for document processing, embeddings, vector store, RAG pipeline, conversational memory, and custom summarization tool.

- [ ] Set up document loaders (CSVLoader, DocxLoader, PDFLoader)
- [ ] Implement text splitting and embeddings
- [ ] Integrate vector store (Chroma or Pinecone)
- [ ] Build RAG pipeline and conversational memory
- [ ] Implement custom summarization tool
- [ ] Integrate with /query endpoint and ensure source metadata in responses
"@

# Issue 6: Backend Testing and Error Handling
gh issue create --title "Backend: Testing and Error Handling" --body @"
Write tests and ensure robust error handling for all backend features.

- [ ] Write unit and integration tests for all endpoints
- [ ] Test file upload and text extraction for all formats
- [ ] Test RAG pipeline with sample queries
- [ ] Handle invalid files, queries, and errors gracefully
- [ ] Validate performance (response time < 2s, excluding LLM latency)
"@

# Issue 7: Frontend Project and Dependency Setup
gh issue create --title "Frontend: Project and Dependency Setup" --body @"
Install and configure all necessary frontend dependencies and styling.

- [ ] Install and configure Next.js 14 (App Router)
- [ ] Install dependencies: react-dropzone, axios/fetch, Tailwind CSS
- [ ] Set up Tailwind CSS and responsive design
"@

# Issue 8: Frontend Document Upload Page
gh issue create --title "Frontend: Build Document Upload Page" --body @"
Develop the /upload page for uploading company documents.

- [ ] Build file upload component (drag-and-drop, file input)
- [ ] Accept CSV, DOC, PDF (max 10MB)
- [ ] Validate file type and size
- [ ] Show upload status and error messages
- [ ] Upload file to backend /upload endpoint
- [ ] Button/link to navigate to Chat Page
"@

# Issue 9: Frontend Chat Page
gh issue create --title "Frontend: Build Chat Page" --body @"
Develop the /chat page for employee Q&A and chat history management.

- [ ] Build chat interface (text input, send button, conversation display)
- [ ] Show AI responses with source citations
- [ ] Support follow-up questions (maintain context)
- [ ] Build sidebar (list previous chats, new chat button, clickable chat entries)
- [ ] Responsive design for desktop and mobile
"@

# Issue 10: Frontend API Integration
gh issue create --title "Frontend: API Integration" --body @"
Connect frontend pages to backend endpoints and handle all API states.

- [ ] Connect upload page to backend /upload endpoint
- [ ] Connect chat page to backend /query, /chats, /chat/:id, /chat endpoints
- [ ] Handle loading, error, and success states for all API calls
"@

# Issue 11: Frontend State Management
gh issue create --title "Frontend: State Management" --body @"
Implement state management for chat, sidebar, and upload flows using React hooks.

- [ ] Use React's useState and useEffect for local state
- [ ] Manage chat state, sidebar state, and upload state
"@

# Issue 12: Frontend Testing and Usability
gh issue create --title "Frontend: Testing and Usability" --body @"
Test all frontend flows and polish the UI for clarity and intuitiveness.

- [ ] Test file upload and chat flows end-to-end
- [ ] Validate UI on mobile and desktop
- [ ] Ensure clear feedback for all user actions
- [ ] Polish UI for clarity and intuitiveness
"@

# Issue 13: Documentation and Handover
gh issue create --title "Documentation and Handover" --body @"
Document the project for future maintainers and portfolio reviewers.

- [ ] Write clear README with setup, usage, and deployment instructions
- [ ] Document environment variables and configuration
- [ ] Add code comments where necessary
- [ ] Prepare demo script or video (optional)
"@

# Issue 14: Success Criteria Validation
gh issue create --title "Success Criteria Validation" --body @"
Verify that all functional and technical requirements are met.

- [ ] Employees can upload documents and receive accurate answers
- [ ] Chat history is stored and retrievable
- [ ] AI responses include source citations
- [ ] Follow-up questions maintain conversational context
- [ ] Code is clean, maintainable, and demonstrates advanced LangChain and full-stack skills
"@

Write-Host "All GitHub issues have been created successfully!" 