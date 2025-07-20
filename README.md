# CodeCollab Editor - Project Documentation

## Project Overview

CodeCollab Editor is a real-time collaborative code editing platform that allows multiple users to simultaneously work on the same document. The application features user authentication, document management, real-time code synchronization, and version history management.

## Architecture Overview

The project follows a client-server architecture:

- **Frontend**: React-based single-page application with Material UI components
- **Backend**: Express.js server with Socket.IO for real-time communication
- **Database**: MongoDB for data persistence
- **Authentication**: JWT-based authentication system

## Technology Stack

### Backend
- Node.js with Express
- Socket.IO for real-time bidirectional communication
- MongoDB with Mongoose ORM
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router for navigation
- Material UI for component styling
- Ace Editor for code editing capabilities
- Socket.IO client for real-time communication
- Axios for HTTP requests

## System Components

### Server Components

1. **Authentication System**
   - User registration and login
   - JWT generation and validation
   - Authentication middleware

2. **Document Management**
   - CRUD operations for documents
   - Version history tracking
   - Access control

3. **Real-time Collaboration Engine**
   - Socket.IO server for real-time updates
   - Active user tracking
   - Document synchronization

### Client Components

1. **Authentication Interface**
   - Login and registration forms
   - JWT storage and management
   - Protected routes

2. **Dashboard**
   - Document listing
   - Create/delete document functionality
   - Join existing documents by ID

3. **Code Editor**
   - Ace Editor integration
   - Real-time code synchronization
   - Version history management
   - User presence indicators

## Data Flow Analysis

### Authentication Flow

1. **Registration Process**:
   - User submits username and password to `/api/auth/register`
   - Server hashes password with bcrypt
   - User data is stored in MongoDB
   - JWT token is generated and returned to client
   - Client stores token in localStorage
   - User is redirected to dashboard

2. **Login Process**:
   - User submits credentials to `/api/auth/login`
   - Server validates credentials against database
   - JWT token is generated and returned to client
   - Client stores token in localStorage
   - User is redirected to dashboard

3. **Protected Route Access**:
   - Client attempts to access protected route
   - PrivateRoute component checks for token in localStorage
   - If token exists, access is granted
   - If token doesn't exist, user is redirected to login

### Document Management Flow

1. **Document Creation**:
   - User clicks "Create New Document" in dashboard
   - Request is sent to `/api/documents` with JWT token
   - Server creates document in database with user as owner
   - Document ID is returned to client
   - Client navigates to editor with document ID

2. **Document Retrieval**:
   - Dashboard requests user's documents from `/api/documents`
   - Server queries database for documents owned by user
   - Document list is returned to client and displayed

3. **Document Deletion**:
   - User clicks delete icon for a document
   - Delete request sent to `/api/documents/:id`
   - Server verifies ownership and deletes document
   - UI updates to remove deleted document

### Real-time Collaboration Flow

1. **Joining a Document Session**:
   - User opens document in editor
   - Client fetches document content via `/api/documents/:id`
   - Client connects to Socket.IO server
   - Client emits `join-document` event with document ID and username
   - Server adds user to document room and active users list
   - Server broadcasts updated active users list to all users in room

2. **Code Editing and Synchronization**:
   - User makes changes in the editor
   - Client captures changes and updates local state
   - Client emits `code-change` event with new code and document ID
   - Server broadcasts changes to all other clients in the document room
   - Other clients receive `receive-code-change` event and update their editors

3. **Version Management**:
   - User clicks "Save Version"
   - Version data sent to `/api/documents/:id/versions`
   - Server adds version to document history in database
   - Updated history is returned to client
   - Version history panel is refreshed

4. **Disconnection Handling**:
   - User closes editor or loses connection
   - Socket.IO `disconnect` event triggered
   - Server removes user from active users list
   - Server broadcasts updated active users list
   - Server cleans up document room if empty

## Control Flow Analysis

### Server-Side Control Flow

1. **Application Initialization**:
   - Express app and HTTP server creation
   - Socket.IO server initialization with CORS configuration
   - MongoDB connection establishment
   - Middleware registration (CORS, JSON parsing)
   - Route registration (auth, documents)
   - Socket event handler registration
   - Server start on specified port

2. **Request Handling**:
   - Authentication routes handle user registration and login
   - Document routes handle CRUD operations for documents
   - Authentication middleware validates JWT for protected routes
   - Error handling middleware catches and processes errors

3. **Socket Event Handling**:
   - `connection` event handles new client connections
   - `join-document` event handles users joining document sessions
   - `code-change` event broadcasts code changes to other users
   - `disconnect` event manages user departures

### Client-Side Control Flow

1. **Application Initialization**:
   - React app rendering with theme provider and router
   - Route configuration for public and protected routes
   - Layout component wrapping all routes

2. **User Interface Flow**:
   - Landing page provides entry point to application
   - Authentication forms handle user registration and login
   - Dashboard displays documents and provides creation/access functionality
   - Editor provides collaborative editing environment
   - Layout provides consistent navigation and authentication state management

3. **Document Editing Flow**:
   - Editor component initializes with document ID from URL
   - Document content fetched from server
   - Socket.IO connection established
   - Editor changes trigger Socket.IO events
   - Version history management handled through UI interactions

## Security Considerations

1. **Authentication Security**:
   - Passwords hashed with bcrypt before storage
   - JWT used for stateless authentication
   - Protected routes require valid token
   - Token expiration set to 1 hour

2. **Data Access Control**:
   - Document operations verify user ownership
   - API endpoints require authentication
   - Frontend routes protected with PrivateRoute component

3. **Known Security Issues**:
   - JWT secret is hardcoded in authentication routes
   - No CSRF protection implemented
   - No rate limiting on authentication endpoints

## Deployment Considerations

1. **Environment Configuration**:
   - MongoDB connection string stored in .env file
   - CORS configuration set for development (localhost:3000)
   - Port configuration via environment variables

2. **Production Readiness**:
   - Update CORS settings for production domains
   - Move JWT secret to environment variables
   - Implement proper error logging
   - Add input validation
   - Implement rate limiting

## Conclusion

CodeCollab Editor demonstrates a full-stack JavaScript application with real-time capabilities. The architecture enables multiple users to collaborate on code documents simultaneously while maintaining document history and providing a secure authentication system.

The data flow is designed to support real-time synchronization through Socket.IO while using REST APIs for CRUD operations. This hybrid approach provides both real-time responsiveness and traditional data management capabilities.