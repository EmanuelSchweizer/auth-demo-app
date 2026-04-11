# shopping_list_app

### Quick Overview
- The main focus of this project is a complete login system.
- Users can register and then sign in.
- Sign-in works either with email and password or with Google.
- OAuth and JWT are used for authentication and session handling.
- Admins have access to an admin panel where they can manage and delete users.
- A demo admin user can access the admin panel in read-only mode (cannot delete users).
- Backend tests are implemented for authentication routes and auth-related utilities.

## Live Demo

🔗 [https://auth-demo-app-frontend.vercel.app](https://auth-demo-app-frontend.vercel.app)

### Demo-Zugangsdaten
| | Email | Passwort |
|---|---|---|
| **Demo Admin** | admin-demo@example.com | demoadmin123 |

### Screenshots
<img src="./screenshots/ShoppingList.png" alt="Startseite" width="500" style="vertical-align: top;" />
<img src="./screenshots/MobileView.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />
<img src="./screenshots/SignInPage.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />
<img src="./screenshots/SignUpPage.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />
<img src="./screenshots/AdminPanel.png" alt="Neues Item Modal" width="500" style="vertical-align: top;" />


### Tech stack
## frontend
- **Framework:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **UI library:** HeroUI

## backend
- **server:** Node.js, Express, TypeScript
- **database:** MongoDB, Mongoose

### Setup
Follow these steps to run the application locally.

### 1. Clone & Install
- git clone [https://github.com/EmanuelSchweizer/shopping_list_app.git](https://github.com/EmanuelSchweizer/shopping_list_app.git)
- cd shopping_list_app

### 2. Install dependencies
- cd backend
- npm install
- cd ../frontend
- npm install

### 3. Configure backend
- Create a backend/.env file based on backend/.env.example
- Set MONGO_URI to your MongoDB Atlas connection string
- Set PORT e.g. 5001
- Optional admin bootstrap variables:
   - ADMIN_NAME e.g. Admin
   - ADMIN_EMAIL e.g. admin@example.com
   - ADMIN_PASSWORD e.g. admin123
   - DEMO_ADMIN_NAME e.g. Admin Demo
   - DEMO_ADMIN_EMAIL e.g. admin-demo@example.com
   - DEMO_ADMIN_PASSWORD e.g. demoadmin123

### 4. Configure frontend
- Create a frontend/.env file based on frontend/.env.example
- Set API_URL to your backend URL e.g. http://localhost:5001
- Set NEXT_PUBLIC_DEMO_ADMIN_EMAIL to the same value as DEMO_ADMIN_EMAIL

### 5. Start MongoDB
- Make sure your Atlas cluster is running and your IP is allowed in Atlas Network Access.

### 6. Run the app
Backend:
- cd backend
- npm run dev

Frontend:
- cd frontend
- npm run dev

### Database initialization
When the backend starts, initial data is created automatically.

- If the collection is empty, three default items are created: Milch, Brot, Eier.
- Initial roles (admin, user) are ensured.
- Admin and demo admin users are ensured (created if missing).
- If data already exists, nothing is overwritten or inserted twice.

### Demo admin user
- The demo admin can sign in and access the admin panel.
- The demo admin is read-only and cannot delete users.
- Default demo admin credentials:
   - Email: admin-demo@example.com
   - Password: demoadmin123

### Backend endpoints
- GET /items

- POST /items
   Body: { "name": string }

- PUT /items/:id updates the bought status of an item.
   Body: { "bought": boolean }
   
- DELETE /items/:id deletes an item.

