# Full-stack authentication demo with user management

## 🚀 Overview
Full-stack web application demonstrating OAuth2 authentication, user management, and role-based access.

## ✨ Key Features

- Google OAuth & Email/Password authentication
- JWT-based session handling
- User persistence with MongoDB
- Admin panel for user management (role-based access)
- Read-only demo admin account
- Backend API with authentication & authorization
- Deployed application (Vercel)

## 🛠 Tech Stack

## Frontend
- **Framework:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **UI library:** HeroUI

## Backend
- **server:** Node.js, Express, TypeScript
- **database:** MongoDB, Mongoose

## 🌐 Live Demo

👉 [https://auth-demo-app-frontend.vercel.app](https://auth-demo-app-frontend.vercel.app)

Demo Account:
- Email: admin-demo@example.com
- Password: demoadmin123

### Screenshots
<img src="./screenshots/ShoppingList.png" alt="Startseite" width="500" style="vertical-align: top;" />
<img src="./screenshots/MobileView.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />
<img src="./screenshots/SignInPage.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />
<img src="./screenshots/SignUpPage.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />
<img src="./screenshots/AdminPanel.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />


### Backend endpoints

All endpoints except `/health` require an `x-user-id` header with the authenticated user's MongoDB ObjectId.

#### Health
- `GET /health` — Returns server status. No authentication required.

#### Auth
- `POST /auth/signup` — Register a new user.  
  Body: `{ "name": string, "email": string, "password": string }`  
  Rate limit: 10 requests / hour.

- `POST /auth/login` — Log in with email and password.  
  Body: `{ "email": string, "password": string }`  
  Rate limit: 10 requests / 15 minutes.

- `POST /auth/resolve-user` — Resolve or create a user by email (used for Google OAuth).  
  Body: `{ "email": string, "name?": string }`

#### Shopping Items
- `GET /items` — Returns all items for the authenticated user.

- `POST /items` — Creates a new item.  
  Body: `{ "name": string }`

- `PUT /items/:id` — Updates the bought status of an item.  
  Body: `{ "bought": boolean }`

- `DELETE /items/:id` — Deletes an item.

#### Admin (admin role required)
- `GET /admin/users` — Returns all users.

- `DELETE /admin/users/:id` — Deletes a user and all their items. Not available to the demo admin.

