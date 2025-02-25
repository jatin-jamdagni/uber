
### 4. `docs/index.d.ts.md`

```markdown
# Type Definitions

This file extends the Express `Request` interface to include the Prisma client and user properties.

## Example Usage

```typescript
import { Request } from 'express';

const exampleMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.prisma); // Access the Prisma client
    console.log(req.user); // Access the authenticated user
    next();
};