# Task Manager API

## Overview
This is a RESTful API built with **Node.js, Express, and MongoDB** for task management. Users can **register, log in, create, update, and manage tasks** with filtering, sorting, and pagination. The API supports **JWT-based authentication**, **role-based access control (Admin/User)**, and **soft deletion & restoration**.

---

## Features
- **User Authentication** (Register & Login with JWT)
- **User Management** (Admin can create, update, delete, and restore users)
- **Task Management** (CRUD operations with filtering, sorting, pagination)
- **Soft Delete & Restore** for Users & Tasks
- **API Documentation** (Swagger UI)
- **Automated Tests** using Jest & Supertest
- **Docker Support** (Optional for MongoDB setup)

---

##Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Jest, Supertest
- **Documentation:** Swagger
- **Containerization (Optional):** Docker & Docker Compose

---

## Setup Instructions
**Clone the Repository**
 git clone https://github.com/rainvikas/task-manager-backend.git
 cd task-manager-backend
```

**Install Dependencies**
 npm install
```

**Set Up Environment Variables**
Create a `.env` file in the root directory and add:
```
MONGO_URI=mongodb+srv://Vikas_Yadav:OLpGLpDMLgf2FXK2@cluster0.rjcfp6f.mongodb.net/TaskManager?authSource=admin
PORT=2025
JWT_SECRET=vikas
```

**Start the Server**
 npm start      # Start server normally
```

### Run Tests**
 npm test
```

---

## API Documentation
**Swagger UI**
After starting the server, open:
```
http://localhost:2025/api-docs
```
It provides **interactive API documentation** where you can test API endpoints directly.
![alt text](swagger.PNG)

---

Happy Coding!

