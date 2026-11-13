
# GameZone Arcade – Console Booking Management System

## Project Overview

GameZone Arcade is a RESTful API-based Console Booking Management System developed using Node.js, Express.js, and SQLite.

The system allows gamers to register, view available gaming consoles, create console bookings, and manage booking statuses through a structured API.

## Team Details

- **Group:** 01
- **Group ID:** YG-AIDE2B-G01
- **Project Theme:** Theme 16 – Console Booking Management System
- **Project Name:** GameZone Arcade

## Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- Postman
- Nodemon

## Project Structure

```text
GameZone-Arcade/
│
├── controllers/
│   ├── gamerController.js
│   ├── consoleController.js
│   └── bookingController.js
│
├── database/
│   └── database.js
│
├── middleware/
│   └── errorHandler.js
│
├── routes/
│   ├── gamerRoutes.js
│   ├── consoleRoutes.js
│   └── bookingRoutes.js
│
├── postman/
│   └── GameZone Arcade API.postman_collection.json
│
├── app.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

### 2. Navigate to the Project Folder

```bash
cd GameZone-Arcade
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

The SQLite database and required tables are created automatically when the application starts.

## Database Design

The project contains three related tables:

### 1. Gamers

| Column | Description |
|---|---|
| id | Primary key |
| name | Gamer's name |
| email | Unique email address |

### 2. Consoles

| Column | Description |
|---|---|
| id | Primary key |
| name | Console name |
| platform | Console platform |

### 3. Bookings

| Column | Description |
|---|---|
| id | Primary key |
| gamer_id | Foreign key referencing gamers |
| console_id | Foreign key referencing consoles |
| status | Booking status |

Every new booking automatically receives the default status `pending`.

## API Endpoints

Base URL: `http://localhost:3000`

### Gamer APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/gamers` | Retrieve all gamers |
| GET | `/gamers/:id` | Retrieve a gamer by ID |
| POST | `/gamers` | Register a new gamer |

Example POST request:

```json
{
  "name": "Joel Astro",
  "email": "joel@example.com"
}
```

### Console APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/consoles` | Retrieve all consoles |
| GET | `/consoles/:id` | Retrieve a console by ID |
| POST | `/consoles` | Add a new console |
| PUT | `/consoles/:id` | Update console details |
| DELETE | `/consoles/:id` | Delete a console |
| GET | `/consoles?platform=Sony` | Search consoles by platform |

Example POST request:

```json
{
  "name": "PlayStation 5",
  "platform": "Sony PlayStation"
}
```

### Booking APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/bookings` | Retrieve all bookings with gamer and console details |
| POST | `/bookings` | Create a new booking |
| PATCH | `/bookings/:id/status` | Update booking status |

Example POST request:

```json
{
  "gamer_id": 1,
  "console_id": 1
}
```

Example PATCH request:

```json
{
  "status": "approved"
}
```

## Special Booking Status Workflow

The system implements a sequential booking status workflow.

```text
Pending → Approved → Done
```

Rules:

1. Every booking starts with `pending`.
2. A pending booking can move to `approved`.
3. An approved booking can move to `done`.
4. Moving backwards or skipping a status is not allowed.
5. Invalid status transitions return HTTP 400 with the message:

```json
{
  "error": "Invalid status change"
}
```

## Validation and Error Handling

The API includes validation to maintain data integrity.

- Gamer name and email are required.
- Gamer email addresses must be valid and unique.
- Console name and platform are required.
- Booking requests must contain valid gamer and console IDs.
- Non-existent records return HTTP 404.
- Duplicate gamer emails return HTTP 409.
- Invalid status transitions return HTTP 400.
- Consoles referenced by bookings cannot be deleted.

## HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created successfully |
| 400 | Invalid input or status transition |
| 404 | Resource not found |
| 409 | Conflict with existing data |
| 500 | Internal server error |

## Postman Testing

The Postman collection is included in:

```text
postman/GameZone Arcade API.postman_collection.json
```

It contains requests organized into three folders:

- Gamers
- Consoles
- Bookings

The booking workflow can be tested using these steps:

1. Create a booking and verify that its status is `pending`.
2. Approve the booking and verify HTTP 200.
3. Try changing the approved booking back to `pending` and verify HTTP 400.
4. Complete the booking and verify HTTP 200.

## Project Features

- Gamer registration and retrieval.
- Complete console CRUD operations.
- Console search by platform.
- Booking creation and retrieval.
- SQL JOIN to retrieve gamer and console details with bookings.
- Input validation and error handling.
- Sequential booking status management.
- SQLite database with relational constraints.

## Conclusion

GameZone Arcade demonstrates the development of a RESTful API using Express.js and SQLite. It implements CRUD operations, relational database management, validation, SQL JOIN queries, and a controlled booking status workflow.
