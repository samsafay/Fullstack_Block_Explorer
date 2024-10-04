# Ethereum Block List

## Overview

Ethereum Block List is a React-based web application that allows users to view, sort, and manage Ethereum blockchain blocks. This project provides an intuitive interface for exploring Ethereum blocks, with features like sorting, pagination, and block deletion.

## Features

- Display Ethereum blocks in a responsive grid layout
- Sort blocks by various attributes (Block Number, Size, Gas Limit, Timestamp)
- Paginate through the block list
- Toggle between different data representations (e.g., decimal/hexadecimal)
- Delete individual blocks or all blocks at once
- Persistent state management using Zustand
- Responsive design using Tailwind CSS
- Accessible UI components from shadcn/ui

## Technologies Used

- React
- TypeScript
- Next.js
- Zustand (for state management)
- Tailwind CSS (for styling)
- shadcn/ui (for UI components)
- Zod (for data validation)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

- Use the sort buttons to order blocks by different attributes
- Click on block data to toggle between different representations
- Use the pagination controls to navigate through the block list
- Click the "Delete" button on a block card to remove an individual block
- Use the "Delete All Blocks" button to remove all blocks (with confirmation)
