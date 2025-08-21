
# Recipe Data Collection and API Project

## Project Overview

This project parses recipe data from a JSON file, stores it in a MySQL database, exposes it via a RESTful API (Node.js + Express), and provides a React frontend to display and filter recipes.

---

## Folder Structure

```
recipe-backend/
 ┣ db
 ┃ ┗ schema_mysql.sql 
 ┣ db.js                          
 ┣ routes.js  
 ┣ server.js
 ┣ .env.example              
 ┣ package.json
 ┗ server.js    

recipe-frontend/
 ┣ public/
 ┣ src/
 ┃ ┣ App.jsx
 ┃ ┣ RecipeList.jsx
 ┃ ┗ main.jsx
 ┣ index.html
 ┣ package.json
 ┗ README.md
```

---

## Backend Setup

1. Open VS Code in the `recipe-backend` folder.
2. Install dependencies:

```bash
npm install express mysql2 dotenv cors body-parser
npm install --save-dev nodemon
```

3. Configure `.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=recipe_db
PORT=3000
```

4. Start MySQL and ensure the database `recipe_db` exists.
5. Run the server:

```bash
npx nodemon server.js
```

You should see:

```
Connected to MySQL database
Server running at http://localhost:3000
```

---

## Frontend Setup

1. Navigate to the `recipe-frontend` folder.
2. Install dependencies:

```bash
npm install axios react-rating-stars-component @material-ui/core
```

3. Start the frontend:

```bash
npm start
```

Your app will run at `http://localhost:3000`.

---

## API Endpoints

### 1. Import Recipes from JSON

```
POST /recipes/import
```

- Imports all recipes from `US_recipes.json` into MySQL.
- Response:

```json
{ "message": "Recipes imported successfully" }
```

### 2. Get All Recipes

```
GET /recipes?page=1&limit=10
```

- Response:

```json
{
  "page": 1,
  "limit": 10,
  "total": 50,
  "data": [
    { "title": "Sample Recipe", "cuisine": "Global", ... }
  ]
}
```

### 3. Search Recipes

```
GET /recipes/search?title=pie&rating=>=4.5&cuisine=Italian
```

- Response:

```json
{
  "data": [
    { "title": "Italian Pie", "cuisine": "Italian", ... }
  ]
}
```

---

## Frontend Features

- Display recipes in a table (Title, Cuisine, Rating, Total Time, Serves)
- Click row to view details in a drawer
- Filtering by title, rating, cuisine, etc.
- Pagination (15–50 results per page)
- Fallback messages for no results

---

## Notes

- Ensure MySQL is running before starting the backend.
- Use Postman to test API endpoints.
- Handle `NaN` values in JSON as `null` during import.
- Backend: Node.js + Express + MySQL2
- Frontend: React + Tailwind CSS + Material UI
