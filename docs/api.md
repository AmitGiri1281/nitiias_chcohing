# 🔌 REST API Documentation

The backend exposes a RESTful API organized into feature-based routes.

---

## Authentication APIs

| Method | Endpoint                    | Description                | Access    |
| ------ | --------------------------- | -------------------------- | --------- |
| POST   | `/api/auth/register`        | Register a new user        | Public    |
| POST   | `/api/auth/login`           | User login                 | Public    |
| GET    | `/api/auth/profile`         | Get current user profile   | Protected |
| PUT    | `/api/auth/profile`         | Update profile information | Protected |
| PUT    | `/api/auth/change-password` | Change account password    | Protected |

---

## Blog APIs

| Method | Endpoint           | Description         | Access |
| ------ | ------------------ | ------------------- | ------ |
| GET    | `/api/blogs`       | Get published blogs | Public |
| GET    | `/api/blogs/:id`   | Get blog details    | Public |
| GET    | `/api/blogs/admin` | Get all blogs       | Admin  |
| POST   | `/api/blogs`       | Create blog         | Admin  |
| PUT    | `/api/blogs/:id`   | Update blog         | Admin  |
| DELETE | `/api/blogs/:id`   | Delete blog         | Admin  |

---

## Course APIs

| Method | Endpoint           | Description        | Access |
| ------ | ------------------ | ------------------ | ------ |
| GET    | `/api/courses`     | Get active courses | Public |
| GET    | `/api/courses/:id` | Get course details | Public |
| POST   | `/api/courses`     | Create course      | Admin  |
| PUT    | `/api/courses/:id` | Update course      | Admin  |
| DELETE | `/api/courses/:id` | Delete course      | Admin  |

---

## Previous Year Question APIs

| Method | Endpoint               | Description         | Access |
| ------ | ---------------------- | ------------------- | ------ |
| GET    | `/api/pyqs`            | Get published PYQs  | Public |
| GET    | `/api/pyqs/:id`        | Get PYQ details     | Public |
| POST   | `/api/pyqs/:id/submit` | Submit test answers | Public |
| GET    | `/api/pyqs/admin/list` | Get all PYQs        | Admin  |
| POST   | `/api/pyqs/admin`      | Create PYQ          | Admin  |
| PUT    | `/api/pyqs/admin/:id`  | Update PYQ          | Admin  |
| DELETE | `/api/pyqs/admin/:id`  | Delete PYQ          | Admin  |

---

## Notification APIs

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| GET    | `/api/notifications`              | Fetch notifications       |
| GET    | `/api/notifications/unread-count` | Get unread count          |
| PUT    | `/api/notifications/:id`          | Mark notification as read |

---

## Upload APIs

| Method | Endpoint                      | Description            | Access    |
| ------ | ----------------------------- | ---------------------- | --------- |
| POST   | `/api/upload/image`           | Upload a single image  | Protected |
| POST   | `/api/upload/images`          | Upload multiple images | Protected |
| GET    | `/api/upload/images`          | Get uploaded images    | Admin     |
| DELETE | `/api/upload/image/:filename` | Delete uploaded image  | Protected |

---

# 🔐 Authentication Flow

Authentication is implemented using **JSON Web Tokens (JWT)**.

```text
User Login
      │
      ▼
Validate Credentials
      │
      ▼
Generate JWT Token
      │
      ▼
Return Token to Client
      │
      ▼
Store Token (Local Storage)
      │
      ▼
Send Token in Authorization Header
      │
      ▼
Protected API Access
```

Authorization header format:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend validates every protected request using authentication middleware before allowing access.

---

# ⚡ Real-Time Communication (Socket.IO)

The platform uses **Socket.IO** for real-time features.

Current events include:

| Event             | Description                                   |
| ----------------- | --------------------------------------------- |
| `connection`      | Triggered when a client connects              |
| `join`            | Joins a user-specific room                    |
| `disconnect`      | Triggered when a client disconnects           |
| `newNotification` | Broadcasts newly published blog notifications |
| `imageUploaded`   | Broadcasts successful image uploads           |

---

# 📤 Image Upload Workflow

Images are uploaded using **Multer** middleware.

Supported features include:

* Single image upload
* Multiple image upload
* Image type validation
* File size validation
* Static file serving
* Rich text editor image insertion
* Profile picture upload
* Blog image upload
* Course image upload

Supported image formats:

* JPG
* JPEG
* PNG
* WEBP
* GIF

---

# 🌱 Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Create a `.env` file inside the **frontend** directory.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# 🔒 Security Features

The application includes several security mechanisms.

* JWT Authentication
* Password Hashing using bcryptjs
* Protected API Routes
* Role-Based Authorization
* File Type Validation
* File Size Validation
* Environment Variable Protection
* CORS Configuration
* Secure Password Storage

---

# 📊 Backend Features Summary

✔ User Authentication

✔ Admin Dashboard

✔ Course Management

✔ Blog Management

✔ Previous Year Question Management

✔ Online Test Evaluation

✔ Profile Management

✔ Image Upload

✔ Real-time Notifications

✔ RESTful API

✔ MongoDB Integration

✔ Role-Based Access Control
