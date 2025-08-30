# Meat Place (v2)

A RESTful API for hotel management, built with **NestJS** and **PostgreSQL**.

## Features

- **User Authentication:** Secure registration and login using JWT.
- **Role-Based Access:** Granular routes for `ADMIN` and `USER` roles.
- **Hotel Management:** Create, list, and update hotels with facilities and images.
- **Owner Management:** Register, list, and remove hotel owners.
- **Reservation System:** Book hotels for users.
- **Interactive API Docs:** Swagger (OpenAPI) documentation available.

## API Documentation

Access interactive documentation at  
[http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ME-Atish/meat-place.git
   cd meat-place
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in the values:
     ```
     PORT=4000
     DATABASE_URL=postgresql://username:password@localhost:5432/place
     ACCESS_TOKEN_SECRET=your-secret
     REFRESH_TOKEN_SECRET=your-refresh-secret
     REMEMBER_ME_TOKEN_SECRET=your-remember-token
     ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Initialize the database:**
   ```bash
   npm run db:init
   ```

6. **Start the server:**
   ```bash
   npm run start
   ```

7. **(Optional) Lint your code:**
   ```bash
   npm run lint
   ```

8. **View API docs:**  
   Open [http://localhost:4000/api-docs](http://localhost:4000/api-docs) in your browser.

Refer to Swagger docs for request/response details and authorization info.

## License

Licensed under the [MIT License](LICENSE).

---

**Author:** [ME-Atish](https://github.com/ME-Atish)