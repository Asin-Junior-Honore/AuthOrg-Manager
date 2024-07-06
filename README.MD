

# AuthOrg Manager

AuthOrg Manager is a powerful backend application designed to handle user authentication and organization management seamlessly. Built with Node.js, Express, Sequelize ORM, and JWT for authentication, this application provides a robust foundation for managing users and their associated organizations.

## Features

- **User Registration**: Register new users with validation and automatic creation of a default organization.
- **User Login**: Securely log in users and provide JWT tokens for authenticated access.
- **Organization Management**: Create and manage organizations, fetch user-associated organizations, and manage organization memberships.
- **Authentication Middleware**: Protect routes with JWT-based authentication middleware.

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/auth-org-manager.git
cd auth-org-manager
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Create a `.env` file in the root directory and add the following environment variables:

```env
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

4. **Database Setup**

Ensure you have PostgreSQL installed and create a database for the application. Update the `DATABASE_URL` in the `.env` file accordingly.

Run migrations to set up the database schema:

```bash
npx sequelize-cli db:migrate
```

5. **Start the Application**

```bash
npm start
```

The application will be running on `http://localhost:3000`.

## API Endpoints

### Authentication

- **Register**: `POST /auth/register`

  Request Body:

  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password",
    "phone": "1234567890"
  }
  ```

  Response:

  ```json
  {
    "status": "success",
    "message": "Registration successful",
    "data": {
      "accessToken": "jwt_token",
      "user": {
        "userId": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    }
  }
  ```

- **Login**: `POST /auth/login`

  Request Body:

  ```json
  {
    "email": "john@example.com",
    "password": "password"
  }
  ```

  Response:

  ```json
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "accessToken": "jwt_token",
      "user": {
        "userId": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    }
  }
  ```

### Users

- **Get User by ID**: `GET /api/users/:id`

  Headers:

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

  Response:

  ```json
  {
    "status": "success",
    "message": "User data fetched successfully",
    "data": {
      "userId": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
  ```

### Organizations

- **Get Organizations**: `GET /api/organisations`

  Headers:

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

  Response:

  ```json
  {
    "status": "success",
    "message": "Organisations fetched",
    "data": {
      "organisations": [
        {
          "orgId": 1,
          "name": "John's Organisation",
          "description": ""
        }
      ]
    }
  }
  ```

- **Create Organization**: `POST /api/organisations`

  Headers:

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

  Request Body:

  ```json
  {
    "name": "New Organisation",
    "description": "Description of the new organisation"
  }
  ```

  Response:

  ```json
  {
    "status": "success",
    "message": "Organisation created successfully",
    "data": {
      "orgId": 2,
      "name": "New Organisation",
      "description": "Description of the new organisation"
    }
  }
  ```

- **Get Organization by ID**: `GET /api/organisations/:orgId`

  Headers:

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

  Response:

  ```json
  {
    "status": "success",
    "message": "Organisation data fetched successfully",
    "data": {
      "organisation": {
        "orgId": 1,
        "name": "John's Organisation",
        "description": ""
      }
    }
  }
  ```

- **Add User to Organization**: `POST /api/organisations/:orgId/users`

  Headers:

  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```

  Request Body:

  ```json
  {
    "userId": 2
  }
  ```

  Response:

  ```json
  {
    "status": "success",
    "message": "User added to organisation successfully"
  }
  ```

## Running Tests

To run tests, use the following command:

```bash
npm test
```

## Contributing

We welcome contributions from the community! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get involved.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

This README provides a comprehensive overview of AuthOrg Manager, including installation steps, API documentation, and instructions for running tests. By following this guide, developers can quickly get started with the application and understand its core functionalities.
