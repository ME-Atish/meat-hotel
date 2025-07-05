# Meat Hotel

A RESTful API project named **meat-hotel** for hotel management, built with Node.js, Express.js, and MongoDB.

## Features

- **User Authentication**: Register/login with JWT-based authentication and session management.
- **Role-Based Access**: Supports roles like `ADMIN` and `USER` with protected routes.
- **Hotel Resource Management**: Endpoints for creating, listing, and managing hotels, including facility details and images.
- **Owner Management**: Register, list, and delete hotel owners.
- **Hotel Search**: Search hotels by various criteria.
- **Reservation System**: Reserve hotels for users.
- **Swagger API Documentation**: Interactive API docs available.

## API Documentation

The full API documentation is available via Swagger UI at:

```
http://localhost:4000/api-docs
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ME-Atish/meat-hotel.git
   cd meat-hotel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in the required values (see below)

   Example:
   ```
   PORT=4000
   MONGOOSE_URI=mongodb://localhost:27017/meathotel
   ACCESS_TOKEN_SECRET=your-secret
   REFRESH_TOKEN_SECRET=your-refresh-secret
   ```

4. **Start MongoDB** (if not running already).

5. **Run the application:**
   ```bash
   npm run start
   ```
   The server should now be running at `http://localhost:4000`.

6. **View API docs:**  
   Open [http://localhost:4000/api-docs](http://localhost:4000/api-docs) in your browser.

## Project Structure

- `server.js` - Entry point, connects to MongoDB and starts the server.
- `app.js` - Sets up Express, middleware, routes, session, and Swagger docs.
- `routers/v1/` - Versioned API routers (auth, user, owner, hotel, search).
- `controllers/v1/` - Business logic for handling requests.
- `models/` - Mongoose schemas for users, hotels, owners, reservations.
- `middlewares/` - Auth and role-based access control.
- `utils/` - Helper utilities (e.g., file uploader, validators).
- `config/swagger.js` - Swagger API docs configuration.

## Notable Endpoints

- `POST /v1/auth/register` - Register a new user
- `POST /v1/auth/login` - Login user
- `GET /v1/user/` - List all users (admin only)
- `GET /v1/hotel/` - List all hotels (admin only)
- `POST /v1/hotel/` - Create a new hotel (owner only)
- `GET /v1/owner/` - List all owners (admin only)
- `POST /v1/owner/` - Register a new owner (authenticated user)
- `DELETE /v1/owner/{id}` - Delete an owner by ID (admin only)
- `GET /v1/search/` - Search for hotels

Check the Swagger docs for detailed request/response schemas and authorization requirements.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Author:** [ME-Atish](https://github.com/ME-Atish)