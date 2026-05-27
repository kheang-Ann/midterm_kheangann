# ⚡ Quick Start Guide - 3 Simple Steps

## 🚀 Step 1: Install Playwright (One-time setup)

```bash
cd inventory-management-frontend
npx playwright install
```

⏱️ Takes 2-3 minutes

---

## 🎬 Step 2: Start Both Servers

### Terminal 1 - Backend API:
```bash
cd inventory-management-api
npm run start:dev
```
✅ Wait for: "Application is running on: http://localhost:3001"

### Terminal 2 - Frontend App:
```bash
cd inventory-management-frontend
npm run dev
```
✅ Wait for: "Local: http://localhost:3000"

---

## 🧪 Step 3: Run Tests

### Terminal 3 - Run Tests:
```bash
cd inventory-management-frontend
npm test
```

✅ Expected: "37 passed"

---

## 🌐 Manual Testing

Open browser: **http://localhost:3000**

1. **Register**: Create account → Redirects to login
2. **Login**: Enter credentials → See dashboard
3. **Create Item**: Add new inventory item
4. **Edit Item**: Modify existing item
5. **Delete Item**: Remove item (with confirmation)
6. **Search**: Filter items by name/SKU
7. **Logout**: Return to login page

---

## 📊 View Test Results

```bash
npx playwright show-report
```

Opens interactive HTML report with:
- ✅ Test results
- 📸 Screenshots
- ⏱️ Execution timeline
- 🔍 Detailed logs

---

## 🎯 That's It!

You now have:
- ✅ Working frontend application
- ✅ 37+ automated tests
- ✅ Full API integration
- ✅ Complete CRUD functionality

---

## 💡 Pro Tips

**Run tests with UI (best for debugging):**
```bash
npm run test:ui
```

**Run tests with visible browser:**
```bash
npm run test:headed
```

**Run specific test file:**
```bash
npx playwright test tests/auth.spec.js
```

---

## ⚠️ Common Issues

**Port already in use?**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Backend not responding?**
- Check Terminal 1 is still running
- Visit http://localhost:3001/api to verify

**Tests failing?**
- Ensure both servers are running
- Run `npm install` in frontend folder

---

## 📞 Need Help?

Check the detailed guides:
- `HOW-TO-RUN.md` - Complete step-by-step guide
- `SETUP.md` - Detailed setup instructions
- `README.md` - Project documentation

---

## ✨ Project Features

### UI Components
- 🔐 Authentication (Login/Register)
- 📊 Dashboard with statistics
- 📦 Inventory management (CRUD)
- 🔍 Search functionality
- ❌ Error pages (404)
- 🎨 Modern, responsive design

### Test Coverage
- ✅ 37+ test cases
- ✅ Authentication flows
- ✅ CRUD operations
- ✅ Error handling
- ✅ Navigation
- ✅ Form validation

### API Integration
- 🔗 REST API connection
- 🔑 JWT authentication
- 📡 All CRUD endpoints
- ⚠️ Error handling
- 💾 Token storage

---

**Ready to impress! 🎉**
