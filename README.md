# Fullstack Block Explorer

A fullstack application that retrieves and displays Ethereum block data using the Infura API. This application includes a backend built with NestJS and SQLite and a frontend built with Nextjs.

## Features

- Retrieves Ethereum block data from the Infura API.
- Stores block data in an SQLite database.
- Exposes HTTP APIs to list and delete blocks.
- Supports pagination and sorting.
- Includes API documentation via Swagger.
- End-to-end testing.

## Getting Started

```bash
cd backend
npm install
nano .env
INFURA_PROJECT_ID=YOUR_KEY
PORT=3232

npm run start:dev

cd ../frontend
npm install
npm run dev

```

### FrontEnd

`http://localhost:3000`

### Backend

`http://localhost:3232`

### 4. Swagger API

`http://localhost:3232/api`
