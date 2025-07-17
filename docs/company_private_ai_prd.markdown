# Product Requirements Document: Company’s Private AI Document Q&A System

## 1. Overview
### 1.1 Purpose
The Company’s Private AI Document Q&A System enables a company to upload internal documents (CSV, DOC, or PDF) and allows employees to ask questions about their content, receiving accurate, contextually relevant answers powered by a Retrieval-Augmented Generation (RAG) pipeline using LangChain. The system is designed as a portfolio project to demonstrate advanced AI capabilities (RAG, vector stores, conversational memory) integrated with a simple full-stack application using Next.js (frontend) and Nest.js (backend). Security and privacy considerations are out of scope as per the requirement.

### 1.2 Target Audience
- **Primary Users**: Developers, hiring managers, or technical recruiters evaluating the creator’s portfolio for AI and full-stack skills.
- **Secondary Users**: Company employees querying internal documents (e.g., financial reports, employee handbooks, project plans).

### 1.3 Objectives
- Build a functional web application with a simple UI for uploading company documents and querying their content.
- Implement an advanced RAG pipeline using LangChain to process documents and provide accurate answers with source citations.
- Store chat histories in a database for persistence and retrieval by employees.
- Showcase expertise in LangChain (RAG, vector stores, conversational memory) and full-stack development (Next.js, Nest.js).

## 2. Features and Functionality
### 2.1 Frontend (Next.js)
#### 2.1.1 Document Upload Page
- **Description**: A page where company administrators or employees can upload internal documents (CSV, DOC, or PDF) for processing.
- **Features**:
  - File upload component supporting CSV, DOC, and PDF formats.
  - Validation to ensure only supported file types are uploaded (max size: 10MB).
  - Display upload status (e.g., “Processing”, “Uploaded Successfully”).
  - Button to navigate to the Chat Page after successful upload.
- **UI Components**:
  - File input field with drag-and-drop support.
  - Upload button.
  - Status message display.
  - Link/button to Chat Page.
- **Navigation**: Accessible via the main route (e.g., `/upload`).

#### 2.1.2 Chat Page
- **Description**: A page for employees to ask questions about uploaded company documents and view AI responses, with a sidebar for managing chat histories.
- **Features**:
  - **Chat Interface**:
    - Text input for employees to enter questions about company documents (e.g., “What are the Q3 2024 sales figures?”).
    - Display area for conversation (employee questions and AI responses with source citations, e.g., document name, page numbers, or section).
    - Support for follow-up questions with conversational context (e.g., “How do they compare to Q2?”).
  - **Sidebar**:
    - List of previous chats (e.g., titles based on document name or first question, like “Sales Report Q&A”).
    - Button to create a new chat, clearing the current conversation.
    - Clickable chat entries to load previous conversations from the database.
  - Responsive design for desktop and mobile.
- **UI Components**:
  - Text input and “Send” button for queries.
  - Chat display with employee and AI messages (styled like a messaging app).
  - Sidebar with chat list and “New Chat” button.
- **Navigation**: Accessible via `/chat`.

### 2.2 Backend (Nest.js)
- **Description**: Handles document uploads, text extraction, vector store management, and LangChain-powered query processing for company documents.
- **Endpoints**:
  - `POST /upload`: Accepts company document files (CSV, DOC, PDF), extracts text, generates embeddings, and stores them in a vector database.
    - Input: Multipart form-data with file.
    - Output: JSON with upload status and document ID.
  - `POST /query`: Processes employee queries using LangChain’s RAG pipeline and returns AI responses with citations.
    - Input: JSON with document ID, query text, and optional chat ID (for context).
    - Output: JSON with answer and source metadata (e.g., document name, page numbers).
  - `GET /chats`: Retrieves list of chat histories for the employee.
    - Output: JSON array of chat metadata (e.g., ID, title, timestamp, document ID).
  - `GET /chat/:id`: Retrieves a specific chat’s history.
    - Output: JSON with chat messages.
  - `POST /chat`: Creates a new chat session.
    - Output: JSON with new chat ID.
- **Database**:
  - Store chat histories (employee ID, chat ID, document ID, messages) in a relational database (e.g., SQLite or PostgreSQL).
  - Store document metadata (e.g., document ID, file name, upload timestamp, document type).

### 2.3 LangChain Integration
- **Description**: Implements an advanced RAG pipeline to process company documents and answer employee queries, with conversational memory and source attribution.
- **Components**:
  - **Document Processing**:
    - Use LangChain’s document loaders (`CSVLoader`, `DocxLoader`, `PDFLoader`) to extract text from uploaded company documents.
    - Split text into chunks using `RecursiveCharacterTextSplitter` (e.g., 500-token chunks with overlap for context preservation).
    - Generate embeddings using `OpenAIEmbeddings` (or Hugging Face alternatives for open-source options).
    - Store embeddings in a vector database (e.g., Chroma or Pinecone) with metadata (e.g., document name, page numbers, section).
  - **RAG Pipeline**:
    - Use `RetrievalQA` chain to retrieve relevant document chunks based on employee queries (via vector similarity search).
    - Pass retrieved chunks to an LLM (e.g., OpenAI GPT-4o or Hugging Face model) for answer generation.
    - Include source metadata in responses for citations (e.g., “From Q3 Report, page 12”).
  - **Conversational Memory**:
    - Use `ConversationBufferMemory` or `ConversationalRetrievalChain` to maintain context for follow-up questions (e.g., “What about Q4?” after asking about Q3).
    - Store conversation history in the database, linked to chat ID and document ID.
  - **Custom Tool**:
    - Implement a LangChain `Tool` for summarizing document sections (e.g., “Summarize the employee handbook’s leave policy”).
    - Integrate with the RAG pipeline to handle summary requests alongside Q&A.

### 2.4 User Flow
1. An employee (or admin) navigates to `/upload`, uploads a company document (CSV, DOC, or PDF, e.g., “Q3 Financial Report”), and sees a success message.
2. The employee navigates to `/chat`, selects a document (e.g., “Q3 Financial Report”), and starts a new chat or loads a previous one from the sidebar.
3. The employee enters a question (e.g., “What are the Q3 2024 sales figures?”).
4. The system retrieves relevant document chunks, generates an answer with citations (e.g., “Sales were $5M, from Q3 Report, page 12”), and displays it.
5. The employee asks follow-up questions, with the system maintaining context via LangChain’s memory.
6. The employee can start a new chat or switch to a previous chat via the sidebar, with all chats saved in the database.

## 3. Technical Requirements
### 3.1 Frontend (Next.js)
- **Framework**: Next.js 14 (App Router).
- **Dependencies**:
  - `react-dropzone` for file uploads.
  - `axios` or `fetch` for API calls.
  - Tailwind CSS for styling.
- **Routes**:
  - `/upload`: Document upload page.
  - `/chat`: Chat page with sidebar.
- **State Management**: React’s `useState` and `useEffect` for simplicity (no Redux needed).
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS.

### 3.2 Backend (Nest.js)
- **Framework**: Nest.js 10.
- **Dependencies**:
  - `@nestjs/multer` for file uploads.
  - `pdf-parse`, `csv-parse`, `docx` for text extraction.
  - `@langchain/openai` for LLM and embeddings.
  - `@langchain/community` for vector stores (e.g., Chroma).
  - `typeorm` or `prisma` for database ORM.
- **Database**: SQLite (for simplicity) or PostgreSQL.
- **Environment Variables**:
  - `OPENAI_API_KEY` for LLM and embeddings.
  - `CHROMA_URL` or `PINECONE_API_KEY` for vector store.

### 3.3 LangChain
- **Version**: Latest stable (`@langchain/core`, `@langchain/openai`, `@langchain/community`).
- **Components**:
  - Loaders: `CSVLoader`, `DocxLoader`, `PDFLoader`.
  - Text Splitter: `RecursiveCharacterTextSplitter`.
  - Embeddings: `OpenAIEmbeddings` or Hugging Face alternatives.
  - Vector Store: Chroma or Pinecone.
  - Chains: `RetrievalQA`, `ConversationalRetrievalChain`.
  - Memory: `ConversationBufferMemory`.
  - Tools: Custom summarization tool.
- **LLM**: OpenAI GPT-4o (or Hugging Face model for open-source alternative).

### 3.4 Infrastructure
- **Deployment**: Vercel for Next.js frontend, Heroku or AWS for Nest.js backend.
- **Database**: Hosted (e.g., Supabase for PostgreSQL) or local SQLite.
- **Vector Store**: Managed Chroma instance or Pinecone cloud service.

## 4. Non-Functional Requirements
- **Performance**: Response time < 2 seconds for queries (excluding LLM latency).
- **Scalability**: Handle up to 100 concurrent users (small-scale portfolio project).
- **Usability**: Intuitive UI with clear feedback (e.g., loading states, error messages).
- **Reliability**: Handle invalid files or queries gracefully with user-friendly error messages.
- **Security/Privacy**: Out of scope, as specified.

## 5. Success Criteria
- **Functional**:
  - Employees can upload company documents (CSV, DOC, PDF) and receive accurate answers to queries.
  - Chat history is stored and retrievable via the sidebar.
  - AI responses include source citations (e.g., document name, page numbers).
  - Follow-up questions maintain conversational context.
- **Technical**:
  - Successful integration of LangChain’s RAG pipeline with vector store and conversational memory.
  - Clean, maintainable code for Next.js and Nest.js components.
- **Portfolio Impact**:
  - Demonstrates advanced LangChain skills (RAG, vector stores, memory, tools).
  - Showcases full-stack expertise with a simple, functional UI and backend tailored for a company’s internal use.

## 6. Assumptions and Constraints
- **Assumptions**:
  - Employees have access to valid API keys for OpenAI or vector store services.
  - Documents are in English and well-structured (e.g., readable PDFs).
  - Small-scale deployment (no enterprise-grade scaling required).
- **Constraints**:
  - File size limit: 10MB to manage processing and storage.
  - LLM and vector store costs (e.g., OpenAI, Pinecone) must be considered for deployment.
  - Limited to CSV, DOC, and PDF formats for simplicity.

## 7. Out of Scope
- Security and privacy features (e.g., authentication, access control, data encryption).
- Real-time collaboration (e.g., multiple employees editing a chat).
- Support for non-text documents (e.g., images, scanned PDFs without OCR).
- Multi-language support for documents.

## 8. Future Enhancements
- Add support for image-based PDFs using OCR (e.g., `tesseract.js`).
- Implement user authentication for employee-specific access.
- Add export functionality for chat histories (e.g., PDF or JSON).
- Integrate additional LangChain tools (e.g., fetching related internal data via APIs).

## 9. Timeline (Estimated)
- **Week 1**: Set up Next.js and Nest.js projects, configure LangChain and vector store.
- **Week 2**: Implement document upload and text extraction (CSV, DOC, PDF).
- **Week 3**: Build RAG pipeline and chat functionality with LangChain.
- **Week 4**: Develop frontend UI (upload and chat pages), integrate with backend, and test.
- **Week 5**: Add database for chat storage, polish UI, and deploy.

## 10. Risks and Mitigation
- **Risk**: LLM or vector store API costs exceed budget.
  - **Mitigation**: Use free-tier services (e.g., Chroma local instance) or open-source LLMs (e.g., Hugging Face).
- **Risk**: Complex documents (e.g., poorly formatted PDFs) cause extraction errors.
  - **Mitigation**: Validate file formats and provide clear error messages.
- **Risk**: LangChain setup complexity delays development.
  - **Mitigation**: Start with a minimal RAG pipeline and incrementally add features (e.g., memory, tools).

## 11. Stakeholders
- **Developer**: You, responsible for building and showcasing the project.
- **End-Users**: Portfolio reviewers (hiring managers) and demo users (simulated company employees).
- **External Services**: OpenAI (LLM/embeddings), Chroma/Pinecone (vector store).