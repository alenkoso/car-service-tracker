# Car Service Tracker

## Overview

Car Service Tracker is a full-stack web application designed to help vehicle owners manage and track their vehicle maintenance records. The application allows users to:

- Add and manage multiple vehicles
- Record service history
- Track service locations
- Monitor maintenance costs and mileage

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Deployment**: Docker

## Features

- Add, edit, and view vehicles
- Record service records with detailed information
- Predefined service types and locations
- Responsive design
- Easy-to-use interface

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Docker Compose
- Git

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/alenkoso/car-service-tracker.git
cd car-service-tracker
```

### 2. Environment Setup

No additional environment configuration is needed. The project uses default settings in the Docker Compose file.

### 3. Run with Docker

```bash
# Build and start the application
docker-compose up --build

# To run in detached mode
docker-compose up -d --build
```

### 4. Access the Application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### 5. Stopping the Application

```bash
docker-compose down
```

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Database Migrations

To run migrations:

```bash
cd backend
npm run migrate:up   # Apply migrations
npm run migrate:down # Rollback migrations
```

## Project Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   └── migrations/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
│
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
└── docker-compose.yml
```

## Customization

### Adding Service Types

Edit `frontend/src/utils/service-type-constants.js` to add or modify service types.

### Adding Service Locations

Edit `frontend/src/utils/service-locations-constants.js` to add or modify service locations.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Alen Koso - [Your Email or GitHub Profile]

Project Link: [https://github.com/alenkoso/car-service-tracker](https://github.com/alenkoso/car-service-tracker)