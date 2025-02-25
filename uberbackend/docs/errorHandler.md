
### 7. `docs/errorHandler.md`

```markdown
# Error Handler

This file defines middleware to handle errors in the Express application.

## Example Usage

```typescript
import express from 'express';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use((req, res, next) => {
    throw new Error('Something went wrong!');
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});