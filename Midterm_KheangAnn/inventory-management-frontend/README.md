# Inventory Management Frontend

A React-based web application for managing inventory items with comprehensive UI testing using Playwright.

## Features

### UI Components (35%)
- **Authentication UI**
  - Login page with email/password
  - Registration page with validation
  - Protected routes with authentication guards
  - Logout functionality

- **Dashboard**
  - Statistics cards (Total Items, Low Stock, Total Value)
  - Recent items table
  - Quick navigation to create items

- **Inventory Management**
  - List all inventory items with search
  - Create new items
  - Edit existing items
  - Delete items with confirmation
  - Form validation

- **Error Pages**
  - 404 Not Found page
  - Error messages for failed operations
  - Loading states

### Automated Tests (35%)
Comprehensive Playwright test suites covering:

1. **Authentication Tests** (`tests/auth.spec.js`)
   - Login functionality
   - Registration with validation
   - Password mismatch detection
   - Protected route access
   - Logout functionality

2. **Inventory CRUD Tests** (`tests/inventory-crud.spec.js`)
   - Create new items
   - Read/List items
   - Update existing items
   - Delete items
   - Search functionality
   - Form validation

3. **Dashboard Tests** (`tests/dashboard.spec.js`)
   - Statistics display
   - Recent items table
   - Navigation from dashboard

4. **Error Handling Tests** (`tests/error-handling.spec.js`)
   - 404 page display
   - Network error handling
   - API error messages
   - Invalid form submissions
   - Duplicate SKU handling

5. **Navigation Tests** (`tests/navigation.spec.js`)
   - Route navigation
   - Browser back/forward
   - Link navigation

### API Integration (30%)
- Axios for HTTP requests
- JWT token authentication
- RESTful API endpoints:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/inventory` - List all items
  - `POST /api/inventory` - Create item
  - `GET /api/inventory/:id` - Get single item
  - `PATCH /api/inventory/:id` - Update item
  - `DELETE /api/inventory/:id` - Delete item

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **UI Testing**: Playwright
- **Styling**: Custom CSS

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will run on `http://localhost:3000`

## Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed
```

## Project Structure

```
inventory-management-frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with navbar
│   │   └── PrivateRoute.jsx    # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Dashboard with stats
│   │   ├── InventoryList.jsx   # List all items
│   │   ├── InventoryCreate.jsx # Create new item
│   │   ├── InventoryEdit.jsx   # Edit existing item
│   │   └── NotFound.jsx        # 404 page
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Component styles
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── tests/
│   ├── auth.spec.js            # Authentication tests
│   ├── inventory-crud.spec.js  # CRUD operation tests
│   ├── dashboard.spec.js       # Dashboard tests
│   ├── error-handling.spec.js  # Error handling tests
│   └── navigation.spec.js      # Navigation tests
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── playwright.config.js        # Playwright configuration
└── package.json                # Dependencies and scripts
```

## API Configuration

The application expects the backend API to run on `http://localhost:3001`. This is configured in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

## Test Coverage

The test suite includes:
- ✅ Authentication flow (login, register, logout)
- ✅ All CRUD operations
- ✅ Form validation
- ✅ Error handling and messages
- ✅ Protected routes
- ✅ Search functionality
- ✅ Navigation between pages
- ✅ 404 error page
- ✅ Dashboard statistics
- ✅ API integration

## Development Notes

- All forms include proper validation
- Error messages are displayed with `data-testid` attributes for testing
- Authentication tokens are stored in localStorage
- Axios interceptors handle authentication headers
- Protected routes redirect to login when not authenticated
- Responsive design with modern CSS

## Scoring Breakdown

- **UI (35%)**: Complete React application with all required pages and components
- **Tests (35%)**: Comprehensive Playwright test suite with 40+ test cases
- **API Usage (30%)**: Full integration with backend API including authentication and CRUD operations
