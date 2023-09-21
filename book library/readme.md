# Assignment Readme

This document provides an overview of the assignment and describes the structure and functionality of the provided code files.

# Overview
The assignment involves the development of a web application for managing books, users, and reviews. The code is organized into several controllers responsible for different aspects of the application: user management, book management, and review management. Additionally, there is a middleware file for authentication and authorization checks.

The following code files are provided:

retrieving, updating, and deleting books.

userController.js: Handles user-related operations, including user registration 
and login.

reviewController.js: Manages reviews for books, including creating, updating, and deleting reviews.

middleware.js: Contains middleware functions for user authentication and authorization.

route.js: Defines the application's routes and links them to the corresponding controller functions.

# Code Files


# bookController.js

This file contains functions related to book management. Here's a summary of the functions:

createbook(req, res): Creates a new book record and validates input data, including title, excerpt, ISBN, category, subcategory, and release date.

getBook(req, res): Retrieves books based on query parameters, including userId, category, and subcategory.

getBookById(req, res): Retrieves detailed information about a specific book, including its reviews.

updateBook(req, res): Updates book information, including title, excerpt, ISBN, and release date.

deleteBook(req, res): Marks a book as deleted.


# userController.js

This file contains functions related to user management:

createUser(req, res): Registers a new user and validates input data, including name, phone, email, address, and password.

login(req, res): Authenticates a user by comparing the provided email and password with stored user data.

# reviewController.js

This file contains functions related to managing reviews for books:

reviews(req, res): Creates a new review for a book and validates input data, including the bookId, reviewer information, rating, and review text.

updateReviews(req, res): Updates an existing review for a book, including reviewer information, rating, and review text.

deleteReview(req, res): Marks a review as deleted.

# middleware.js

This file contains middleware functions used for user authentication and authorization:

hashpass(req, res, next): Hashes the user's password before storing it in the database.

auth(req, res, next): Authenticates users based on JWT tokens.
Authorisation(req, res, next): Checks if the user making a request is authorized to perform the action based on their user ID.

updateAuthorisation(req, res, next): Checks if the user making a request is authorized to update a specific book based on their user ID.


# route.js

This file defines the application's routes and associates them with the corresponding controller functions. The routes include registration, login, book management, and review management.

Usage
To use the application, you can make HTTP requests to the defined routes in route.js. Ensure that you have the required dependencies and environment variables set up, such as the MongoDB connection string and JWT secret key.

Please refer to the specific controller functions in the code files for more detailed information on each endpoint's usage and validation requirements.

Feel free to reach out if you have any questions or need further assistance with the assignment.