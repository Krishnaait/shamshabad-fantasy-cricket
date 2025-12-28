# Railway Environment Variables

## Required Environment Variables

Please add these environment variables in your Railway project settings:

### 1. Database (Already Set ✅)
```
DATABASE_URL=mysql://root:pLbUThNigQAhdGjxTWJFTRQufhvWdQwE@yamabiko.proxy.rlwy.net:13292/railway
```

### 2. JWT Secret (Required)
```
JWT_SECRET=shamshabad-fantasy-cricket-secret-key-2025-secure-random-string
```

### 3. Cricket API Configuration (Required)
```
CRICKET_API_KEY=1a822521-d7e0-46ff-98d3-3e51020863f3
CRICKET_API_URL=https://api.ecricdream.com/api/v1
```

### 4. Node Environment (Required)
```
NODE_ENV=production
```

### 5. OAuth Configuration (Optional - for Manus Auth)
```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
VITE_APP_ID=your-app-id
```

### 6. Owner Information (Optional)
```
OWNER_OPEN_ID=owner-open-id
OWNER_NAME=SHAMSHABAD Admin
```

## How to Add Variables in Railway

1. Go to your Railway project: https://railway.app/project/8f9c0a5e-1d3b-4941-9e63-a6339d23f92f
2. Click on your service
3. Go to "Variables" tab
4. Click "Add Variable" or "Raw Editor"
5. Paste the variables above
6. Click "Save"
7. Railway will automatically redeploy

## Database Migration

After setting variables, run migrations:

```bash
# Railway will automatically run this during deployment
pnpm db:push
```

## Verify Deployment

1. Check Railway logs for any errors
2. Visit your deployed URL
3. Test the homepage loads correctly
4. Try registering a new user
5. Check database tables were created

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify DATABASE_URL is correct
- Check Railway logs for specific errors

### Database Connection Issues
- Ensure DATABASE_URL includes SSL parameters if needed
- Verify MySQL service is running in Railway
- Check database credentials are correct

### Application Errors
- Check NODE_ENV is set to "production"
- Verify all required variables are present
- Check application logs in Railway dashboard
