# System Architecture

## Overview

The NITI IAS Coaching platform follows a modern client-server architecture that separates the presentation layer from the business logic and data layer. The application is built using the MERN stack and provides secure authentication, content management, previous year question practice, real-time notifications, and image upload functionality.

```
                    +----------------------+
                    |      End Users       |
                    +----------+-----------+
                               |
                               |
                        HTTPS Requests
                               |
                               v
                 +---------------------------+
                 |     React + Vite Client   |
                 |      (Frontend UI)        |
                 +-------------+-------------+
                               |
                     REST API / Socket.IO
                               |
                               v
                 +---------------------------+
                 |   Express.js REST Server  |
                 +-------------+-------------+
                               |
      ---------------------------------------------------------
      |            |            |            |                 |
      |            |            |            |                 |
      v            v            v            v                 v
 Authentication  Blogs      Courses       PYQs        Upload Service
      |            |            |            |                 |
      ---------------------------------------------------------
                               |
                               |
                        Mongoose ODM
                               |
                               v
                        MongoDB Database
```

---

# High-Level Architecture

The project consists of two independent applications.

```
NITI IAS Coaching
│
├── Frontend (React + Vite)
│
├── Backend (Node.js + Express)
│
└── MongoDB Database
```

The frontend communicates with the backend through REST APIs for all CRUD operations while Socket.IO is used for real-time notification updates.

---

# Frontend Architecture

The frontend is developed using React with Vite.

Its responsibilities include:

* Rendering user interfaces
* Managing routing
* Authentication
* Calling backend APIs
* Displaying blogs
* Displaying courses
* Conducting online PYQ tests
* Profile management
* Admin dashboard
* Multilingual interface

### Frontend Structure

```
frontend
│
├── components
│
├── pages
│
├── contexts
│
├── utils
│
├── config
│
├── images
│
└── styles
```

### Main Responsibilities

* Authentication
* Blog viewer
* Course viewer
* PYQ examination system
* Admin dashboard
* Profile management
* Image upload integration
* Real-time notification listener

---

# Backend Architecture

The backend follows a layered architecture.

```
Request

↓

Route

↓

Middleware

↓

Controller

↓

Model

↓

MongoDB

↓

JSON Response
```

This separation improves maintainability and scalability.

---

## Backend Folder Structure

```
backend
│
├── config
│
├── controllers
│
├── middleware
│
├── models
│
├── routes
│
├── uploads
│
└── server.js
```

---

# Route Layer

Routes define API endpoints and forward requests to their corresponding controllers.

Current route modules:

* Authentication
* Blogs
* Courses
* Previous Year Questions
* Uploads
* Notifications

---

# Middleware Layer

Middleware executes before controllers.

Current middleware:

## Authentication Middleware

Responsible for:

* JWT verification
* User authentication
* Admin authorization

---

## Upload Middleware

Responsible for:

* Image uploads
* File validation
* Multer configuration
* Storage management

---

# Controller Layer

Controllers contain all business logic.

## Authentication Controller

Handles:

* User registration
* Login
* JWT generation
* Profile retrieval
* Profile update
* Password change

---

## Blog Controller

Handles:

* Blog CRUD operations
* Publishing workflow
* View counting
* Notification creation

---

## Course Controller

Handles:

* Course CRUD operations
* Active course filtering
* Course updates

---

## PYQ Controller

Handles:

* Previous Year Question CRUD
* Online examination
* Automatic evaluation
* Score calculation
* Statistics generation

---

## Upload Controller

Handles:

* Single image upload
* Multiple image upload
* Image deletion
* Image listing

---

# Model Layer

Each MongoDB collection has its own Mongoose model.

```
User

Blog

Course

PYQ

Notification
```

Models contain:

* Schema definition
* Validation
* Relationships
* Middleware hooks
* Default values

---

# Database Layer

MongoDB is used as the primary database.

The application connects using Mongoose.

```
Application

↓

Mongoose

↓

MongoDB
```

Collections include:

* Users
* Blogs
* Courses
* Previous Year Questions
* Notifications

---

# Authentication Flow

```
User Login

↓

Validate Credentials

↓

Generate JWT

↓

Return Token

↓

Frontend Stores Token

↓

Authenticated Requests

↓

Middleware Verification

↓

Protected Controller
```

Protected APIs require a valid JWT token.

---

# Blog Publishing Flow

```
Admin Login

↓

Create Blog

↓

Upload Image

↓

Save Blog

↓

Publish Blog

↓

Create Notification

↓

Emit Socket.IO Event

↓

Users Receive Update
```

---

# Course Management Flow

```
Admin

↓

Create Course

↓

Upload Thumbnail

↓

Store Course

↓

Display on Website
```

---

# Previous Year Question Flow

```
Admin Creates Test

↓

Questions Stored

↓

Student Opens Test

↓

Submit Answers

↓

Automatic Evaluation

↓

Score Calculation

↓

Statistics Updated
```

---

# Image Upload Flow

```
Choose Image

↓

Frontend Compression

↓

POST Request

↓

Multer Upload

↓

Validation

↓

Store File

↓

Return Public URL

↓

Insert into Content
```

Supported image formats include:

* JPEG
* JPG
* PNG
* WEBP
* GIF

---

# Real-Time Notification Flow

```
Admin Publishes Blog

↓

Notification Saved

↓

Socket.IO Emit

↓

Connected Clients

↓

Instant Notification Display
```

---

# Security Architecture

The application implements multiple security mechanisms.

## Authentication

* JWT-based authentication
* Protected routes
* Admin authorization

---

## Password Security

Passwords are hashed using bcrypt before storage.

---

## File Upload Security

* File type validation
* Image-only uploads
* File size validation
* Protected upload endpoints

---

## CORS Protection

Only trusted origins are allowed.

---

# Deployment Architecture

```
React Frontend

↓

Production Build

↓

Hosting Platform

↓

Express Backend

↓

MongoDB Atlas
```

Frontend and backend are deployed independently.

---

# Design Principles

The project follows several software engineering principles:

* Separation of Concerns
* Modular Architecture
* RESTful API Design
* Component-Based Frontend
* Layered Backend Architecture
* Reusable Business Logic
* Scalable Folder Structure

---

# Technologies Used

## Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Framer Motion
* Socket.IO Client
* TipTap Editor

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* Socket.IO

---

## Development Tools

* Git
* GitHub
* Visual Studio Code
* Postman
* npm

---

# Future Architecture Improvements

Potential future enhancements include:

* Role-Based Access Control (RBAC)
* Refresh Token Authentication
* Redis Caching
* Docker Containerization
* Kubernetes Deployment
* CI/CD Pipeline
* Unit Testing
* Integration Testing
* API Versioning
* Cloud Object Storage for Images
* CDN Integration
* Search Indexing
* Microservices Architecture

---

# Architecture Summary

The platform follows a scalable full-stack architecture that separates the frontend, backend, and database into independent layers. The design emphasizes modularity, maintainability, and security while supporting real-time communication, multilingual educational content, and efficient management of blogs, courses, and previous year question papers. This architecture provides a solid foundation for future feature expansion and production deployment.
