# 🛠 Technology Stack

The project is developed using a modern MERN-based architecture with additional libraries for authentication, file handling, and real-time communication.

---

## Frontend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| React 19         | User Interface Development    |
| Vite             | Fast Development & Build Tool |
| React Router DOM | Client-side Routing           |
| Axios            | API Communication             |
| Tailwind CSS     | Responsive UI Styling         |
| Framer Motion    | Animations                    |
| React Hot Toast  | Notifications                 |
| TipTap Editor    | Rich Text Blog Editor         |
| React Icons      | Icon Library                  |
| React i18next    | English/Hindi Localization    |
| Socket.IO Client | Real-time Notifications       |

---

## Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | JavaScript Runtime      |
| Express.js | REST API Framework      |
| MongoDB    | NoSQL Database          |
| Mongoose   | MongoDB ODM             |
| JWT        | Authentication          |
| bcryptjs   | Password Hashing        |
| Multer     | Image Upload            |
| Socket.IO  | Real-time Communication |
| dotenv     | Environment Variables   |
| CORS       | Cross-Origin Requests   |

---

## Development Tools

| Tool    | Purpose                 |
| ------- | ----------------------- |
| Git     | Version Control         |
| GitHub  | Source Code Hosting     |
| VS Code | Development Environment |
| Postman | API Testing             |
| npm     | Package Management      |

---

# 🏗 System Architecture

```
                    ┌──────────────────────────────┐
                    │        React Frontend        │
                    │         (Vite + React)       │
                    └──────────────┬───────────────┘
                                   │
                            HTTP / REST API
                                   │
                    ┌──────────────▼───────────────┐
                    │      Express.js Backend      │
                    │                              │
                    │ Controllers                 │
                    │ Routes                      │
                    │ Middleware                  │
                    │ Authentication              │
                    │ File Upload                 │
                    │ Socket.IO                   │
                    └──────────────┬───────────────┘
                                   │
                           Mongoose ODM
                                   │
                    ┌──────────────▼───────────────┐
                    │          MongoDB             │
                    │                              │
                    │ Users                        │
                    │ Blogs                        │
                    │ Courses                      │
                    │ PYQs                         │
                    │ Notifications               │
                    └──────────────────────────────┘
```

---

# ⚙ Project Architecture

The project follows a modular architecture where every feature is separated into independent layers.

```
Client
   │
   ▼
React Components
   │
   ▼
API Utility Layer
   │
   ▼
Express Routes
   │
   ▼
Controllers
   │
   ▼
Business Logic
   │
   ▼
MongoDB Models
   │
   ▼
MongoDB Database
```

This architecture improves:

* Scalability
* Maintainability
* Code Reusability
* Testing
* Feature Expansion

---

# 📦 Major Project Modules

The application is divided into independent modules.

### Authentication Module

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-based Authorization
* Password Change
* Profile Update

---

### Blog Management Module

* Create Blog
* Edit Blog
* Delete Blog
* Rich Text Editor
* Image Upload
* Categories
* Tags
* Publish / Draft
* View Counter

---

### Course Management Module

* Create Course
* Edit Course
* Delete Course
* Course Categories
* Pricing
* Duration
* Features
* Course Images

---

### Previous Year Question Module

* Create PYQs
* Manage Questions
* Multiple Choice Questions
* Answer Evaluation
* Score Calculation
* Performance Statistics
* Subject-wise Organization
* Exam-wise Organization

---

### Notification Module

* Real-time Notifications
* Read/Unread Status
* Socket.IO Integration

---

### User Module

* User Profile
* Profile Picture Upload
* Authentication
* Role Management

---

### File Upload Module

* Image Upload
* Image Validation
* Multiple Upload Support
* Secure Storage

---

### Admin Dashboard

* Blog Management
* Course Management
* PYQ Management
* Notification Management
* User Management



# 📂 Project Structure

The project follows a monorepo architecture consisting of independent frontend and backend applications.

```text
nitiias_chcohing/
│
├── backend/                    # Express.js REST API
│   ├── config/                 # Database & configuration
│   ├── controllers/            # Business logic
│   ├── middleware/             # Authentication & upload middleware
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── uploads/                # Uploaded images
│   ├── server.js               # Backend entry point
│   └── package.json
│
├── frontend/                   # React + Vite Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── images/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs/                       # Project documentation
│   ├── api.md
│   ├── architecture.md
│   ├── database.md
│   ├── deployment.md
│   ├── contributing.md
│   └── images/
│
├── LICENSE
└── README.md
```

---

# 📁 Backend Directory Overview

The backend is responsible for API development, authentication, database communication, file uploads, and real-time notifications.

## config/

Stores application configuration.

| File         | Description              |
| ------------ | ------------------------ |
| database.js  | MongoDB connection       |
| apiConfig.js | API configuration values |

---

## controllers/

Contains the business logic for every module.

| Controller          | Responsibility                                           |
| ------------------- | -------------------------------------------------------- |
| authController.js   | User registration, login, profile, password management   |
| blogController.js   | Blog CRUD operations                                     |
| courseController.js | Course CRUD operations                                   |
| pyqController.js    | Previous Year Questions, online tests, score calculation |

---

## middleware/

Reusable middleware used across APIs.

| Middleware | Purpose                                         |
| ---------- | ----------------------------------------------- |
| auth.js    | JWT authentication and role-based authorization |
| upload.js  | Multer configuration for image uploads          |

---

## models/

MongoDB collections used in the application.

| Model        | Description                    |
| ------------ | ------------------------------ |
| User         | Stores user accounts and roles |
| Blog         | Blog articles and metadata     |
| Course       | Course catalogue               |
| Pyq          | Previous Year Question papers  |
| Notification | Real-time notification records |

---

## routes/

Defines REST API endpoints.

| Route              | Description                 |
| ------------------ | --------------------------- |
| /api/auth          | Authentication APIs         |
| /api/blogs         | Blog APIs                   |
| /api/courses       | Course APIs                 |
| /api/pyqs          | Previous Year Question APIs |
| /api/notifications | Notification APIs           |
| /api/upload        | Image upload APIs           |

---

## uploads/

Stores uploaded images for:

* Blogs
* Courses
* Profile Pictures
* Rich Text Editor Images

---

## server.js

Application entry point responsible for:

* Express initialization
* MongoDB connection
* Middleware registration
* Route registration
* Socket.IO server initialization
* Error handling
* Static file serving
* HTTP server startup

---

# 🎨 Frontend Directory Overview

The frontend is built with React and Vite using a modular component-based architecture.

## components/

Reusable UI components including:

* Navbar
* Footer
* Hero Section
* Admin Blog Editor
* Admin Course Editor
* Admin PYQ Editor
* Language Switcher

---

## pages/

Application pages.

* Home
* Blog
* Blog Details
* Courses
* Login
* Profile
* Previous Year Questions
* PYQ Test
* Admin Dashboard

---

## contexts/

Provides global application state.

* Authentication Context
* User Session Management

---

## utils/

Utility functions including:

* API Helper
* Token Management
* Socket.IO Client

---

## config/

Stores frontend configuration including API URLs.

---

## styles/

Global CSS and Tailwind styling.

---

## images/

Application assets and branding resources.

---

# 🗄 Database Collections

The application currently uses five primary MongoDB collections.

| Collection    | Purpose                          |
| ------------- | -------------------------------- |
| Users         | Authentication and user profiles |
| Blogs         | Educational articles             |
| Courses       | Coaching courses                 |
| PYQs          | Previous year question papers    |
| Notifications | Real-time notifications          |

---

# 🔄 Request Flow

```text
Browser
    │
    ▼
React Component
    │
    ▼
Axios / Fetch
    │
    ▼
Express Route
    │
    ▼
Controller
    │
    ▼
Mongoose Model
    │
    ▼
MongoDB
    │
    ▼
JSON Response
    │
    ▼
React UI Update
```
