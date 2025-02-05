
### 6. `docs/prismaMiddleware.md`

```markdown
# Prisma Middleware

This file defines middleware to attach the Prisma client to every request.

## Example Usage

```typescript
import express from 'express';
import { prismaMiddleware } from './middleware/prismaMiddleware';

const app = express();

app.use(prismaMiddleware);

app.get('/', (req, res) => {
    console.log(req.prisma); // Access the Prisma client
    res.send('Hello world!');
});