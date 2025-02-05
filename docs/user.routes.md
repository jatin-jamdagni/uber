# User Routes

This file defines the routes for user-related operations.

## Routes

- `POST /api/v1/user/register`: Registers a new user.
- `POST /api/v1/user/signin`: Signs in an existing user.
- `GET /api/v1/user/logout`: Logs out the current user.
- `GET /api/v1/user/profile`: Retrieves the profile of the current user.

## Example Usage in Postman

### Register a New User

1. Set the request type to `POST`.
2. Set the URL to `http://localhost:3000/api/v1/user/register`.
3. In the `Body` tab, select `raw` and `JSON` format.
4. Provide the following JSON data:
   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john.doe@example.com",
     "password": "password123"
   }
   ```
5. Click `Send`.

### Sign In

1. Set the request type to `POST`.
2. Set the URL to `http://localhost:3000/api/v1/user/signin`.
3. In the `Body` tab, select `raw` and `JSON` format.
4. Provide the following JSON data:
   ```json
   {
     "email": "john.doe@example.com",
     "password": "password123"
   }
   ```
5. Click `Send`.

### Get User Profile

1. Set the request type to `GET`.
2. Set the URL to `http://localhost:3000/api/v1/user/profile`.
3. In the `Headers` tab, add a header with the key `Authorization` and the value `Bearer <your_jwt_token>`.
4. Click `Send`.

### Logout

1. Set the request type to `GET`.
2. Set the URL to `http://localhost:3000/api/v1/user/logout`.
3. In the `Headers` tab, add a header with the key `Authorization` and the value `Bearer <your_jwt_token>`.
4. Click `Send`.
