# YogSamskara Project Architecture & Documentation

This document serves as a comprehensive guide to the YogSamskara platform. It details the technology stack, database architecture, authentication flows, and critical deployment quirks specifically related to Hostinger. **Future AI assistants should read this file completely before making architectural changes or debugging production issues.**

## 1. Project Overview
YogSamskara is a full-stack web application designed for booking yoga sessions, managing student subscriptions, and capturing lead intakes. It features a client-facing website and an secure Instructor Portal.

## 2. Technology Stack
*   **Frontend**: React.js (via Vite), TypeScript, Tailwind CSS, Framer Motion (animations), Vanta.js (background effects).
*   **Backend**: Node.js, Express.js.
*   **Database ORM**: Sequelize (MySQL dialect).
*   **Authentication**: Firebase Authentication (Client-side) + Firebase Admin SDK (Server-side verification).
*   **Payments**: Razorpay Gateway Integration.
*   **Email System**: Nodemailer (configured for Hostinger SMTP).
*   **Deployment Environment**: Hostinger Shared Hosting (Node.js via Phusion Passenger) and Vercel (Frontend).

## 3. Authentication & User Sync Flow
YogSamskara uses a hybrid authentication approach to minimize database complexity while maintaining high security:
1.  **Client Login**: Users authenticate entirely via Firebase (Email/Password or Google OAuth) on the frontend.
2.  **Backend Verification**: API requests from the frontend send the Firebase ID Token in the `Authorization: Bearer <token>` header. The backend verifies this using `firebase-admin`.
3.  **Instructor Portal Sync**: The Teacher Dashboard (`/api/admin/customers`) does **not** rely solely on the MySQL database to list users. Instead, it dynamically calls `admin.auth().listUsers()` to fetch all registered Firebase users and merges them with MySQL `Bookings`, `Profiles`, and `Subscriptions` data in real-time. This ensures no users are ever "lost" even if the MySQL database is wiped.

## 4. Database Schema (MySQL)
The production database is hosted on Hostinger MySQL (`u916218583_Yosasa`).
*   **Profiles**: Stores extended user data (Kosha balances, goals, medical conditions) linked by `userFirebaseUid`.
*   **Bookings**: Stores scheduled yoga sessions.
*   **Subscriptions**: Tracks user active plans, total sessions, and sessions used.
*   **Leads**: Stores incoming data from the Student Intake/Contact forms.
*   **PromoCodes**: Admin-created discount codes for checkout.

## 5. Critical Hostinger Deployment Quirks (MUST READ FOR DEBUGGING)
Hostinger's Phusion Passenger environment for Node.js has extreme restrictions that cause unique bugs. If the backend fails, review these rules first:

### A. The Fake "CORS" Error (Nginx 500 Interception)
If the frontend reports `No 'Access-Control-Allow-Origin' header is present`, it is almost **never** an Express CORS misconfiguration. It means the Node.js app threw a fatal, synchronous exception on startup or during a route, causing the process to exit. Hostinger's Nginx router catches the dead process and serves a generic HTML error page, which strips the CORS headers and tricks the browser. **Look for a backend code crash, not a CORS issue.**

### B. SQLite is Banned
Never attempt to use `sqlite3` or local file-based databases on the Hostinger Node environment. The native C++ binaries for SQLite usually fail to compile or load in restricted shared hosting, causing instant, silent fatal crashes on startup. Always use the Hostinger MySQL database.

### C. IPv6 Loopback Database Rejection
Modern Node.js versions (v17+) resolve `localhost` to the IPv6 address `::1` first. Hostinger's MySQL database users are explicitly bound to IPv4 (`127.0.0.1`). If you set `host: 'localhost'`, you will receive a `SequelizeAccessDeniedError` (`Access denied for user ... @ '::1'`). 
*   **Fix**: Always hardcode the database host to `127.0.0.1` in `config/db.js`.

### D. Connection String Parsing Bugs
Avoid using URL-based connection strings (`mysql://user:password@host/db`) if the database password contains special characters like `@`. The regex parser will fail and throw `SequelizeHostNotFoundError: getaddrinfo ENOTFOUND`.
*   **Fix**: Always pass connection parameters explicitly:
    ```javascript
    new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, { host: '127.0.0.1', dialect: 'mysql' });
    ```

## 6. Environment Variables
### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development

# Database
DB_NAME=u916218583_Yosasa
DB_USER=u916218583_yogsamskara123
DB_PASSWORD=your_password_here
DB_HOST=127.0.0.1

# Security
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=yogsamskara02@gmail.com
ADMIN_PASSWORD=your_admin_password

# Firebase Server
# Uses GOOGLE_APPLICATION_CREDENTIALS pointing to serviceAccountKey.json
# OR FIREBASE_SERVICE_ACCOUNT containing stringified JSON

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Hostinger SMTP
WELCOME_EMAIL=bhumika.hardiya@yogsamskara.com
NOREPLY_EMAIL=noreply@yogsamskara.com
NOTIFICATION_EMAIL=notifications@yogsamskara.com
EMAIL_PASS=your_smtp_password
```

## 7. Common Maintenance Commands
*   To update the production server, SSH into Hostinger and run:
    ```bash
    git fetch origin
    git reset --hard origin/main
    ```
    Then use the Hostinger UI to **Restart** the Node.js Application.
