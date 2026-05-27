# Quick GitHub Setup Guide

Follow these steps to activate GitHub Actions and send test results to `srengty@gmail.com`.

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `inventory-management-api` (or any name you want)
3. **Keep it Public** (or Private if you have a paid account)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

---

## Step 2: Push Your Code

Open PowerShell in the project folder and run:

```powershell
cd "e:\Code for Year3 S2\AutomateTesting\Midterm_KheangAnn\inventory-management-api"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "feat: inventory management API with comprehensive tests and CI/CD"

# Connect to your GitHub repo (REPLACE with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/inventory-management-api.git

# Push to main branch
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

---

## Step 3: Set Up Email Secrets

### 3.1 Generate Gmail App Password

1. Go to https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click **2-Step Verification** → Turn it ON if not already
4. Go back, click **App passwords** (or go to https://myaccount.google.com/apppasswords)
5. Select:
   - **App:** Mail
   - **Device:** Other (Custom name) → Type "GitHub Actions"
6. Click **Generate**
7. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### 3.2 Add Secrets to GitHub

1. Go to your repo on GitHub
2. Click **Settings** (top menu)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

**Add Secret #1:**
- Name: `MAIL_USERNAME`
- Value: Your Gmail address (e.g., `yourname@gmail.com`)
- Click **Add secret**

**Add Secret #2:**
- Name: `MAIL_PASSWORD`
- Value: The 16-character app password you just generated
- Click **Add secret**

---

## Step 4: Trigger the Workflow

The workflow triggers automatically on push to `main`. To test it:

```powershell
# Make a small change
echo "" >> README.md

# Commit and push
git add README.md
git commit -m "test: trigger CI pipeline"
git push
```

---

## Step 5: Verify It Works

### Check GitHub Actions

1. Go to your repo on GitHub
2. Click **Actions** tab (top menu)
3. You should see a workflow run in progress
4. Click on it to see live logs
5. Wait for all steps to complete (usually 2-3 minutes)

### Check Email

1. Check your email inbox
2. Check `srengty@gmail.com` inbox
3. You should receive an email with subject:
   ```
   ✅ [PASS] Inventory API Tests - your-repo @ abc123
   ```

If tests fail, you'll get:
```
❌ [FAIL] Inventory API Tests - your-repo @ abc123
```

---

## 🎯 What the Workflow Does

Every time you push to `main`:

1. ✅ Checks out your code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies (`npm ci`)
4. ✅ Runs unit tests (75 tests)
5. ✅ Runs E2E tests (54 tests)
6. ✅ Generates coverage report
7. ✅ Gets committer email from git
8. ✅ Sends email to committer + `srengty@gmail.com`

---

## 🔍 Troubleshooting

### "Permission denied" when pushing

```powershell
# Use HTTPS with personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/inventory-management-api.git
```

Generate token at: https://github.com/settings/tokens

### Workflow not running

**Check:**
- You pushed to `main` branch (not `master`)
- `.github/workflows/ci.yml` file exists
- Actions are enabled: Settings → Actions → General → Allow all actions

### Email not sending

**Check:**
- Both secrets (`MAIL_USERNAME` and `MAIL_PASSWORD`) are set
- No typos in secret names (case-sensitive!)
- App password is correct (16 characters, no spaces)
- 2-Step Verification is enabled on Gmail
- Check spam/junk folder

### Tests failing in CI but passing locally

**Check workflow logs:**
1. Go to Actions tab
2. Click the failed run
3. Click "Run Automated Test Suites"
4. Expand the failing step to see error details

Common issues:
- Missing environment variables
- Database not initialized
- Dependency version mismatch

---

## 📧 Expected Email Content

**On Success:**

```
Subject: ✅ [PASS] Inventory API Tests - username/inventory-management-api @ abc123def

✅ All tests PASSED successfully!

Repository : username/inventory-management-api
Branch     : main
Commit     : abc123def456789
Committer  : your-username
Triggered  : push
Run URL    : https://github.com/username/inventory-management-api/actions/runs/123456

Test suites completed:
- Unit tests (AuthService, InventoryService, SuppliersService)
- E2E tests (Auth, Inventory CRUD, Suppliers CRUD)
```

**On Failure:**

```
Subject: ❌ [FAIL] Inventory API Tests - username/inventory-management-api @ abc123def

❌ Tests FAILED — please investigate.

Repository : username/inventory-management-api
Branch     : main
Commit     : abc123def456789
Committer  : your-username
Triggered  : push
Run URL    : https://github.com/username/inventory-management-api/actions/runs/123456

Please check the run URL above for detailed logs and fix the failing tests.
```

---

## ✅ Success Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] `MAIL_USERNAME` secret added
- [ ] `MAIL_PASSWORD` secret added
- [ ] Workflow run completed successfully
- [ ] Email received at your address
- [ ] Email received at `srengty@gmail.com`

---

## 🎓 For Your Exam Submission

Make sure to include:

1. **GitHub repository URL** (e.g., `https://github.com/username/inventory-management-api`)
2. **Screenshot of successful Actions run** (from Actions tab)
3. **Screenshot of email received** (showing it was sent to `srengty@gmail.com`)
4. **Coverage report** (from `npm run test:cov`)

This proves:
- ✅ Logic works (40%) — API endpoints functional
- ✅ Tests work (40%) — 129 tests passing, 98% coverage
- ✅ GitHub Actions works (20%) — CI runs and emails sent

---

## Need Help?

If you encounter issues:

1. Check the **TESTING_GUIDE.md** for detailed testing instructions
2. Check GitHub Actions logs for error details
3. Verify all secrets are set correctly
4. Make sure 2-Step Verification is enabled on Gmail
5. Try sending a test email manually first (see TESTING_GUIDE.md)
