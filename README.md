# Employees API

A mock REST API for employee data management with simulated real-world conditions like network delays, random errors, and rate limiting.

Built as a reliable alternative to dummy.restapiexample.com, this API provides a stable testing environment for frontend developers and students learning API integration, with the added value that you can run it locally or deploy it with one click.

## One-click deployment

You can deploy this API to Render with a single click:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/mehdiamrane/employees-api)

## Features

- CRUD operations for employee management
- Simulated network delays (0-1000ms) and errors (10% chance)
- Rate limiting (100 requests per 15 minutes)
- Data validation using Zod
- Swagger/OpenAPI documentation
- Automated database updates using cron jobs
- Health check endpoint
- TypeScript support

## Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/mehdiamrane/employees-api.git
cd employees-api
npm install
```

2. (Optional) Create a .env file in the root directory:

```
PORT=3000
NODE_ENV=development
DB_PATH=db.json
SIMULATED_DELAY_MIN=0
SIMULATED_DELAY_MAX=1000
SIMULATED_ERROR_PERCENTAGE=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CLIENT_URL=http://localhost:3000
```

- `SIMULATED_DELAY_MIN`: Minimum delay in milliseconds (default: 0)
- `SIMULATED_DELAY_MAX`: Maximum delay in milliseconds (default: 1000)
- `SIMULATED_ERROR_PERCENTAGE`: Percentage of requests that will return an error (default: 10)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window in milliseconds (default: 900000 - 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window (default: 100)
- `CLIENT_URL`: URL of the client (default: http://localhost:3000)

## Usage

### Development

Start the development server with hot reload:

```bash
npm run dev
```

### Production

Build and start the production server:

```bash
npm run build
npm run start
```

### Available Scripts

```bash
npm run dev - # Start development server with hot reload
npm run build - # Build for production
npm run start - # Start production server with NODE_ENV=production
npm run type-check - # Run TypeScript type checking
npm run clean - # Clean build directory
```

## API Endpoints

### Employee Management

- GET /api/v1/employees - Get all employees
- GET /api/v1/employee/:id - Get employee by ID
- POST /api/v1/create - Create new employee
- PUT /api/v1/update/:id - Update employee
- DELETE /api/v1/delete/:id - Delete employee

### System

- GET /api/v1/health - Health check
- GET /api/v1/trigger-update - Trigger database update
- GET /api-docs - API documentation

## Data Validation

Employee schema:

```typescript
{
  name: string, // 2-50 characters
  salary: number, // 0-1,000,000
  age: number, // 18-100
  profile_image?: string; // Valid URL (optional)
}
```

## Error Handling

Standard error response format:

```typescript
{
  status: "error",
  data: null,
  message: "Error description",
  errors: [
    {
      field: "fieldName",
      message: "Validation message"
    }
  ]
}
```

## Database Updates

- Production: Updates daily at midnight
- Development: Updates daily at midnight
- Manual updates via /api/v1/trigger-update endpoint

## Project Structure

```
src/
├── config/        # Configuration
├── controllers/   # Request handlers
├── middleware/    # Express middleware
├── routes/       # API routes
├── services/     # Business logic
├── types/        # TypeScript types
├── utils/        # Utilities
├── validation/   # Schema validation
└── index.ts      # Entry point
```

## License

MIT
