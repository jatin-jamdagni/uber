# App

This file sets up the Express application and middleware.

## Middleware

- `cors()`: Enables Cross-Origin Resource Sharing.
- `express.json()`: Parses incoming JSON requests.
- `prismaMiddleware`: Attaches the Prisma client to every request.
- `urlencoded({ extended: true })`: Parses URL-encoded data.
- `cookieParser()`: Parses cookies.

## Routes

- `GET /`: Returns a "Hello world!" message.
- `use("/api/v1/user", userRouter)`: Mounts the user routes.

## Error Handling

- `errorHandler`: Handles errors and returns a 500 status code.
- `404 Not Found`: Returns a 404 status code for unknown routes.

## Example Usage

```typescript
import app from "./app";

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```
