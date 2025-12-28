# 🚀 Railway Deployment Guide

## Prerequisites
✅ Railway account connected to GitHub
✅ MySQL database service added in Railway
✅ GitHub repository: `Krishnaait/shamshabad-fantasy-cricket`

---

## Step 1: Add Environment Variables

Go to your Railway project → Variables tab and add these:

### Required Variables
```env
# Database (Already set by Railway MySQL service)
DATABASE_URL=mysql://root:pLbUThNigQAhdGjxTWJFTRQufhvWdQwE@yamabiko.proxy.rlwy.net:13292/railway

# JWT Secret for authentication
JWT_SECRET=shamshabad-fantasy-cricket-secret-key-2025-secure-random-string

# Cricket API Configuration
CRICKET_API_KEY=1a822521-d7e0-46ff-98d3-3e51020863f3
CRICKET_API_URL=https://api.ecricdream.com/api/v1

# Node Environment
NODE_ENV=production

# Port (Railway auto-assigns this)
PORT=3000
```

### Optional Variables (for Manus features)
```env
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
OWNER_NAME=SHAMSHABAD Admin
```

---

## Step 2: Configure Railway Service

### Build Settings
- **Build Command:** `pnpm railway:deploy`
- **Start Command:** `pnpm start`
- **Root Directory:** `/`

### Deploy Settings
- **Auto Deploy:** Enabled (deploys on every GitHub push)
- **Branch:** `main`
- **Health Check:** Enabled on port 3000

---

## Step 3: Deploy Application

### Option A: Automatic Deployment (Recommended)
1. Push code to GitHub (already done ✅)
2. Railway automatically detects changes
3. Builds and deploys the application
4. Creates database tables automatically

### Option B: Manual Deployment
1. Go to Railway dashboard
2. Click "Deploy" button
3. Wait for build to complete
4. Check logs for any errors

---

## Step 4: Run Database Migrations

Railway will automatically run migrations during build, but you can also run manually:

### From Railway CLI:
```bash
railway run pnpm db:push
```

### From Railway Dashboard:
1. Go to your service
2. Click "Settings" → "Deployments"
3. Find latest deployment
4. Click "View Logs"
5. Verify migration logs show success

---

## Step 5: Verify Deployment

### Check Application Health
1. **Get your Railway URL** from the dashboard (e.g., `https://shamshabad-fantasy-cricket-production.up.railway.app`)
2. **Visit the URL** in your browser
3. **Test key features:**
   - Homepage loads correctly
   - Navigation works
   - Login page accessible
   - Register page accessible
   - Database connection working

### Check Database Tables
1. Go to Railway → MySQL service
2. Click "Data" tab
3. Verify these tables exist:
   - `users`
   - `user_profiles`
   - `contests`
   - `user_teams`
   - `team_players`
   - `matches`
   - `match_results`
   - `leaderboards`
   - `transactions`
   - `compliance_logs`
   - `sessions`

---

## Step 6: Configure Custom Domain (Optional)

1. Go to Railway → Your Service → Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as shown
5. Wait for SSL certificate (automatic)

---

## Troubleshooting

### Build Fails
**Problem:** Build process fails
**Solution:**
- Check Railway logs for specific errors
- Verify all environment variables are set
- Ensure DATABASE_URL is correct
- Check Node.js version (should be 22.x)

### Database Connection Errors
**Problem:** Can't connect to MySQL
**Solution:**
- Verify DATABASE_URL format is correct
- Check MySQL service is running
- Ensure database credentials are valid
- Try restarting MySQL service

### Application Crashes
**Problem:** App starts but crashes immediately
**Solution:**
- Check application logs in Railway
- Verify NODE_ENV=production is set
- Ensure all required env variables exist
- Check for missing dependencies

### Port Issues
**Problem:** Application can't bind to port
**Solution:**
- Railway automatically sets PORT variable
- Ensure your app listens on `process.env.PORT || 3000`
- Don't hardcode port numbers

---

## Monitoring & Logs

### View Logs
1. Go to Railway dashboard
2. Click on your service
3. Click "Logs" tab
4. Filter by severity (Info, Warning, Error)

### Monitor Performance
1. Check "Metrics" tab for:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

### Set Up Alerts
1. Go to "Settings" → "Notifications"
2. Add webhook or email alerts
3. Configure alert conditions

---

## Database Backup

### Automatic Backups
Railway automatically backs up MySQL databases

### Manual Backup
```bash
# Using Railway CLI
railway run mysqldump -u root -p railway > backup.sql
```

---

## Scaling

### Vertical Scaling
1. Go to Service → Settings
2. Adjust resources (RAM, CPU)
3. Click "Save"
4. Service will restart with new resources

### Horizontal Scaling
Railway supports multiple instances:
1. Go to Settings → Replicas
2. Increase replica count
3. Load balancer automatically configured

---

## Cost Optimization

### Free Tier Limits
- $5 free credit per month
- Unused resources are stopped
- Database persistence maintained

### Tips to Reduce Costs
- Use sleep mode for non-production environments
- Optimize database queries
- Enable caching
- Compress assets

---

## Security Best Practices

### Environment Variables
- Never commit .env files
- Use Railway's variable management
- Rotate secrets regularly

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict access by IP (if needed)

### Application Security
- Keep dependencies updated
- Use HTTPS only
- Implement rate limiting
- Enable CORS properly

---

## Support

### Railway Support
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Project Support
- GitHub Issues: https://github.com/Krishnaait/shamshabad-fantasy-cricket/issues
- Email: support@shamshabad.com

---

## Quick Commands Reference

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# View logs
railway logs

# Run migrations
railway run pnpm db:push

# Open in browser
railway open

# Deploy manually
railway up
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database service running
- [ ] GitHub repository connected
- [ ] Build command set correctly
- [ ] Start command configured
- [ ] Database migrations successful
- [ ] Application accessible via URL
- [ ] All pages loading correctly
- [ ] Authentication working
- [ ] Database tables created
- [ ] Logs showing no errors
- [ ] Custom domain configured (optional)

---

**🎉 Your SHAMSHABAD Fantasy Cricket platform is now live on Railway!**
