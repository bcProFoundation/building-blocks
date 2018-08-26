# Testing Authorization Server

### Unit tests for NestJS

Object creation as per required dependencies is at least tested.

### E2E tests for NestJS

Following tests are run with mongodb as backing service (to test closest to production env)

#### Auth E2E

- Valid Signup
- Signup Invalid email
- Signup blank password

#### OAuth 2.0 E2E

- Invalid Token Use
- Login into session
- Client Credentials
- Authorization Code Grant
- Code Exchange
- Request Owner Password Credentials
- Implicit Grant
- Refresh Token Exchange
