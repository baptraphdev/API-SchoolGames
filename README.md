# Student-Teacher API

A RESTful API for managing student and teacher records using Node.js, Express, and Firebase Firestore.

## Features

- CRUD operations for student and teacher management
- Firebase Firestore integration in test mode
- Data validation and error handling
- RESTful API design

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a Firebase project and enable Firestore in test mode
4. Update the `.env` file with your Firebase credentials
5. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Teachers

- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create a new teacher
- `PUT /api/teachers/:id` - Update a teacher
- `DELETE /api/teachers/:id` - Delete a teacher

## Student Model

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "grade": 9,
  "age": 15
}
```

## Teacher Model

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "subject": "Mathematics",
  "department": "Science"
}
```