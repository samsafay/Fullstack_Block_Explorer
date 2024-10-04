# Fullstack Block Explorer

A fullstack application that retrieves and displays Ethereum block data using the Infura API. This application includes a backend built with NestJS and SQLite and a frontend ready to handle pagination, sorting, and real-time updates.

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
```

### 1. Install dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory to store environment variables. You will need your Infura project ID for Ethereum block retrieval.

Add the following content to your `.env` file:

```
INFURA_PROJECT_ID=your-infura-project-id
```

### 3. Running the Application

You can now run the application in development mode:

```bash
npm run start:dev
```

The server will start on `http://localhost:3232`.

### 4. Swagger API Documentation

Swagger documentation for the API is available at:

`http://localhost:3232/api`

This allows you to interact with the API and test the different endpoints.

## Available Scripts

- `npm run start:dev`: Starts the NestJS application in development mode.
- `npm run test:e2e`: Runs end-to-end (E2E) tests with Jest and Supertest.

## Testing

### Running End-to-End (E2E) Tests

The project also includes end-to-end tests to verify that the API endpoints function correctly. To run the E2E tests, use the following command:

```bash
npm run test:e2e
```

This will run tests that simulate HTTP requests to the `/blocks` endpoints and ensure that they behave as expected.

## API Endpoints

(Note: API endpoints were not provided in the original text)

## Database

The project uses SQLite for simplicity. The database file (`block-explorer.sqlite`) will be automatically created in the project root. If you need to reset the database, simply delete the `.sqlite` file, and it will be recreated when the application is restarted.
