# LeaveDesk — Frontend

A React SPA for the Leave & Expense Management backend.

## Tech Stack

- **React 18** — UI library
- **React Router v6** — client-side routing
- **Vite** — dev server & build tool
- **CSS Modules** — scoped component styles

## Project Structure

```
src/
├── api/
│   └── client.js          # fetch wrapper with JWT headers
├── components/
│   ├── Layout.jsx          # sidebar + topbar shell
│   ├── Modal.jsx           # reusable modal dialog
│   ├── ProtectedRoute.jsx  # auth & role guard
│   ├── Sidebar.jsx         # navigation sidebar
│   ├── StatusBadge.jsx     # PENDING / APPROVED / REJECTED badge
│   └── Toast.jsx           # notification toast
├── context/
│   ├── AuthContext.jsx     # login / logout / JWT storage
│   └── ToastContext.jsx    # global toast notifications
├── pages/
│   ├── AuthPage.jsx        # login & register
│   ├── Dashboard.jsx       # stats overview
│   ├── LeaveRequests.jsx   # employee leave management
│   ├── ExpenseClaims.jsx   # employee expense management
│   ├── TeamRequests.jsx    # manager/admin approval panel
│   └── Users.jsx           # admin user list
├── App.jsx                 # routes
├── main.jsx                # entry point
└── index.css               # global resets & base styles
```

## Setup & Run

### 1. Make sure your Spring Boot backend is running on port 8080

```bash
# In your backend project:
./mvnw spring-boot:run
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

> The Vite dev server proxies all `/api/*` requests to `http://localhost:8080`,
> so you won't hit any CORS issues.

### 4. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder — deploy it to any static host (Netlify, Vercel, Nginx, etc.).

## Pages & Roles

| Route | Who can access |
|---|---|
| `/login` | Public |
| `/dashboard` | Everyone |
| `/leaves` | Everyone |
| `/expenses` | Everyone |
| `/team-leaves` | Manager, Admin |
| `/team-expenses` | Manager, Admin |
| `/users` | Admin only |

## Environment

By default the app talks to `http://localhost:8080` via the Vite proxy.
To point at a different backend URL, edit `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'http://your-backend-host:8080',
    changeOrigin: true,
  }
}
```
