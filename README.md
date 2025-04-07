# Vietnamese Glasses Store

A modern e-commerce platform for a Vietnamese eyewear store using Next.js 15 and Express.js.

## Project Structure

This project is organized into two main directories:

- **frontend**: Next.js 15 application with shadcn/ui components
- **backend**: Express.js API server with TypeScript and PostgreSQL

## Features

- Responsive product catalog with filtering and search
- Product detail pages with related products
- Shopping cart functionality
- User authentication
- Checkout process

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables in `backend/.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=glasses_shop
JWT_SECRET=yoursecretkey
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

**Backend:**
```bash
cd backend
# Development mode
npm run dev

# Or using the provided batch file
./start-server.bat
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:5000/api

## Development Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit them: `git commit -m "Description of changes"`
3. Push changes to the repository: `git push origin feature/feature-name`
4. Create a pull request for code review

## Deployment

### Backend
The backend can be deployed to any Node.js hosting service like Heroku, Render, or a VPS.

### Frontend
The Next.js frontend can be deployed to Vercel, Netlify, or any service supporting Next.js.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 