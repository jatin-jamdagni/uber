### 3. `docs/user.validator.md`

````markdown
# User Validator

This file defines the validation schemas for user-related operations using Zod.

## Schemas

- `userRegisterValidator`: Validates the registration data.
- `userSigninValidator`: Validates the sign-in data.

## Example Usage

```typescript
import {
  userRegisterValidator,
  userSigninValidator,
} from "./validator/user.validator";

const registerData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "password123",
};

const result = userRegisterValidator.safeParse(registerData);

if (!result.success) {
  console.error(result.error.issues);
} else {
  console.log("Validation successful", result.data);
}
```
````
