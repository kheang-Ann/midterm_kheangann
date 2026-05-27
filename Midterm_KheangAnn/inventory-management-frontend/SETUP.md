# Setup Guide - Inventory Management Frontend

## Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3001`
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd inventory-management-frontend
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers for testing.

### 3. Start the Backend API

Make sure your backend API is running on port 3001:

```bash
cd ../inventory-management-api
npm run start:dev
```

### 4. Start the Frontend Development Server

In a new terminal:

```bash
cd inventory-management-frontend
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Run Tests

#### Option 1: Run all tests in headless mode
```bash
npm test
```

#### Option 2: Run tests with UI mode (recommended for development)
```bash
npm run test:ui
```

#### Option 3: Run tests in headed mode (see the browser)
```bash
npm run test:headed
```

## Project Structure Overview

```
inventory-management-frontend/
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── context/           # React context (Auth)
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app
│   └── main.jsx           # Entry point
├── tests/                 # Playwright tests
│   ├── auth.spec.js
│   ├── inventory-crud.spec.js
│   ├── dashboard.spec.js
│   ├── error-handling.spec.js
│   └── navigation.spec.js
├── index.html             # HTML template
├── vite.config.js         # Vite config
└── playwright.config.js   # Test config
```

## Testing Strategy

### Test Suites

1. **Authentication Tests** (10 tests)
   - Login/Register flows
   - Validation
   - Protected routes

2. **Inventory CRUD Tests** (10 tests)
   - Create, Read, Update, Delete
   - Search functionality
   - Form validation

3. **Dashboard Tests** (5 tests)
   - Statistics display
   - Navigation
   - Recent items

4. **Error Handling Tests** (8 tests)
   - 404 pages
   - API errors
   - Form errors

5. **Navigation Tests** (4 tests)
   - Route navigation
   - Browser navigation

### Total: 37+ test cases

## API Endpoints Used

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/inventory` - List items
- `POST /api/inventory` - Create item
- `GET /api/inventory/:id` - Get item
- `PATCH /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify `vite.config.js`:
```javascript
server: {
  port: 3001, // Change to any available port
}
```

### Backend API Not Running
Ensure the backend is running on port 3001. Check `vite.config.js` proxy settings if using a different port.

### Playwright Tests Failing
1. Make sure both frontend and backend are running
2. Run `npx playwright install` to ensure browsers are installed
3. Check that the API is accessible at `http://localhost:3001`

### CORS Issues
The backend should have CORS enabled for `http://localhost:3000`

## Development Workflow

1. Start backend API
2. Start frontend dev server
3. Make changes to code
4. Run tests to verify
5. View test report in browser

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

To preview the production build:
```bash
npm run preview
```

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Installs dependencies
- Installs Playwright browsers
- Runs all tests
- Uploads test reports as artifacts

## Features Checklist

### UI (35%)
- ✅ Login page
- ✅ Registration page
- ✅ Dashboard with statistics
- ✅ Inventory list with search
- ✅ Create item form
- ✅ Edit item form
- ✅ Delete confirmation
- ✅ 404 error page
- ✅ Error messages
- ✅ Loading states
- ✅ Responsive navbar
- ✅ Protected routes

### Tests (35%)
- ✅ Authentication tests
- ✅ CRUD operation tests
- ✅ Form validation tests
- ✅ Error handling tests
- ✅ Navigation tests
- ✅ Dashboard tests
- ✅ Search functionality tests
- ✅ 37+ test cases

### API Usage (30%)
- ✅ JWT authentication
- ✅ Token storage
- ✅ API integration
- ✅ Error handling
- ✅ All CRUD endpoints
- ✅ Axios interceptors

## Next Steps

1. Customize the UI styling
2. Add more features (pagination, sorting, filtering)
3. Add unit tests with Jest/Vitest
4. Add E2E tests for complex workflows
5. Implement real-time updates with WebSockets
6. Add data export functionality
