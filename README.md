# ⚽ Football Tournament Management System

A scalable backend application for managing football tournaments, teams, players, fixtures, match results, tournament progression, standings, and statistics.

Built using **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**, following a modular architecture with clean separation of concerns.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Password Hashing using bcryptjs
* Protected Routes
* Role-Based Access Control

Supported Roles:

* ADMIN
* ORGANIZER
* REFEREE

---

### 👥 Team Management

* Create Team
* Update Team
* Delete Team
* View All Teams
* View Team Details

Team Information:

* Team Name
* City
* Coach
* Founded Year
* Logo URL

---

### 🏃 Player Management

* Create Player
* Update Player
* Delete Player
* View Players
* Assign Players to Teams

Player Information:

* First Name
* Last Name
* Jersey Number
* Age
* Nationality
* Position

Supported Positions:

* GOALKEEPER
* DEFENDER
* MIDFIELDER
* FORWARD

---

### 🏆 Tournament Management

* Create Tournament
* Update Tournament
* Delete Tournament
* View Tournament Details

Supported Tournament Types:

* KNOCKOUT
* ROUND_ROBIN
* GROUP_STAGE

Tournament Status:

* DRAFT
* REGISTRATION_OPEN
* REGISTRATION_CLOSED
* IN_PROGRESS
* COMPLETED

---

### 📋 Tournament Registration

* Register Teams into Tournament
* Remove Teams from Tournament
* View Registered Teams

Validation Rules:

* Team cannot register twice
* Tournament capacity respected
* Registration status validated

---

### ⚔️ Fixture Generation

Knockout Fixture Generation:

* Automatic Pairing
* Round Generation
* Duplicate Fixture Prevention
* Tournament Validation

Example:

Quarter Final

Team A vs Team B

Team C vs Team D

---

### 🎯 Match Result Management

* Submit Match Results
* Score Validation
* Automatic Winner Determination
* Match Completion Tracking

Rules:

* Negative scores are rejected
* Knockout matches cannot end in a draw
* Completed matches cannot be updated again

---

### 🔄 Knockout Progression Engine

Automatically generates:

* Quarter Finals
* Semi Finals
* Finals

Features:

* Collect Winners
* Generate Next Round
* Prevent Duplicate Round Creation
* Tournament Progression Validation

---

### 📊 Standings Module

Calculated Dynamically

Includes:

* Matches Played
* Wins
* Draws
* Losses
* Goals For
* Goals Against
* Goal Difference
* Points

Sorting Rules:

1. Points
2. Goal Difference
3. Goals Scored

---

### 📈 Statistics Module

Tournament Statistics:

* Total Teams
* Total Players
* Total Fixtures
* Completed Fixtures
* Scheduled Fixtures
* Total Goals Scored
* Average Goals Per Match
* Tournament Champion

---

## 🏗️ Project Architecture

```text
football-tournament-management-system

├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── .env
├── package.json
└── index.js
```

---

## 🛠️ Technology Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcryptjs

### Development Tools

* VS Code
* Postman
* MongoDB Compass
* Git
* GitHub

---

## 📡 API Modules

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Teams

```http
POST   /api/teams
GET    /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id
```

### Players

```http
POST   /api/players
GET    /api/players
GET    /api/players/:id
PUT    /api/players/:id
DELETE /api/players/:id
GET    /api/players/team/:teamId
```

### Tournaments

```http
POST   /api/tournaments
GET    /api/tournaments
GET    /api/tournaments/:id
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id
```

### Registration

```http
POST   /api/tournaments/:tournamentId/register/:teamId
DELETE /api/tournaments/:tournamentId/register/:teamId
GET    /api/tournaments/:tournamentId/teams
```

### Fixtures

```http
POST /api/fixtures/generate/:tournamentId
GET  /api/fixtures/tournament/:tournamentId
POST /api/fixtures/next-round/:tournamentId
```

### Match Results

```http
PATCH /api/fixtures/:fixtureId/result
GET   /api/fixtures/:fixtureId
```

### Standings

```http
GET /api/standings/:tournamentId
```

### Statistics

```http
GET /api/statistics/tournament/:tournamentId
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## 🚀 Installation

```bash
git clone <repository-url>

cd football-tournament-management-system

npm install

npm run dev
```

---

## 📬 API Testing

Use Postman to test all endpoints.

Recommended Workflow:

1. Register User
2. Login User
3. Copy JWT Token
4. Add Authorization Header

```text
Bearer <token>
```

5. Test Protected Routes

---

## 🎯 Future Enhancements

* Swagger Documentation
* Round Robin Fixture Engine
* Group Stage Support
* Player Statistics
* Top Scorers
* Referee Management
* Tournament Reports
* Email Notifications
* Frontend Dashboard

---

## 👨‍💻 Author

Developed as a scalable backend project using modern Node.js and MongoDB architecture.

Designed for football tournament organizers, sports clubs, academies, and event management systems.
