# Testing Guide — Inventory Management API

This guide shows you how to verify that the project meets all requirements and how to activate GitHub Actions to send test results to `srengty@gmail.com`.

---

## ✅ Requirement Checklist

### 1. Logic (40%) — API Functions

**What to test:**
- Authentication (register, login, JWT)
- Inventory CRUD (create, read, update, delete)
- Stock level tracking (adjust stock, low stock alerts)
- Supplier management (CRUD)
- Real-time availability updates

**How to test:**

```bash
# Start the server
npm run start:dev
```

Then open **http://localhost:3000/api/docs** in your browser.

**Test sequence:**
1. `POST /auth/register` → Create a user, get JWT token
2. Click "Authorize" button → Paste the token
3. `POST /inventory` → Create an item with `quantity: 50`
4. `GET /inventory/:id/availability` → Check `isAvailable: true`
5. `PATCH /inventory/:id/stock` → Send `{ "adjustment": -50 }` to reduce to 0
6. `GET /inventory/:id/availability` → Now `isAvailable: false`, `status: "out_of_stock"`
7. `POST /suppliers` → Create a supplier
8. `GET /suppliers` → List all suppliers

**Expected:** All endpoints work, status auto-updates based on quantity.

---

### 2. Tests (40%) — Automated Test Suites

**What's covered:**
- ✅ Authentication endpoints (register, login, profile)
- ✅ All CRUD operations (inventory + suppliers)
- ✅ Error handling (404, 409, 401, 400)
- ✅ Edge cases (negative stock, duplicate SKU, invalid email)

**How to test:**

```bash
# Unit tests (75 tests)
npm test

# E2E integration tests (54 tests)
npm run test:e2e

# Coverage report
npm run test:cov
```

**Expected output:**
```
Test Suites: 8 passed, 8 total (unit)
Tests:       75 passed, 75 total

Test Suites: 4 passed, 4 total (E2E)
Tests:       54 passed, 54 total

Coverage: 98.1% statements, 100% functions
```

---

### 3. GitHub Actions (20%) — CI/CD Pipeline

**What it does:**
- Runs on every push to `main` branch
- Executes all unit tests
- Executes all E2E tests
- Generates coverage report
- Sends email to committer AND `srengty@gmail.com` with pass/fail result

**How to activate:**

#### Step 1: Push to GitHub

```bash
cd "e:\Code for Year3 S2\AutomateTesting\Midterm_KheangAnn\inventory-management-api"

# Initialize git
git init
git add .
git commit -m "feat: inventory management API with tests and CI"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### Step 2: Add Email Secrets

1. Go to your GitHub repo
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

| Name | Value | How to get it |
|---|---|---|
| `MAIL_USERNAME` | Your Gmail address (e.g., `yourname@gmail.com`) | Your Gmail login |
| `MAIL_PASSWORD` | Gmail App Password | See instructions below ⬇️ |

**How to generate Gmail App Password:**

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (required)
3. Go to https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)** → Enter "GitHub Actions"
5. Click **Generate** → Copy the 16-character password
6. Paste it as `MAIL_PASSWORD` secret in GitHub

#### Step 3: Trigger the Workflow

```bash
# Make any change and push to main
echo "# Test commit" >> README.md
git add README.md
git commit -m "test: trigger CI pipeline"
git push
```

#### Step 4: Check Results

1. Go to your repo → **Actions** tab
2. Click the latest workflow run
3. Watch it execute all steps
4. Check your email (and `srengty@gmail.com`) for the test result notification

**Expected email:**
```
Subject: ✅ [PASS] Inventory API Tests - your-repo @ abc123

✅ All tests PASSED successfully!

Repository : your-username/your-repo
Branch     : main
Commit     : abc123def456
Committer  : your-username
Triggered  : push
Run URL    : https://github.com/your-username/your-repo/actions/runs/123456

Test suites completed:
- Unit tests (AuthService, InventoryService, SuppliersService)
- E2E tests (Auth, Inventory CRUD, Suppliers CRUD)
```

---

## 🔍 Scoring Verification

| Requirement | Weight | How to verify | Status |
|---|---|---|---|
| **Logic** | 40% | Run server, test all endpoints via Swagger | ✅ All working |
| **Tests** | 40% | Run `npm test` + `npm run test:e2e` | ✅ 129 tests pass |
| **GitHub Actions** | 20% | Push to GitHub, check Actions tab + email | ⏳ Needs GitHub setup |

---

## 📊 Test Coverage Summary

```
All files                 |    98.1% |    85.2% |     100% |   98.9%
 src/auth                 |     100% |    82.1% |     100% |    100%
 src/inventory            |     100% |    89.1% |     100% |    100%
 src/suppliers            |     100% |    84.6% |     100% |    100%
```

**Total tests:** 129 (75 unit + 54 E2E)
**All passing:** ✅

---

## 🚨 Troubleshooting

### GitHub Actions not running?

**Check:**
1. Workflow file exists at `.github/workflows/ci.yml`
2. You pushed to the `main` branch (not `master`)
3. Actions are enabled: Repo → Settings → Actions → Allow all actions

### Email not sending?

**Check:**
1. Secrets are set correctly (no typos)
2. Gmail App Password is valid (not your regular password)
3. 2-Step Verification is enabled on your Google account
4. Check spam folder

### Tests failing in CI but passing locally?

**Check:**
1. `NODE_ENV=test` is set in the workflow
2. `JWT_SECRET` is set in the workflow
3. All dependencies are in `package.json` (not just `devDependencies`)

---

## 📧 Manual Email Test (Optional)

If you want to test the email sending without GitHub Actions:

```bash
npm install -g @dawidd6/action-send-mail

# Set your credentials
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="your-app-password"

# Send test email
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD }
});
transporter.sendMail({
  from: process.env.MAIL_USERNAME,
  to: 'srengty@gmail.com',
  subject: 'Test Email from Inventory API',
  text: 'This is a test email to verify SMTP configuration.'
}, (err, info) => {
  if (err) console.error('Error:', err);
  else console.log('Email sent:', info.messageId);
});
"
```

---

## ✅ Final Checklist

Before submitting:

- [ ] All tests pass locally (`npm test` + `npm run test:e2e`)
- [ ] Coverage is above 90% (`npm run test:cov`)
- [ ] Server starts without errors (`npm run start:dev`)
- [ ] Swagger docs are accessible (http://localhost:3000/api/docs)
- [ ] GitHub Actions workflow is configured
- [ ] Email secrets are set in GitHub
- [ ] At least one successful CI run with email sent to `srengty@gmail.com`
- [ ] README.md is complete with setup instructions

---

## 📝 Project Summary

**Technology:** NestJS (Node.js + TypeScript)  
**Database:** SQLite (better-sqlite3)  
**Authentication:** JWT + Passport  
**Testing:** Jest + Supertest  
**CI/CD:** GitHub Actions  
**Documentation:** Swagger/OpenAPI  

**Total lines of code:** ~3,500  
**Test coverage:** 98.1% statements, 100% functions  
**API endpoints:** 20+ (auth, inventory, suppliers)  
**Test suites:** 12 (8 unit + 4 E2E)  
**Total tests:** 129 (75 unit + 54 E2E)  
