

# Backend Project

This repository contains the backend code for an application built with Node.js, Express, and MongoDB. The project includes user authentication and other backend functionalities.

## Features

- User Authentication (Sign Up, Sign In, Sign Out)
- MongoDB integration for data storage
- CORS enabled for specific origins
- Environment variable configuration

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- CORS
- Body-parser

## Setup

### Prerequisites

- Node.js installed
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Shihadkv/backend.git
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB URI:
   ```
   PORT=3000
   DB_URI=your_mongodb_uri
   ```

4. Start the server:

   npm start
   ```

## Usage

### Endpoints

- **User Authentication**
  - `POST /api/auth/signup`: Register a new user
  - `POST /api/auth/signin`: Log in an existing user

### CORS Configuration

The server is configured to allow requests from specific origins:

const allowedOrigins = ['http://localhost:5173', 'https://my-project-delta-three.vercel.app', 'https://backend-y3t0.onrender.com'];


## Project Structure


backend/
├── middlewares/
├── models/
├── routes/
├── .gitignore
├── package.json
├── server.js
└── README.md

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.

---

Feel free to modify and add any additional information as needed.
