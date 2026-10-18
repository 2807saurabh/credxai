# CredXAI: Full-Stack Explainable AI Credit Risk Platform

CredXAI is an end-to-end explainable AI (XAI) credit risk assessment platform. It combines calibrated traditional credit bureau models (Home Credit) with alternative thin-file banking behavioral models to generate transparent, auditable credit default probabilities alongside linear coefficient feature attributions.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   React + Vite Frontend     |
                      |   (Tailwind CSS, Port 5173) |
                      +--------------+--------------+
                                     |
                                     | HTTP Proxy (/api)
                                     v
                      +-----------------------------+
                      |    Spring Boot 3.x Backend  |
                      |    (Security, JWT, Port 8080)|
                      +-------+-------------+-------+
                              |             |
                 +------------+             +------------+
                 v                                       v
    +------------------------+              +------------------------+
    | Traditional ML API     |              | Alternative ML API     |
    | (FastAPI, Port 8002)   |              | (FastAPI, Port 8001)   |
    | Home Credit Regressor  |              | Behavioral Regressor   |
    +------------------------+              +------------------------+
                 \                                       /
                  +------------------+------------------+
                                     |
                                     v
                            +-----------------+
                            | MySQL Database  |
                            | (Port 3306)     |
                            +-----------------+
```

---

## Prerequisites

Before starting the application, ensure the following are installed:
1. **Java JDK 21+** (e.g., OpenJDK 21 or Oracle JDK 21/23)
2. **Apache Maven 3.9+** (or use the included wrapper if present)
3. **Python 3.10+** (with virtual environment support)
4. **Node.js 20+** and **npm 10+**
5. **MySQL 8.0+**

---

## Step 1: MySQL Database Setup

1. Start your local MySQL server on port `3306`.
2. Connect to MySQL as root and create the database `credtest`:
   ```sql
   CREATE DATABASE credtest;
   ```
3. Verify your credentials in `credxai-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/credtest
   spring.datasource.username=****
   spring.datasource.password=*****
   ```
   *(Flyway database migrations will automatically run and establish schema version 1 upon backend startup.)*

---

## Step 2: Set Up Python ML Microservices

1. Navigate to the project root:
   ```bash
   cd D:\CredXAI
   ```
2. Activate or create a virtual environment:
   ```bash
   # Windows PowerShell
   .\.venv\Scripts\Activate.ps1

   # Or create new:
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install fastapi uvicorn scikit-learn pandas numpy joblib
   ```
3. Start the **Alternative Data ML Microservice** (Port 8001):
   ```bash
   uvicorn ml_api.alternative_api:app --host 127.0.0.1 --port 8001
   ```
4. In a separate terminal, start the **Traditional Credit ML Microservice** (Port 8002):
   ```bash
   cd D:\CredXAI
   .\.venv\Scripts\Activate.ps1
   uvicorn ml_api.simple_traditional_api:app --host 127.0.0.1 --port 8002
   ```

---

## Step 3: Start Spring Boot Backend

1. Navigate to the backend directory:
   ```bash
   cd D:\CredXAI\credxai-backend
   ```
2. Compile and run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.
   - Health endpoint: `http://localhost:8080/api/auth/register` (Public)
   - Prediction endpoints: `http://localhost:8080/api/predictions/**` (Requires JWT Bearer header)
   - History endpoint: `http://localhost:8080/api/predictions/history` (Requires JWT Bearer header)

---

## Step 4: Start React + Vite Frontend

1. Navigate to the frontend directory:
   ```bash
   cd D:\CredXAI\frontend
   ```
2. Install dependencies (if setting up on a new laptop):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:5173`. Vite automatically proxies requests from `/api` to the Spring Boot backend on `http://localhost:8080`.

---

## Running Automated Tests

- **Backend tests:**
  ```bash
  cd D:\CredXAI\credxai-backend
  mvn test
  ```
- **Frontend build test:**
  ```bash
  cd D:\CredXAI\frontend
  npm run build
  ```

---

## Key Features

- **Explainable AI (XAI):** Linear feature attributions display both risk-increasing and risk-reducing factors with normalized waterfall graphs.
- **Dual Underwriting Modes:**
  - *Traditional Model:* 12 demographic and debt-to-annuity parameters from Home Credit.
  - *Alternative Model:* 8 behavioral banking and transaction indicators for gig-economy & thin-file applicants.
- **Role-Based Access & Isolation:** Audited application history strictly isolated by JWT identity.
