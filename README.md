\# Visitor Pass Management System



A full-stack MERN application (MongoDB, Express.js, React.js, Node.js) for managing visitor

registration, approval, check-in/check-out, and reporting across three roles: Administrator,

Receptionist, and Employee.



Live Deployment:

\- Frontend: https://visitorpass-system.vercel.app/

\- Backend API: https://visitor-pass-backend-seven.vercel.app/api



\---



\## 1. Tech Stack



Layer      | Technology

\-----------|------------------------------------------------

Frontend   | React 18, Vite, React Router, Tailwind CSS, Axios

Backend    | Node.js, Express.js

Database   | MongoDB, Mongoose

Auth       | JWT (JSON Web Tokens), bcrypt password hashing



\---



\## 2. Project Structure



visitor-pass-system/

├── backend/

│   ├── config/db.js              # MongoDB connection

│   ├── models/                   # User, Employee, Visitor, VisitRequest, ActivityLog

│   ├── middleware/auth.js        # JWT verification + role-based access control

│   ├── controllers/              # Business logic per resource

│   ├── routes/                   # Express route definitions

│   ├── utils/activityLogger.js   # Central activity-history writer

│   ├── seed.js                   # Creates the first admin/receptionist/employee accounts

│   ├── server.js                 # App entry point

│   └── .env.example

└── frontend/

&#x20;   ├── src/

&#x20;   │   ├── api/axios.js          # Axios instance with JWT interceptor

&#x20;   │   ├── context/AuthContext.jsx

&#x20;   │   ├── components/           # Layout, ProtectedRoute, StatusBadge

&#x20;   │   └── pages/

&#x20;   │       ├── Login.jsx / Dashboard.jsx

&#x20;   │       ├── admin/            # Manage Employees, Manage Users, Reports, Activity History

&#x20;   │       ├── receptionist/     # Register, Check-In, Check-Out, Visitor History

&#x20;   │       └── employee/         # Visitor Requests (approve/reject/remarks)

&#x20;   └── .env.example



\---



\## 3. Prerequisites



\- Node.js v18+ and npm

\- A MongoDB Atlas cluster (used for both local development and the deployed backend above)



\---



\## 4. Setup Instructions (local development)



\### 4.1 Backend



cd backend

npm install

npm run seed     # creates the first admin/receptionist/employee accounts (see section 6)

npm run dev      # starts on http://localhost:5000



You need a .env file in backend/ before npm run seed or npm run dev will work — see section 5.



\### 4.2 Frontend



cd frontend

npm install

npm run dev      # starts on http://localhost:5173



You need a .env file in frontend/ too — see section 5.



Open http://localhost:5173 in your browser and log in with one of the seeded accounts (section 6).



\---



\## 5. Environment Configuration



\### 5.1 backend/.env (local) — and Vercel Project Settings → Environment Variables (deployed)



Variable         | Description                                              | Example / Value used in production

\-----------------|-----------------------------------------------------------|--------------------------------------------

PORT             | Port the API server listens on                          | 5000

MONGO\_URI        | MongoDB connection string, INCLUDING the database name  | mongodb+srv://<user>:<password>@atlas-cerise-cable.c9y1whv.mongodb.net/visitor\_pass\_system?retryWrites=true\&w=majority

JWT\_SECRET       | Secret used to sign JWTs — use a long random string, NOT your database password | a long random string, kept private

JWT\_EXPIRES\_IN   | Token expiry                                             | 8h

CLIENT\_URL       | Frontend origin, used for CORS                           | https://visitorpass-system.vercel.app



IMPORTANT: the database name (visitor\_pass\_system) must appear in the URI before the ? — Atlas's

copy-paste connection string does not include it by default. Without it, Mongoose connects to

the wrong (default) database and requests like login will fail with a 500 error even though the

connection itself "succeeds."



Also confirm in Atlas → Network Access that 0.0.0.0/0 (Allow Access From Anywhere) is added —

otherwise Vercel's servers will be blocked from reaching your cluster.



For the deployed backend, these variables must be entered directly into the Vercel project's

Settings → Environment Variables screen (a .env file in your repo is not read by Vercel). After

adding or changing any of them, redeploy the project for the change to take effect.



Creating the file locally on Windows: don't use right-click → New → Text Document (saves as

.env.txt). Instead, from a terminal inside the backend folder, run:

notepad .env

Click Yes to create it, paste your values, save. Verify with dir /a (should show .env, not

.env.txt) or type .env.



\### 5.2 frontend/.env (local) — and Vercel Project Settings → Environment Variables (deployed)



Variable       | Description                  | Example / Value used in production

\---------------|-------------------------------|--------------------------------------------------

VITE\_API\_URL   | Base URL of the backend API  | https://visitor-pass-backend-seven.vercel.app/api



Same rule applies: set this in the frontend Vercel project's Environment Variables, then redeploy.

Locally, create it the same way: notepad .env from inside the frontend folder.



\---



\## 6. Accounts — how login works



There is no public sign-up page. This is intentional: it's an internal tool, and only an

Administrator can create new logins, via Manage User Accounts. Your entry point is the seed

script.



Run npm run seed once (from backend/, locally, pointed at the same MONGO\_URI as production) after

your .env is set up and MongoDB is connected. It creates these three accounts if they don't

already exist:



Role            | Email                            | Password

\----------------|-----------------------------------|----------------

Administrator   | admin@visitorpass.com            | Admin@123

Receptionist    | reception@visitorpass.com        | Reception@123

Employee        | jane.doe.login@visitorpass.com   | Employee@123



Log in as the admin at https://visitorpass-system.vercel.app/, then create whatever real

accounts you need under Manage User Accounts.



"Employee" vs "Employee login" — two different things:

\- Manage Employees creates a directory entry (name, department, contact info) — the people

&#x20; visitors come to see. This does NOT grant login access.

\- Manage User Accounts creates an actual login. Choosing role "Employee" here requires picking

&#x20; one of the directory entries above to link the login to — that link is how the system knows

&#x20; which visitor requests belong to that person.



Known limitation: the current UI can update a user's name, role, password, and active/inactive

status, but not their email — email changes require creating a new account and deleting the old

one (or editing the document directly in MongoDB Atlas).



Don't lock yourself out: if you're replacing the only admin account, always create and verify

the new admin login works before deleting or deactivating the old one. If you do get locked out:

\- Re-run npm run seed — it only creates accounts that don't already exist, so if

&#x20; admin@visitorpass.com was deleted it will be recreated with the password above.

\- Or edit the account directly in Atlas (Browse Collections → visitor\_pass\_system → users →

&#x20; find the document → set isActive back to true).



Security note: rotate your Atlas database password and use a separate, unrelated JWT\_SECRET

if either has ever been pasted somewhere outside your own private notes.



\---



\## 7. Business Rules Implemented



\#  | Rule                                                                          | Enforced in

\---|--------------------------------------------------------------------------------|---------------------------------

1  | A visitor cannot have more than one active visit at the same time            | requestController.createRequest

2  | Duplicate visitor registration for the same visitor on the same date blocked | requestController.createRequest

3  | Visit date cannot be earlier than today                                      | requestController.createRequest

4  | For today's registrations, arrival time cannot be earlier than now           | requestController.createRequest

5  | An employee cannot have more than 3 pending requests                         | requestController.createRequest

6  | Visitors can only be checked in after approval                               | requestController.checkIn

7  | A checked-in visitor cannot be checked in again until checked out            | requestController.checkIn

8  | Check-out time must be later than check-in time                              | requestController.checkOut

9  | Rejected requests cannot be checked in                                       | requestController.checkIn

10 | Cancelled visits are excluded from active visitor lists                      | requestController.getRequests (activeOnly filter)



Every state transition (Created, Approved, Rejected, Checked In, Checked Out, Cancelled, Remark

Added) is written to the ActivityLog collection with the acting user and timestamp, viewable

under Activity History (Admin) or per-request via GET /api/requests/:id/activity.



\---



\## 8. API Documentation



Production Base URL: https://visitor-pass-backend-seven.vercel.app/api

Local Base URL: http://localhost:5000/api

All endpoints except POST /auth/login require an Authorization: Bearer <token> header.



\### Auth

Method | Endpoint      | Access                    | Description

\-------|----------------|----------------------------|------------------------------------

POST   | /auth/login   | Public                    | Log in, returns { token, user }

GET    | /auth/me      | Any authenticated user   | Returns current user profile



\### Users (Admin only — "Manage User Accounts")

Method  | Endpoint     | Description

\--------|---------------|--------------------------------------------------------

GET     | /users       | List all user accounts

POST    | /users       | Create a user (name, email, password, role, employeeId?)

PUT     | /users/:id   | Update name/role/status/password/linked employee

DELETE  | /users/:id   | Remove a user account



\### Employees (Admin manages; Admin + Receptionist can read — "Manage Employees")

Method  | Endpoint         | Access                | Description

\--------|-------------------|------------------------|-----------------------------------

GET     | /employees       | Admin, Receptionist   | List employees (supports ?search=)

GET     | /employees/:id   | Admin, Receptionist   | Get one employee

POST    | /employees       | Admin                  | Create employee

PUT     | /employees/:id   | Admin                  | Update employee / toggle active

DELETE  | /employees/:id   | Admin                  | Remove employee



\### Visit Requests

Method  | Endpoint                    | Access                | Description

\--------|------------------------------|------------------------|------------------------------------------------------------------------

GET     | /requests                   | Any (role-scoped)     | List/search/filter. Query params: visitorName, employeeName, visitDate, status, activeOnly, excludeCancelled. Employees automatically only see requests addressed to them.

GET     | /requests/:id               | Any (role-scoped)     | Get one request with full details

GET     | /requests/:id/activity      | Any (role-scoped)     | Activity log for one request

POST    | /requests                   | Receptionist           | Register a visitor / create a visit request

PUT     | /requests/:id/approve       | Employee               | Approve a pending request

PUT     | /requests/:id/reject        | Employee               | Reject a pending request ({ reason })

PUT     | /requests/:id/remark        | Employee               | Add a remark ({ text })

PUT     | /requests/:id/checkin       | Receptionist           | Check in an approved visitor

PUT     | /requests/:id/checkout      | Receptionist           | Check out a checked-in visitor

PUT     | /requests/:id/cancel        | Admin, Receptionist    | Cancel a request



\### Dashboard

Method  | Endpoint     | Description

\--------|---------------|-------------------------------------------------------------------------------------------

GET     | /dashboard   | Returns role-appropriate summary cards (pending requests, today's visitors, etc.)



\### Reports (Admin — "View Visitor Reports")

Method  | Endpoint            | Description

\--------|-----------------------|---------------------------------------------------------------------

GET     | /reports/visitors    | ?range=today|week|custom\&from=\&to= — returns summary counts + matching requests



\### Activity History (Admin — "View Activity History")

Method  | Endpoint    | Description

\--------|--------------|---------------------------------

GET     | /activity   | Global activity feed (?limit=200)



\---



\## 9. Role Summary (sidebar navigation)



\- Administrator — Dashboard, Manage Employees, Manage User Accounts, Visitor Reports, Activity

&#x20; History.

\- Receptionist — Dashboard, Register Visitor, Check In, Check Out, Visitor History (search/filter

&#x20; by visitor name, employee name, date, status; also used to cancel pending/approved requests).

\- Employee — Dashboard, Visitor Requests (a single page with a status filter — Pending / Approved

&#x20; / Rejected / All — where Approve, Reject, and Add Remark actions live inline per request).



\---



\## 10. Troubleshooting



Symptom                                        | Likely cause                                      | Fix

\------------------------------------------------|-----------------------------------------------------|----------------------------------------------------------------------------------------

'vite' is not recognized...                    | npm install was never run in frontend/            | cd frontend \&\& npm install

Cannot find module '...servr.js'               | Typo — the file is server.js                      | Use npm run dev instead of typing the filename directly

MongoDB connection error: uri ... "undefined"  | No .env file, or it's actually named .env.txt      | cd backend, run dir /a, confirm .env (not .env.txt) exists with MONGO\_URI set

{"message":"Route not found"} / 404 on login   | VITE\_API\_URL is missing /api, or points to the wrong domain | Set VITE\_API\_URL=https://visitor-pass-backend-seven.vercel.app/api in the frontend's Vercel env vars, then redeploy

500 error on /auth/login (deployed)             | MONGO\_URI missing the database name, or env vars not set in Vercel, or Atlas IP not whitelisted | Add /visitor\_pass\_system to MONGO\_URI; set env vars directly in Vercel Settings (not just a local .env); Atlas → Network Access → Allow Access From Anywhere

401 Unauthorized on login                       | Wrong email/password, or the account is deactivated | Re-check credentials exactly (case-sensitive); reactivate via another admin or Atlas

Locked out of all admin accounts                | Deleted/deactivated the only admin                | Re-run npm run seed, or flip isActive to true in Atlas

Need to change a login's email                  | Not supported in the current UI                   | Create a new account with the desired email, verify it logs in, then delete the old one



\---



\## 11. Deployment Notes (as actually deployed)



\- Backend deployed at: https://visitor-pass-backend-seven.vercel.app/

&#x20; Environment variables (PORT, MONGO\_URI, JWT\_SECRET, JWT\_EXPIRES\_IN, CLIENT\_URL) are set in

&#x20; Vercel Project Settings → Environment Variables, not in a committed .env file. MONGO\_URI must

&#x20; include /visitor\_pass\_system before the query string. CLIENT\_URL must exactly match the

&#x20; frontend's deployed origin (https://visitorpass-system.vercel.app) for CORS to work.



\- Frontend deployed at: https://visitorpass-system.vercel.app/

&#x20; Built with npm run build (Vite) and deployed via Vercel. VITE\_API\_URL is set in this project's

&#x20; own Vercel Environment Variables to https://visitor-pass-backend-seven.vercel.app/api.



\- After changing any environment variable on either Vercel project, a redeploy is required —

&#x20; Vercel does not hot-reload environment variable changes into a running deployment.

