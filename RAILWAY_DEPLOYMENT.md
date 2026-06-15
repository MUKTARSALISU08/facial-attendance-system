# Railway Deployment Guide for SFRAS

## Prerequisites
- GitHub account with your repository pushed
- Railway.app account (free tier available)
- Railway CLI (optional, but recommended)

---

## Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project" or "Sign Up"
3. Sign up using GitHub (recommended) or email
4. Verify your email address

---

## Step 2: Create Railway Project

1. After logging in, click "New Project" button
2. Select "Deploy from GitHub repo"
3. Find and select your repository: `MUKTARSALISU08/facial-attendance-system`
4. Click "Add Project"

---

## Step 3: Create MySQL Database

1. In your Railway project, click "+ New Service"
2. Select "Database"
3. Choose "MySQL" from the database options
4. Click "Add MySQL"

Railway will automatically:
- Create a MySQL database
- Provide connection details
- Set up environment variables

---

## Step 4: Deploy Backend Service

1. Click "+ New Service" in your project
2. Select "Deploy from GitHub repo"
3. Select your repository again
4. Configure the service:

### Backend Configuration

**Root Directory:** `backend`

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

### Environment Variables

Add these environment variables (you can find database credentials in your MySQL service):

```env
DB_HOST=<your-mysql-host>
DB_USER=<your-mysql-user>
DB_PASSWORD=<your-mysql-password>
DB_NAME=<your-mysql-database-name>
DB_PORT=3306
PORT=3000
NODE_ENV=production
JWT_SECRET=<generate-a-secure-random-string>
FRONTEND_URL=<your-frontend-url>
```

**To find MySQL credentials:**
1. Click on your MySQL service
2. Go to "Variables" tab
3. Copy the values for:
   - `MYSQLHOST` → DB_HOST
   - `MYSQLUSER` → DB_USER
   - `MYSQLPASSWORD` → DB_PASSWORD
   - `MYSQLDATABASE` → DB_NAME

**Generate JWT Secret:**
```bash
# Use this command to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Click "Deploy"
6. Wait for deployment to complete (2-3 minutes)

---

## Step 5: Deploy Frontend Service

1. Click "+ New Service" in your project
2. Select "Static Site"
3. Configure the service:

### Frontend Configuration

**Root Directory:** `frontend`

**Build Command:**
```bash
echo "No build needed"
```

**Output Directory:** `.`

**Publish Directory:** `.`

**Environment Variables:**
```env
API_URL=<your-backend-url>
```

**To find Backend URL:**
1. Click on your backend service
2. Go to "Settings" tab
3. Copy the "Public URL" (e.g., `https://sfras-backend.up.railway.app`)

4. Click "Deploy"
5. Wait for deployment to complete (1-2 minutes)

---

## Step 6: Update Frontend API Configuration

Your frontend needs to use the production backend URL instead of localhost.

### Option A: Update in Railway Environment Variables

1. Go to your frontend service in Railway
2. Click "Variables" tab
3. Add `API_URL` with your backend URL

### Option B: Update Code (Recommended)

Update the API URL in your frontend files:

**In `frontend/js/api.js`:**
```javascript
const API_BASE_URL = 'https://your-backend-url.up.railway.app';
```

**In `frontend/js/main.js`:**
```javascript
const API_BASE_URL = 'https://your-backend-url.up.railway.app';
```

Commit and push these changes:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

---

## Step 7: Test Your Deployment

1. Open your frontend URL (e.g., `https://sfras-frontend.up.railway.app`)
2. Try registering a new account
3. Login with your credentials
4. Test adding a student
5. Test the facial recognition scan

---

## Step 8: Set Up Custom Domain (Optional)

### For Backend:

1. Go to backend service → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Configure DNS records as shown

### For Frontend:

1. Go to frontend service → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Configure DNS records as shown

---

## Step 9: Monitor Your Deployment

### Railway Dashboard Features:

- **Logs:** View real-time logs from your services
- **Metrics:** Monitor CPU, memory, and network usage
- **Deployments:** View deployment history
- **Settings:** Configure environment variables and domains

### Accessing Logs:

1. Click on a service
2. Go to "Logs" tab
3. View real-time logs

---

## Step 10: Configure Railway CLI (Optional)

For easier management, install Railway CLI:

```bash
npm install -g @railway/cli
```

Login:
```bash
railway login
```

Initialize project:
```bash
railway init
```

Deploy:
```bash
railway up
```

View logs:
```bash
railway logs
```

---

## Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Verify MySQL service is running
2. Check environment variables match MySQL credentials
3. Ensure backend service can access MySQL service

### Issue: Frontend Cannot Connect to Backend

**Solution:**
1. Verify CORS is enabled in backend
2. Check API_URL in frontend configuration
3. Ensure backend service is running

### Issue: Facial Recognition Not Working

**Solution:**
1. Ensure HTTPS is enabled (required for webcam access)
2. Check browser console for errors
3. Verify face-api.js models are accessible

### Issue: Deployment Fails

**Solution:**
1. Check build logs for errors
2. Verify package.json has correct scripts
3. Ensure all dependencies are listed in package.json

---

## Railway Pricing

### Free Tier (Current):
- $5 free credit/month
- 512MB RAM per service
- 500MB storage
- 100 hours of execution time

### Paid Plans (if needed):
- Hobby: $5/month
- Pro: $20/month
- Team: $50/month

---

## Security Best Practices

1. **Never commit .env files** to GitHub
2. **Use strong JWT secrets** (32+ characters)
3. **Enable HTTPS** (automatic on Railway)
4. **Rotate secrets regularly**
5. **Monitor logs for suspicious activity**
6. **Set up database backups**

---

## Next Steps

After successful deployment:

1. **Set up monitoring** - Use Railway's built-in metrics
2. **Configure backups** - Enable automatic database backups
3. **Set up alerts** - Get notified of errors
4. **Customize domain** - Add your own domain name
5. **Scale as needed** - Upgrade plans if traffic increases

---

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Report issues in your repository

---

**Last Updated:** 2026-06-15