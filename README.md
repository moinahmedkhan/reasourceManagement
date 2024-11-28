# Resource Management API

This API provides functionalities for managing resources including uploading files, handling resource expiry, and offering user authentication with role-based access control. It is built using **NestJS**, leveraging **JWT** authentication and **RabbitMQ** for messaging, and supports **TypeORM** with a MySQL or MariaDB database.


## Table of Contents

1. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication)
   - [User Management](#user-management)
   - [Resource Management](#resource-management)
2. [Expiry Logic](#expiry-logic)
3. [Setup Instructions](#setup-instructions)
4. [Development](#development)
5. [Testing](#testing)
6. [Contributing](#contributing)

## API Endpoints

This section provides details of the available API endpoints.

### Authentication

#### `POST /auth/register`
**Description:** Registers a new user.  
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
 #### Responses
 - 201: Successfully registered.
 - 400: Invalid request data.

#### `POST /auth/login`
**Description:** Authenticates the user and returns a JWT token.
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Responses:**
 - 200: Returns the JWT token.
 - 401: Unauthorized (invalid credentials).

### User Management
#### `GET /user/me`
- **Description:** Fetches the details of the currently authenticated user.
- **Authentication:** Bearer JWT token required.
- **Responses:**
  - 200: Successfully retrieved user details.
  - 404: User not found.


#### `PUT /user`
- **Description:** Updates the authenticated user's details.
- **Authentication:** Bearer JWT token required.
- **Request Body:**
 ```json
{
  "username": "string",
  "password": "string"
}
```
**Responses:**
- 200: User successfully updated.
- 400: Invalid data.
- 404: User not found.


### Resource Management
#### `POST /resources/upload`
- **Description:** Uploads a file and generates a unique URL for accessing it.
- **Request Body:**
    - **Form-data** with a file field.
- **Responses:**
  - 200: URL of the uploaded file.
  - 400: File missing or invalid.

 #### `POST /resources/fetch-by-status`
 
- **Description:** Retrieves resources based on their status (`active` or `expired`).
- **Request Body:**
 ```json
{
  "status": "string"  // "active" or "expired"
}
```
- **Query Parameters:**
  - page: Page number (default: 1).
  - pageSize: Number of items per page (default: 10).
- **Responses:**
  - 200: List of resources matching the status.
  - 400: Invalid status provided.
#### `POST /resources/id`
- **Description:** Fetches a resource by its ID.
- **Request Body:**
```json
{
  "id": "number"
}
```
- **Responses**
  - 200: Resource found.
  - 404: Resource not found.
#### `DELETE /resources/delete`
- **Description:** Deletes a resource by its ID.
- **Request Body:**
  ```json
  {
  "id": "number"
  }
  ```
- **Responses:**
  - 200: Successfully deleted.
  - 404: Resource not found.
#### `POST /resources/fetchAllResources`
- **Description:** Retrieves all resources or filtered by their status (`active`, `expired`).
- **Request Body:**
   ```json
  {
  "status": "string" // Optional: "active" or "expired"
  }
  ```
- **Query Parameters:**
  - page: Page number (default: 1).
  - pageSize: Number of items per page (default: 10).
- **Responses:**
  - 200: List of resources.
  - 404: No resources found.
## Expiry Logic
The system handles automatic expiration of resources after a set period (30 minutes by default).

- **Expiration Handling:**
  - When a file is uploaded, it is automatically marked with an expiration time set to 30 minutes after upload.
  - A cron job checks the expiration time every minute, and resources are marked as expired once the expiration time has passed.
  - Expired resources cannot be accessed.
- **Cron Job Setup:**
  - The job runs every minute and checks for expired resources, updating their status.
## Setup Instructions
  Follow these steps to set up the project locally.
### Prerequisites
- **Node.js** (v14.x or later)
- **MySQL** or **MariaDB** (for TypeORM)
- **RabbitMQ** (Optional, for messaging functionality)
## 1. Clone the Repository
  ```json
git clone <repository-url>
cd <project-directory>
  ```
## 2. Install Dependencies
```json
npm install
```
## 3. Configure Environment Variables
Create a `.env` file based on `.env.example` and update the values:
```json
# .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=resource_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=3600s
APP_PORT=3000
RABBITMQ_URL=amqp://localhost:5672
```
## 4. Run Migrations
To apply database migrations, use the following command:
```json
npm run migration:run
```
## 5. Start the Application
Run the application with:
```json
npm run start

```
By default, the API will be available at `http://localhost:3000`.

## 6. RabbitMQ Setup (Optional)
If you wish to use RabbitMQ for messaging, ensure RabbitMQ is running locally or on your network. You can configure the RabbitMQ URL in the `.env` file.

## Development
### Running the Application in Development Mode
To run the app in development mode, use:
```json
npm run start:dev
```
This will automatically watch for file changes and reload the server.

### Linting and Formatting
To lint and format the code, use:
```json
npm run lint
npm run format
```
## Testing
To run tests for the API, use:
```json
npm run test
```
For end-to-end tests:
```json
npm run test:e2e
```
Tests are written using Jest and can be found in the `test/` directory.












  
