# Prime Wraps Website

A website built with React frontend and Spring Boot backend.

## Tech Stack

### Backend
- **Java 17+** with **Spring Boot 3.x**
- **Spring Web** - RESTful APIs
- **Spring Data JPA** - Database operations
- **Spring Security** - Authentication
- **H2 Database** (dev) / **PostgreSQL** (prod)
- **Maven** - Dependency management

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Project Structure

```
prime-wraps-website/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Development environment
└── README.md
```

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker (optional)

### Development Setup

1. **Backend Setup:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Docker Setup (Alternative):**
   ```bash
   docker-compose up
   ```

## Features

- Modern, responsive UI
- RESTful API backend
- Database integration
- Authentication system
- Contact forms
- Product showcase
- About/Company information

## Development

- Backend runs on: http://localhost:8080
- Frontend runs on: http://localhost:5173
- API documentation: http://localhost:8080/swagger-ui.html

## Deployment

The application can be deployed using Docker containers or traditional deployment methods. 
