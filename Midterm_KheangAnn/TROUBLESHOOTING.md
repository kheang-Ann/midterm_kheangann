# 🔧 Troubleshooting Guide

## ✅ Changes Made to Fix Issues

### 1. Backend Port Changed
**File:** `inventory-management-api/src/main.ts`
- Changed from port 3000 to port 3001
- Backend now runs on: http://localhost:3001

### 2. CORS Enabled
**File:** `inventory-management-api/src/main.ts`
- Added CORS configuration to allow frontend (port 3000) to access backend (port 3001)
- This fixes the ECONNREFUSED errors

### 3. Route Order Fixed
**File:** `inventory-management-api/src/inventory/inventory.controller.ts`
- Reordered routes so specific routes come before dynamic routes
- This ensures `/inventory/:id` works correctly

---

## 🔄 What You Need to Do Now

### Step 1: Restart Backend Server

The backend should auto-reload, but if tests are still failing:

**In your backend terminal:**
1. Press `Ctrl + C` to stop the server
2. Run again:
```bash
npm run start:dev
```

**Verify you see:**
```
Application is running on: http://localhost:3001  ← Must be 3001!
```

### Step 2: Keep Frontend Running

Your frontend should still be running on port 3000. If not:
```bash
cd inventory-management-frontend
npm run dev
```

### Step 3: Run Tests Again

```bash
cd inventory-management-frontend
npm test
```

---

## 🐛 Common Test Failures & Solutions

### Issue 1: "toHaveURL" timeout - stays on /register

**Cause:** Registration API call is failing

**Solutions:**
1. Check backend is running on port 3001
2. Check CORS is enabled (should be after restart)
3. Open browser console at http://localhost:3000 and check for errors
4. Try manual registration in browser first

**Debug:**
```bash
# Check if backend is responding
curl http://localhost:3001/auth/register -X POST -H "Content-Type: application/json" -d '{"username":"test","email":"test@test.com","password":"password123"}'
```

### Issue 2: ECONNREFUSED errors

**Cause:** Frontend can't reach backend

**Solutions:**
1. Ensure backend is running on port 3001
2. Ensure CORS is enabled
3. Restart both servers

### Issue 3: Tests timeout

**Cause:** Backend is slow or not responding

**Solutions:**
1. Check backend terminal for errors
2. Ensure database is connected
3. Increase timeout in tests (already set to 10000ms)

### Issue 4: "Item not found" errors

**Cause:** Route order in backend

**Solutions:**
1. Already fixed - backend routes reordered
2. Restart backend to apply changes

---

## 🧪 Manual Testing Before Running Automated Tests

### Test 1: Backend Health Check
```bash
curl http://localhost:3001
```
**Expected:** Some response (not connection refused)

### Test 2: Register User
Open browser: http://localhost:3000
1. Click "Register here"
2. Fill form:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Confirm: password123
3. Click Register
4. **Should redirect to /login**

### Test 3: Login
1. Email: test@example.com
2. Password: password123
3. Click Login
4. **Should redirect to /dashboard**

### Test 4: Create Item
1. Click "Add New Item"
2. Fill form
3. Click Create
4. **Should redirect to /inventory**

**If all 4 manual tests pass, automated tests should pass too!**

---

## 📊 Expected Test Results

After fixes, you should see:

```
Running 37 tests using 3 workers

✓ tests/auth.spec.js (10 passed)
✓ tests/inventory-crud.spec.js (10 passed)
✓ tests/dashboard.spec.js (5 passed)
✓ tests/error-handling.spec.js (8 passed)
✓ tests/navigation.spec.js (4 passed)

37 passed (45s)
```

---

## 🔍 Debugging Tips

### View Backend Logs
Watch your backend terminal for errors when tests run

### View Frontend Logs
Watch your frontend terminal for proxy errors

### View Browser Console
Open http://localhost:3000 in browser
- Press F12
- Go to Console tab
- Look for errors

### Run Single Test
```bash
npx playwright test tests/auth.spec.js --headed
```
This runs one test file with visible browser

### Run Test in Debug Mode
```bash
npx playwright test --debug
```
This opens Playwright Inspector

---

## ✅ Verification Checklist

Before running tests, verify:

- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] No ECONNREFUSED errors in frontend terminal
- [ ] Can access http://localhost:3000 in browser
- [ ] Can access http://localhost:3001/api/docs in browser
- [ ] Manual registration works
- [ ] Manual login works

---

## 🚀 Quick Fix Commands

```bash
# Kill processes on ports
netstat -ano | findstr :3000
taskkill /PID <PID> /F

netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Restart backend
cd inventory-management-api
npm run start:dev

# Restart frontend
cd inventory-management-frontend
npm run dev

# Run tests
cd inventory-management-frontend
npm test
```

---

## 📞 Still Having Issues?

1. Check both terminal outputs for errors
2. Try manual testing in browser first
3. Run tests with `--headed` flag to see what's happening
4. Check browser console for JavaScript errors
5. Verify backend API with Swagger: http://localhost:3001/api/docs

---

**After restarting backend with CORS enabled, tests should pass!** ✅
