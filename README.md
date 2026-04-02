# Devolenz Software License Manager

## Overview

The **Devolenz Software License Manager** is a full-stack web application designed to manage software licenses within an organization. The system enables administrators to control license allocation while allowing users to view their assigned software resources.

This project was developed as part of **IFN636 – Software Life Cycle Management** and demonstrates practical implementation of:

* full-stack development
* role-based access control
* RESTful API design
* automated testing
* CI/CD deployment on AWS EC2

---

## Objectives

* Design and implement a **role-based license management system**
* Enable **centralized control of software licenses**
* Provide **secure authentication and authorization**
* Implement **automated backend testing**
* Deploy the system using a **CI/CD pipeline**
* Demonstrate **DevOps practices in a real-world environment**

---

## Features

### Admin

* Manage software licenses (CRUD)
* View all users
* Assign licenses to users
* Remove assigned licenses
* View license allocation

### User

* Register and login
* View assigned licenses only

### System

* JWT authentication
* Role-based authorization
* MongoDB database integration
* CI/CD deployment
* AWS EC2 hosting

---

## User Roles

| Role  | Access                 |
| ----- | ---------------------- |
| Admin | Full control           |
| User  | View assigned licenses |

---

## Default Admin Access

```text
Email: admin@devolenz.com
Password: admin
```

### Admin Creation

1. Register as normal user
2. Update role in database:

```json
"role": "admin"
```

---

## Architecture

* **Frontend:** React.js
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Deployment:** AWS EC2
* **Process Manager:** PM2
* **CI/CD:** GitHub Actions

---

## Tech Stack

### Frontend

* React.js
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

### Testing

* Mocha
* Chai
* Sinon

### DevOps

* GitHub Actions
* AWS EC2
* PM2

---

## Project Structure

```text
sampleapp_IFQ636/
├── backend/
├── frontend/
└── .github/workflows/
```

---

## Database Design

### User

* name
* email
* password
* role

### License

* name
* description
* purchaseDate
* expiryDate
* assignedTo (array)

### Design Decision

Using an **array for assigned users** allows multiple users per license and better scalability.

---

## API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Users

* GET /api/users

### Licenses

* GET /api/licenses
* POST /api/licenses
* PUT /api/licenses/:id
* DELETE /api/licenses/:id
* PUT /api/licenses/:id/assign
* PUT /api/licenses/:id/remove-assignment
* GET /api/licenses/my-licenses

---

## Security

* bcrypt password hashing
* JWT authentication
* role-based middleware
* protected routes

---

## Testing

Run tests:

```bash
cd backend
npm test
```

---

## CI/CD Pipeline

Steps:

1. Checkout code
2. Install dependencies
3. Build frontend
4. Run tests
5. Create `.env`
6. Restart services with PM2

---

## Deployment

### Backend

```bash
pm2 start server.js --name license-backend
```

### Frontend

```bash
pm2 serve build 3000 --name Frontend --spa
```

---

## Environment Variables

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_secret
PORT=5001
```

---

##  Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Axios Config

```javascript
baseURL: 'http://<EC2-PUBLIC-IP>:5001'
```

## Future Improvements

* License expiry notifications
* Dashboard analytics
* Search and filtering
* Pagination
* Secure admin creation

---

## Academic Reflection

This project demonstrates:

* Basic CRUD operations
* CI/CD implementation
* cloud deployment
* software lifecycle practices

---

## Author

Shino Varghese
QUT – Master of IT (Data Science)
