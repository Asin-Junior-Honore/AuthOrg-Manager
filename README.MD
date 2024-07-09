

# AuthOrg Manager

AuthOrg Manager is a robust backend application designed for managing user authentication and organization management. Built with Node.js, Express, and Sequelize ORM, it offers secure authentication, user registration, and organization management functionalities. The application uses PostgreSQL as its database and is deployed on Vercel (API) and Render.com (database).

## Features

- User Registration and Authentication
- Organization Management
- Association of Users with Multiple Organizations
- JWT-based Authentication Middleware
- Comprehensive Testing with Mocha, Chai, and Supertest

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Sequelize**: Promise-based Node.js ORM for PostgreSQL.
- **PostgreSQL**: Powerful, open source object-relational database system.
- **JWT (JSON Web Tokens)**: Secure token-based authentication.
- **Mocha, Chai, Supertest**: Testing frameworks and libraries for ensuring application robustness.

## Deployment

- **API**: Vercel
- **Database**: Render.com

## Endpoints

### Authentication

- **POST /auth/register**

  - Registers a new user and creates a default organization.
  - **Request Body**:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "password",
      "phone": "1234567890"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "message": "Registration successful",
      "data": {
        "accessToken": "jwt_token",
        "user": {
          "userId": "user_id",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "phone": "1234567890",
          "organisation": {
            "orgId": "org_id",
            "name": "John's Organisation",
            "description": "This organisation was created by John."
          }
        }
      }
    }
    ```

- **POST /auth/login**
  - Logs in a user and returns an access token.
  - **Request Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "message": "Login successful",
      "data": {
        "accessToken": "jwt_token",
        "user": {
          "userId": "user_id",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "phone": "1234567890"
        }
      }
    }
    ```

### User

- **GET /api/users/:id**
  - Fetches a user's details by their ID.
  - **Response**:
    ```json
    {
      "status": "success",
      "data": {
        "userId": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    }
    ```

### Organisation

- **GET /api/organisations**

  - Fetches all organizations associated with the authenticated user.
  - **Response**:
    ```json
    {
      "status": "success",
      "data": {
        "organisations": [
          {
            "orgId": "org_id",
            "name": "John's Organisation",
            "description": "This organisation was created by John."
          },
          {
            "orgId": "another_org_id",
            "name": "Another Organisation",
            "description": "This is another organisation."
          }
        ]
      }
    }
    ```

- **POST /api/organisations**

  - Creates a new organization.
  - **Request Body**:
    ```json
    {
      "name": "New Organisation",
      "description": "Description of the new organisation"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "message": "Organisation created successfully",
      "data": {
        "organisation": {
          "orgId": "org_id",
          "name": "New Organisation",
          "description": "Description of the new organisation"
        }
      }
    }
    ```

- **GET /api/organisations/:orgId**

  - Fetches a specific organization by its ID.
  - **Response**:
    ```json
    {
      "status": "success",
      "data": {
        "organisation": {
          "orgId": "org_id",
          "name": "Organisation Name",
          "description": "Organisation description"
        }
      }
    }
    ```

- **POST /api/organisations/:orgId/users**
  - Adds a user to a specific organization.
  - **Request Body**:
    ```json
    {
      "userId": "user_id"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "success",
      "message": "User added to organisation successfully",
      "data": {
        "organisation": {
          "orgId": "org_id",
          "name": "Organisation Name",
          "description": "Organisation description"
        }
      }
    }
    ```

## Testing

The application includes comprehensive tests covering various scenarios, including user registration, login, and organization management. Tests are written using Mocha, Chai, and Supertest.

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

### Sample Test Code

```javascript
const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../config/database");
const dotenv = require("dotenv");

dotenv.config();

describe("Auth Endpoints", function () {
  this.timeout(20000);

  before(async function () {
    this.timeout(20000);
    try {
      await sequelize.sync({ force: true });
    } catch (error) {
      throw error;
    }
  });

  describe("POST /auth/register", () => {
    it("Should register user successfully with default organisation", async function () {
      const { expect } = await import("chai");
      const res = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
        phone: "1234567890",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.data).to.have.property("accessToken");
      expect(res.body.data.user).to.include({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
      });

      expect(res.body.data.user.organisation).to.be.an("object");
      expect(res.body.data.user.organisation).to.have.property(
        "name",
        "John's Organisation"
      );
    });

    // Additional test cases here...
  });


});
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/authorg-manager.git
   ```

2. Install dependencies:

   ```bash
   cd authorg-manager
   npm install
   ```

3. Configure environment variables by creating a `.env` file:

   ```bash
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_database_url
   ```

4. Run database migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Deployment

- **API**: Deployed on Vercel
- **Database**: Hosted on Render.com

# Happy coding ✌️
---
