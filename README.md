# Meat Place

A RESTful API project named **meat-place** for place management, built with Node.js, Express.js, and MySQL.

## Features

- **User Authentication**: Register/login with JWT-based authentication and session management.
- **Role-Based Access**: Supports roles like `ADMIN` and `USER` with protected routes.
- **Place Resource Management**: Endpoints for creating, listing, and managing places, including facility details and images.
- **Owner Management**: Register, list, and delete place owners.
- **Place Search**: Search places by various criteria.
- **Reservation System**: Reserve place for users.
- **Swagger API Documentation**: Interactive API docs available.

## API Documentation

The full API documentation is available via Swagger UI at:

```
http://localhost:4000/api-docs
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MySQL](https://www.mysql.com/)
- [npm](https://www.npmjs.com/)
- Having a database named `place`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ME-Atish/meat-place.git
   cd meat-place
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
   MYSQL_URI=mysql://username:password@localhost:3306/place
   ACCESS_TOKEN_SECRET=your-secret
   REFRESH_TOKEN_SECRET=your-refresh-secret
   REMEMBER_ME_TOKEN_SECRET=your-remember-token
   ```

4. **Start MySQL** (if not running already) and make sure you have created a database named `place`.

5. **Run the application:**
   ```bash
   npm run start
   ```
   The server should now be running at `http://localhost:4000`.

6. **View API docs:**  
   Open [http://localhost:4000/api-docs](http://localhost:4000/api-docs) in your browser.

## Project Structure

- `server.js` - Entry point, connects to MySQL and starts the server.
- `app.js` - Sets up Express, middleware, routes, session, and Swagger docs.
- `routers/v1/` - Versioned API routers (auth, user, owner, place, search).
- `controllers/v1/` - Business logic for handling requests.
- `models/` - Sequelize models for users, places, owners, reservations.
- `middlewares/` - Auth and role-based access control.
- `utils/` - Helper utilities (e.g., file uploader, validators).
- `config/swagger.js` - Swagger API docs configuration.

Check the Swagger docs for detailed request/response schemas and authorization requirements.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Author:** [ME-Atish](https://github.com/ME-Atish)
