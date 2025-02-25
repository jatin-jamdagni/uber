import { INVALID } from "zod"

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INVALID_REQUEST: 404,
    INTERNAL_SERVER_ERROR: 500
}

export const MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    INVALID_TOKEN: "Invalid token",
    USER_REGISTERED: "User registered successfully",
    USER_EXISTS: "User already exists",
    USER_SIGNED_IN: "User signed in successfully",
    USER_NOT_FOUND: "User does not exist",
    INVALID_CREDENTIALS: "Invalid email or password",
    LOGOUT_SUCCESS: "Logout successful",
    CAPTAIN_EXISTS: "Captain already exists",
    CAPTAIN_REGISTERED: "Captain register sucessfully",
    CAPTAIN_NOT_FOUND: "Captain does not exist",
    CAPTAIN_SIGNED_IN: "Captain signed in successfully",

}