
### 5. `docs/user.controller.md`

```markdown
# User Controller

This file defines the controllers for user-related operations.

## Controllers

- `userRegisterController`: Registers a new user.
- `userSigninController`: Signs in an existing user.
- `getUserProfileController`: Retrieves the profile of the current user.
- `userLogoutController`: Logs out the current user.

## Example Usage

```typescript
import { userRegisterController, userSigninController } from './controllers/user.controller';

app.post('/register', userRegisterController);
app.post('/signin', userSigninController);