
### 8. `docs/auth.middleware.md`

```markdown
# Auth Middleware

This file defines middleware to authenticate users using JWT.

## Example Usage

```typescript
import express from 'express';
import authMiddleware from './middleware/auth.middleware';

const app = express();

app.use(authMiddleware);

app.get('/protected', (req, res) => {
    res.send('This is a protected route');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});