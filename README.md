## Prime Wraps Website

A production-grade full‑stack website for Prime Wraps. React + TypeScript frontend, Spring Boot backend, containerized with Docker, secrets managed by Doppler, deployed on DigitalOcean, and backed by Supabase PostgreSQL. Email delivery via SendGrid.

### Tech Stack

- **Frontend**
  - React 18 + TypeScript
  - Vite (build/dev server)
  - Tailwind CSS
  - React Router v6
  - Axios
  - Framer Motion (animations)
  - lucide-react (icons)
  - date-fns
  - ESLint + TypeScript ESLint

- **Backend**
  - Java 17, Spring Boot 3.5
  - Spring Web (REST APIs)
  - Spring Data JPA
  - Spring Security (stateless) with JWT
  - Bean Validation
  - Rate limiting with Bucket4j
  - OpenAPI/Swagger UI via springdoc-openapi
  - Maven (build/deps)

- **Data & Messaging**
  - H2 (in-memory) for local development
  - PostgreSQL on Supabase for production
  - SendGrid for transactional email

- **DevOps & Hosting**
  - Docker (multi-stage images)
  - Docker Compose (dev and prod)
  - Nginx (serves static frontend)
  - Doppler (secrets and config injection)
  - DigitalOcean (deployment/hosting)

### Key Features

- Modern, responsive UI with smooth animations
- Authenticated admin area (JWT, BCrypt hashing)
- Contact form with rate limiting and email notifications
- Secure CORS configuration and stateless APIs

### Project Structure

```
Prime Wraps Website Public/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                # React + Vite application (served by Nginx in prod)
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Dev environment (backend + frontend + Postgres)
├── docker-compose.prod.yml  # Production services (Doppler-integrated)
└── README.md
```