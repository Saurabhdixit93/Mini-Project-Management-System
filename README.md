# Project Management System

A multi-tenant project management system built with Django (Backend) and React (Frontend).

![Project Dashboard](screenshots/dashboard.png)
![Task Board](screenshots/task-board.png)

## Features

- **Multi-tenancy**: Organization-based data isolation
- **Project Management**: Create, update, and track projects
- **Task Management**: Kanban-style task board with drag-and-drop functionality
- **Collaboration**: Comment system for tasks
- **Statistics**: Real-time project completion metrics
- **Modern UI**: Responsive dark mode interface built with TailwindCSS
- **Accessibility**: WCAG compliant components with proper ARIA attributes
- **Containerization**: Docker support for easy deployment

## Tech Stack

### Backend

- Django 4.2
- GraphQL (Graphene-Django)
- PostgreSQL (or SQLite for development)
- Django CORS Headers

### Frontend

- React 18
- TypeScript
- Apollo Client
- TailwindCSS
- Vite
- React Beautiful DnD (for drag-and-drop)

## Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL (optional, defaults to SQLite)

## Setup Instructions

### Option 1: Manual Setup

#### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create sample data (Optional)
python manage.py shell < create_sample_data.py

# Start server
python manage.py runserver
```

The API will be available at `http://localhost:8000/graphql/`

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173/`

### Option 2: Docker Setup (Recommended)

```bash
# Start all services
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost:5173/
# Backend API: http://localhost:8000/graphql/
# PostgreSQL: localhost:5432
```

To stop the services:

```bash
docker-compose down
```

To rebuild and restart:

```bash
docker-compose up --build --force-recreate
```

## functionality

### Organization Context

The application uses a simple organization selector for demonstration. In a real-world scenario, this would be handled via authentication tokens.

- **Acme Corporation** (slug: `acme-corp`)
- **TechStart Inc** (slug: `techstart`)

Switching organizations demonstrates the data isolation - you will only see projects belonging to the selected organization.

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed GraphQL schema and usage.

You can also explore the GraphQL API interactively at `http://localhost:8000/graphql/` when the backend is running.

## Technical Decisions

See [TECHNICAL_SUMMARY.md](TECHNICAL_SUMMARY.md) for architecture and design choices.
