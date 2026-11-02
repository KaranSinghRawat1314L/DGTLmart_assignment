# Task Management System

A simple task manager with a React frontend, an Express API, and MongoDB storage. Create, view, update, complete, and delete tasks.

## Requirements

- Node.js 20.6 or newer
- npm
- A MongoDB database, either local or MongoDB Atlas

Check your installed versions:

```bash
node --version
npm --version
```

## Setup

### 1. Configure the backend

Open a terminal in the `backend` directory and install its dependencies:

```bash
cd backend
npm install
```

Create `backend/.env` with your own MongoDB connection string:

```env
MongoDB_URI=mongodb+srv://<username>:<encoded-password>@<cluster-host>/<database-name>?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

For a local MongoDB instance, the URI can look like:

```env
MongoDB_URI=mongodb://127.0.0.1:27017/task_manager
```

Replace the example values with your actual database credentials and database name. If your password contains special characters, URL-encode them before adding the password to the URI. Keep `.env` private; do not commit it or share it.

Start the backend:

```bash
npm start
```

The API will be available at `http://localhost:5000`. Visiting that address should return a message confirming the API is running. The server connects to MongoDB before it starts listening.

### 2. Configure and start the frontend

Open a **second terminal** in the `frontend` directory and install its dependencies:

```bash
cd frontend
npm install
```

The frontend uses `http://localhost:5000/api` by default. To use a different backend URL, create `frontend/.env` and set:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Available API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/add` | Create a task |
| `GET` | `/api/view` | List tasks |
| `GET` | `/api/view/:id` | Get a task by ID |
| `PUT` | `/api/edit/:id` | Update a task |
| `DELETE` | `/api/delete/:id` | Delete a task |

Task data uses `name`, `description`, and `completed` fields. For example:

```json
{
  "name": "Prepare project notes",
  "description": "Write down the tasks for this week",
  "completed": false
}
```

## Frontend checks

From the `frontend` directory:

```bash
npm run lint
npm run build
```

## Troubleshooting

- **MongoDB connection error:** Check that `backend/.env` contains one valid `MongoDB_URI` entry, the database username and password are correct, and the database host is reachable. For Atlas, confirm your current IP is allowed in the cluster's network access settings.
- **Environment variable missing:** Start the backend with `npm start` from the `backend` directory so it loads `backend/.env`.
- **Frontend cannot reach the API:** Make sure the backend is running and `VITE_API_URL` points to the API base URL. The `CORS_ORIGIN` value in `backend/.env` should match the frontend's origin.
- **Port already in use:** Change `PORT` in `backend/.env` and update `VITE_API_URL` in `frontend/.env` to use the same backend port.
