# CredXAI backend: local testing and deployment notes

## Configuration

The backend now reads environment variables rather than storing database credentials or a JWT signing secret in `application.properties`.

| Variable | Local example | Deployment value |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/credtest` | Hosted MySQL JDBC URL |
| `DB_USERNAME` | `root` | Hosted database username |
| `DB_PASSWORD` | Your local MySQL password | Hosted database password |
| `JWT_SECRET` | Random secret of at least 32 bytes | Strong random secret; keep private |
| `JWT_EXPIRATION` | `86400000` | Desired lifetime in milliseconds |
| `ML_ALTERNATIVE_URL` | `http://127.0.0.1:8001` | Public/private reachable alternative model API base URL |
| `ML_TRADITIONAL_URL` | `http://127.0.0.1:8002` | Public/private reachable traditional model API base URL |
| `PORT` | `8080` | Usually supplied by the host |
| `FLYWAY_BASELINE_ON_MIGRATE` | `false` | `false` for a new database with migrations; only enable deliberately for an existing schema |

Do not commit `.env` files or real credentials. Rotate any database password or JWT secret that has previously been committed or shared. The JWT secret must be at least 32 UTF-8 bytes for the current HMAC key implementation.

### PowerShell example for local testing

Run these in the same PowerShell window before starting the app. Replace the examples with your own local values:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/credtest"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "YOUR_LOCAL_MYSQL_PASSWORD"
$env:JWT_SECRET = "REPLACE_WITH_A_RANDOM_SECRET_AT_LEAST_32_BYTES_LONG"
$env:ML_ALTERNATIVE_URL = "http://127.0.0.1:8001"
$env:ML_TRADITIONAL_URL = "http://127.0.0.1:8002"
.\mvnw.cmd spring-boot:run
```


## Error response contract

The REST exception handler returns a JSON object containing `timestamp`, `status`, `error`, and a safe `message`. Unexpected errors return a generic 500 response. ML connectivity and response failures return 503. Missing users return 404. Authentication failures in the existing controller return 401 for login and 400 for invalid registration requests.

The Spring Security authentication entry point still responds with 401 for protected requests without valid authentication. Security filter-chain errors are not handled by `@RestControllerAdvice`.

## Smoke tests after starting the service

1. Register a test account using `POST /api/auth/register`.
2. Log in using `POST /api/auth/login` and confirm a token is returned.
3. Call a protected endpoint without a token and confirm it is rejected.
4. Call `POST /api/predictions/traditional?userId=<test-user-id>` with a valid JSON request and a bearer token.
5. Repeat for `/api/predictions/alternative`.
6. Stop one ML API and repeat a prediction; expect HTTP 503 with a safe message.
7. Send malformed JSON and confirm HTTP 400.
8. Confirm prediction history still works for an authenticated user.

Do not use real customer financial information during smoke testing.
