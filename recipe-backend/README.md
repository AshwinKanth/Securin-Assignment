# Recipe Backend

## Setup

1. Copy `.env.example` to `.env` and set DB credentials.
2. Create DB schema:
   `mysql -u root -p < db/schema_mysql.sql`
3. Install dependencies:
   `npm install`
4. Start server:
   `node server.js`
5. Import recipes (Postman or curl):
   POST http://localhost:5000/recipes/import
6. Get recipes:
   GET http://localhost:5000/recipes
