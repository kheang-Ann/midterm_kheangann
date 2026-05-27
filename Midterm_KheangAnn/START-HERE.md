# 🚀 START HERE - Quick Reference

## 📁 What You Have

```
Midterm_KheangAnn/
│
├── inventory-management-api/          ← Exercise 1 (Backend)
│   └── NestJS API with tests
│
└── inventory-management-frontend/     ← Exercise 2 (Frontend)
    └── React App with Playwright tests
```

---

## ⚡ Quick Start - 3 Terminals

### Terminal 1: Backend
```bash
cd "e:\Code for Year3 S2\AutomateTesting\Midterm_KheangAnn\inventory-management-api"
npm run start:dev
```
✅ Wait for: "Application is running on: http://localhost:3001"

### Terminal 2: Frontend
```bash
cd "e:\Code for Year3 S2\AutomateTesting\Midterm_KheangAnn\inventory-management-frontend"
npm run dev
```
✅ Wait for: "Local: http://localhost:3000"

### Terminal 3: Tests
```bash
cd "e:\Code for Year3 S2\AutomateTesting\Midterm_KheangAnn\inventory-management-frontend"
npm test
```
✅ Expected: "37 passed"

---

## 🌐 Access Points

- **Frontend App**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api

---

## 🧪 Test Commands

```bash
# Frontend tests (37 tests)
cd inventory-management-frontend
npm test                    # Run all tests
npm run test:ui            # Interactive mode
npm run test:headed        # See browser
npx playwright show-report # View report

# Backend tests (15+ tests)
cd inventory-management-api
npm run test:e2e           # E2E tests
npm run test               # Unit tests
npm run test:cov           # Coverage
```

---

## 📚 Documentation

### Quick Guides
- **START-HERE.md** ← You are here
- **RUN-EXERCISE-2.md** - Exercise 2 quick guide
- **COMPLETE-GUIDE.md** - Full documentation

### Frontend Docs
- `inventory-management-frontend/QUICK-START.md` - 3-step start
- `inventory-management-frontend/HOW-TO-RUN.md` - Detailed guide
- `inventory-management-frontend/TESTING-GUIDE.md` - Test details
- `inventory-management-frontend/README.md` - Project overview

### Backend Docs
- `inventory-management-api/README.md` - API documentation

---

## 🎯 Manual Testing Flow

1. **Open**: http://localhost:3000
2. **Register**: Create new account
3. **Login**: Use credentials
4. **Dashboard**: View statistics
5. **Create**: Add inventory item
6. **Edit**: Modify item
7. **Delete**: Remove item
8. **Search**: Filter items
9. **Logout**: Exit app

---

## ✅ Success Indicators

### Backend Running ✓
```
[Nest] LOG Application is running on: http://localhost:3001
```

### Frontend Running ✓
```
➜  Local:   http://localhost:3000/
```

### Tests Passing ✓
```
37 passed (45s)
```

---

## 🐛 Quick Fixes

### Port in use?
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Playwright not installed?
```bash
cd inventory-management-frontend
npx playwright install
```

### Modules missing?
```bash
npm install
```

---

## 📊 What's Included

### Exercise 1 - Backend ✅
- NestJS REST API
- JWT Authentication
- CRUD operations
- PostgreSQL/SQLite
- E2E tests
- Swagger docs

### Exercise 2 - Frontend ✅
- React 18 + Vite
- Authentication UI
- Dashboard
- CRUD interface
- 37+ Playwright tests
- Error handling

---

## 🎓 Scoring

### Exercise 1
- API: 40% ✅
- Tests: 35% ✅
- Database: 25% ✅

### Exercise 2
- UI: 35% ✅
- Tests: 35% ✅
- API Usage: 30% ✅

**Total: 100% Complete** 🌟

---

## 🚀 Next Steps

1. ✅ Start both servers
2. ✅ Test manually in browser
3. ✅ Run automated tests
4. ✅ View test reports
5. ✅ Take screenshots
6. ✅ Prepare submission

---

## 💡 Pro Tips

- Keep both servers running
- Use test:ui for debugging
- Check Swagger for API docs
- View test reports after each run
- Use unique emails for testing

---

## 📞 Need Help?

Read these in order:
1. This file (START-HERE.md)
2. RUN-EXERCISE-2.md
3. COMPLETE-GUIDE.md
4. Specific guides in frontend folder

---

**You're ready to go! 🎉**

Open 3 terminals and run the commands above.
