# Code Walkthrough - Node.js Hapi Template

This document provides a walkthrough of the codebase, explaining the architecture, key directories, and technologies used in this Hapi-based template.

## Architecture Overview

The project follows a standard Hapi.js server structure, organized by functionality within the `lib/` directory. It uses a layered architecture to separate concerns:

- **Routing Layer**: Handles incoming HTTP requests and maps them to handler functions.
- **Service Layer**: Contains business logic and interacts with external services or DAOs.
- **DAO Layer (Data Access Object)**: Manages interactions with the database or data storage.
- **Schema Layer**: Defines validation schemas for requests and responses using Joi.

## Key Directories

### [lib/routes](file:///Users/rac/Desktop/day-2/nodejs-hapi-template/lib/routes)
Contains the API route definitions. Routes are organized by feature (e.g., `login`, `music`, `signup`). Each feature directory typically contains a `routes.js` file defining the endpoints and their configurations.

### [lib/services](file:///Users/rac/Desktop/day-2/nodejs-hapi-template/lib/services)
Houses the business logic of the application. Services handle complex operations, such as authentication (e.g., `supabaseAuth.js`) or interacting with external APIs (e.g., `itunes` services).

### [lib/daos](file:///Users/rac/Desktop/day-2/nodejs-hapi-template/lib/daos)
Contains Data Access Objects that encapsulate the logic for interacting with the database. For example, `likedSongsDao.js` manages operations related to liked songs.

### [lib/schema](file:///Users/rac/Desktop/day-2/nodejs-hapi-template/lib/schema)
Defines Joi schemas for request validation (payload, query parameters, headers). This ensures that incoming data adheres to the expected format and constraints.

### [utils](file:///Users/rac/Desktop/day-2/nodejs-hapi-template/utils)
General-purpose utility functions used throughout the application, such as logging and environment configuration.

## Key Technologies

- **Hapi.js**: The core web framework.
- **Joi**: Used for powerful data validation.
- **Lodash**: Utility library for data manipulation.
- **Winston**: For logging.
- **Cls-rtracer**: For request tracing.
- **Hapi-swaggerui**: Automatically generates API documentation from route definitions.
- **Axios**: For making HTTP requests.

## Request Flow

1. **Request Received**: An HTTP request hits the Hapi server.
2. **Middleware/Extensions**: Global extensions like `onRequest`, `onPreHandler`, and `onPreResponse` in `server.js` may process the request (e.g., camelCase/snakeCase conversion).
3. **Route Matching**: Hapi matches the request to a defined route in `lib/routes`.
4. **Validation**: Joi schemas defined in `lib/schema` validate the request payload, headers, or query parameters.
5. **Handler Execution**: The route handler is executed. It typically calls one or more functions in `lib/services`.
6. **Service Logic**: Services perform business logic, potentially interacting with `lib/daos` for database access.
7. **DAO Interaction**: DAOs execute queries against the data store.
8. **Response Generation**: The handler returns a response, which may be transformed by extensions (e.g., `onPreResponse`) before being sent back to the client.
