# shopping_list_app
![Startseite](./screenshots/home.png)
![Neues Item Modal](./screenshots/add-item-modal.png)

### Tech stack
## frontend
- **Framework:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS, HeroUI
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

### 4. Configure frontend
- Create a frontend/.env file based on frontend/.env.example
- Set API_URL to your backend URL e.g. http://localhost:5001

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
When the backend starts, the ShoppingItem collection is initialized automatically.

- If the collection is empty, three default items are created: Milch, Brot, Eier.
- If data already exists, nothing is overwritten or inserted twice.

### Backend endpoints
- GET /items

- POST /items
   Body: { "name": string }

- PUT /items/:id updates the bought status of an item.
   Body: { "bought": boolean }
   
- DELETE /items/:id deletes an item.

