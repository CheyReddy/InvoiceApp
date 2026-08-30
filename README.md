# Invoice & Contract Generator

A full-stack SaaS application for freelancers to manage clients, generate professional invoices, download them as PDFs, and email them directly — built with Spring Boot and React.

## Features

- **Authentication** — JWT-based register/login with secure password hashing (BCrypt)
- **Client Management** — Full CRUD for clients, scoped per authenticated user
- **Invoice Management** — Create invoices with dynamic line items, automatic tax and total calculation
- **PDF Generation** — Server-side invoice PDF generation (OpenPDF)
- **PDF Preview** — In-app preview modal with download, plus a mobile-friendly fallback for devices that can't render inline PDFs
- **Email Delivery** — Send invoices directly to clients as PDF attachments (Spring Mail)
- **Dashboard** — Outstanding vs. paid totals, recent invoices, quick actions
- **Dark Mode** — App-wide light/dark theme toggle with persisted preference
- **Responsive UI** — Usable across desktop, tablet, and mobile
- **API Documentation** — Interactive Swagger UI for all backend endpoints

## Tech Stack

**Backend**
- Java 21, Spring Boot
- Spring Security + JWT (jjwt)
- Spring Data JPA + PostgreSQL
- OpenPDF (PDF generation)
- Spring Mail (email delivery)
- springdoc-openapi (Swagger UI)

**Frontend**
- React (Vite)
- Tailwind CSS (with dark mode support)
- React Router
- React Hook Form + Zod (form validation)
- Axios

**Infrastructure**
- Backend + Database hosted on Railway
- Frontend hosted on Vercel

## Project Structure

```
.
├── Invoice-Contract-Generator/   # Spring Boot backend
│   └── src/main/java/com/cwebworks/invoiceapp/
│       ├── controller/           # REST controllers
│       ├── service/              # Business logic
│       ├── repository/           # Spring Data JPA repositories
│       ├── model/                # JPA entities
│       ├── dto/                  # Request/response DTOs
│       ├── security/             # JWT filter, UserDetailsService, JwtUtil
│       └── config/               # Security & OpenAPI configuration
│
└── invoice-frontend/              # React (Vite) frontend
    └── src/
        ├── api/                  # Axios instance + API call modules
        ├── components/           # Reusable UI components
        ├── context/              # Auth & Theme context providers
        └── pages/                # Route-level page components
```

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL (local instance, or a cloud instance such as Railway)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd Invoice-Contract-Generator
   ```

2. Create `src/main/resources/application-local.properties` with your local values:
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/invoice_db
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_generated_secret
   JWT_EXPIRATION_MS=86400000
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_gmail_app_password
   ```
   > `application.properties` references these as `${DB_URL}`, `${JWT_SECRET}`, etc. — it should never contain real secrets directly.

3. Run the app with the local profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```

4. Confirm it's running by visiting:
   ```
   http://localhost:8080/swagger-ui/index.html
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd invoice-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:5173`

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `DB_URL` | JDBC connection string for PostgreSQL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `JWT_EXPIRATION_MS` | Token validity duration in milliseconds |
| `MAIL_USERNAME` | Gmail address used to send invoice emails |
| `MAIL_PASSWORD` | Gmail App Password (not your regular password) |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `https://your-backend.up.railway.app/api`) |

## Deployment

- **Backend + Database:** Railway (auto-deploys from the connected GitHub branch; root directory set to `Invoice-Contract-Generator`)
- **Frontend:** Vercel (auto-deploys from the connected GitHub branch; root directory set to `invoice-frontend`)

After deploying, update the backend's CORS configuration (`SecurityConfig.java`) to include the live frontend URL.

## API Documentation

Once the backend is running, full interactive API documentation is available via Swagger UI:

```
{BACKEND_URL}/swagger-ui/index.html
```

## Roadmap

- [ ] Stripe integration — payment links per invoice, webhook to mark invoices as paid
- [ ] Subscription/plan gating (Free tier invoice limits, Pro tier)
- [ ] Automated overdue invoice reminders (scheduled job)
- [ ] Custom domain + production hardening (Flyway migrations, refresh tokens)

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Venkata Chaithanya Reddy Vangala 💼 Java Full-Stack Developer | 🌱 Learning React & Spring Boot
