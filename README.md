# Ecomm-med-bcknd

## Overview

This project implements a Node.js RESTful API for user authentication, user management, and product management. It includes features like user registration, login/logout, token-based authentication using JWT (JSON Web Tokens), CRUD operations for products, and user profile management. The API is secured with bcrypt for password hashing and includes error handling with custom error classes.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime environment.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database used with Mongoose ODM.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT (JSON Web Tokens)**: Token-based authentication mechanism.
- **bcrypt**: Library for hashing passwords.
- **Stripe API**: Payment processing API (optional, if included).
- **Postman**: API development and testing tool (for testing endpoints).
- **Git**: Version control system.

## Project Structure

The project is structured as follows:

```
project-root/
│
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   └── user.controller.js
│
├── models/
│   ├── product.model.js
│   └── user.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   └── user.routes.js
│
├── utils/
│   ├── asyncHandler.js
│   ├── ApiResponse.js
│   └── ApiError.js
│
├── app.js (or server.js)
├── .env (environment variables setup)
├── package.json
└── README.md
```

- **controllers/**: Contains logic for handling HTTP requests and responses.
- **models/**: Defines Mongoose schemas for MongoDB documents.
- **routes/**: Defines API endpoints and their corresponding controller methods.
- **utils/**: Utility functions like async handler, ApiResponse, and ApiError.
- **app.js**: Entry point of the application (or server.js).
- **.env**: Environment variables for configuration (e.g., database URI, JWT secret).

## Features

### Authentication

- **Register User**: `POST /api/auth/register`
- **Login User**: `POST /api/auth/login`
- **Logout User**: `POST /api/auth/logout`
- **Refresh Access Token**: `POST /api/auth/refresh-token`
- **Change Password**: `PUT /api/auth/change-password`

### User Management

- **Get Current User**: `GET /api/auth/me`
- **Update User Details**: `PUT /api/users/update-details`
- **Update User Location**: `PUT /api/users/update-location`
- **Update User Role to Seller/Admin**: `PUT /api/users/update-to-seller`

### Product Management

- **Get All Products**: `GET /api/products`
- **Get Product by ID**: `GET /api/products/:id`
- **Create Product**: `POST /api/products`
- **Update Product**: `PUT /api/products/:id`
- **Delete Product**: `DELETE /api/products/:id`
- **Add Review to Product**: `POST /api/products/:id/reviews`
- **Get Reviews of Product**: `GET /api/products/:id/reviews`
- **Delete Review from Product**: `DELETE /api/products/:id/reviews/:reviewId`
- **Get Product Categories**: `GET /api/products/categories`

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   REFRRESH_TOKEN_SECRET=<your-refresh-token-secret>
   ```

4. **Run the server**

   ```bash
   npm start
   ```

5. **Testing endpoints**

   Use tools like Postman or curl to test the defined endpoints.

6. **Deployment**

   Add instructions for deploying your application, if applicable.

## Contributing

Contributions are welcome! Here's how you can contribute:

- Fork the repository
- Create a new branch (`git checkout -b feature/feature-name`)
- Make changes and commit (`git commit -am 'Add new feature'`)
- Push to the branch (`git push origin feature/feature-name`)
- Create a pull request

## License

Specify your project's license (e.g., MIT License).

## Acknowledgments

Mention any libraries, tutorials, or resources used in your project.

---

Adjust the sections, paths, and content according to your project specifics. This detailed README provides a comprehensive guide for understanding and setting up your Node.js API project based on the discussions and code we've covered.