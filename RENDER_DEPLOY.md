# Deploying DSMeventos to Render

This guide explains how to deploy the API Gateway and Frontend as separate services on Render.

## 🚀 Quick Deploy

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment config"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the `render.yaml` file
   - Click "Apply"

3. **Configure Environment Variables**
   - After deployment, go to each service's dashboard
   - Update the environment variables:
     - **API Gateway**: Set `AUTH_SERVICE_URL`, `EVENTS_SERVICE_URL`, `ORDERS_SERVICE_URL`
     - **Frontend**: Set `NEXT_PUBLIC_API_URL` to your Gateway URL

### Option 2: Manual Deployment

#### Deploy API Gateway

1. **Create Web Service**
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `dsmeventos-api-gateway`
     - **Region**: Choose your region
     - **Branch**: `main`
     - **Root Directory**: `api-gateway`
     - **Environment**: `Docker`
     - **Dockerfile Path**: `./Dockerfile`
     - **Plan**: Free (or Starter for production)

2. **Environment Variables**
   Add these in the Render dashboard:
   ```
   NODE_ENV=production
   PORT=4000
   JWT_SECRET=your_secure_secret_here_generate_strong_one
   AUTH_SERVICE_URL=https://your-auth-service.com
   EVENTS_SERVICE_URL=https://your-events-service.com
   ORDERS_SERVICE_URL=https://your-orders-service.com
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

#### Deploy Frontend

1. **Create Web Service**
   - Go to Render Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `dsmeventos-frontend`
     - **Region**: Choose your region (same as Gateway)
     - **Branch**: `main`
     - **Root Directory**: `frontend`
     - **Environment**: `Docker`
     - **Dockerfile Path**: `./Dockerfile`
     - **Plan**: Free (or Starter for production)

2. **Environment Variables**
   Add these in the Render dashboard:
   ```
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_API_URL=https://dsmeventos-api-gateway.onrender.com
   ```
   
   ⚠️ **Important**: Set `NEXT_PUBLIC_API_URL` to your actual API Gateway URL after Gateway is deployed!

3. **Build Environment Variables** (Add in Render dashboard under "Environment")
   ```
   NEXT_PUBLIC_API_URL=https://dsmeventos-api-gateway.onrender.com
   ```
   
   These are needed at **build time** for Next.js.

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

## 📋 Deployment Checklist

### Before Deploying

- [ ] Push code to GitHub
- [ ] Verify `render.yaml` is in repository root
- [ ] Confirm both Dockerfiles are optimized
- [ ] Ensure `next.config.ts` has `output: 'standalone'`

### API Gateway Setup

- [ ] Service created on Render
- [ ] Environment variables configured
- [ ] JWT_SECRET generated (use strong random string)
- [ ] Microservice URLs configured
- [ ] Health check endpoint working (`/`)
- [ ] Service is live and accessible

### Frontend Setup

- [ ] Service created on Render
- [ ] NEXT_PUBLIC_API_URL set to Gateway URL
- [ ] Build-time environment variables configured
- [ ] Health check endpoint working (`/`)
- [ ] Service is live and accessible
- [ ] Can connect to API Gateway

## 🔧 Render Configuration Details

### API Gateway Service

```yaml
Name: dsmeventos-api-gateway
Environment: Docker
Dockerfile: api-gateway/Dockerfile
Root Directory: api-gateway
Port: 4000 (auto-detected)
Health Check: / (GET request)
Auto-Deploy: Yes (on git push)
```

### Frontend Service

```yaml
Name: dsmeventos-frontend
Environment: Docker
Dockerfile: frontend/Dockerfile
Root Directory: frontend
Port: 3000 (auto-detected)
Health Check: / (GET request)
Auto-Deploy: Yes (on git push)
```

## 🌐 Service URLs

After deployment, your services will be available at:

- **API Gateway**: `https://dsmeventos-api-gateway.onrender.com`
- **Frontend**: `https://dsmeventos-frontend.onrender.com`

## 🔐 Environment Variables Guide

### API Gateway Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `4000` |
| `JWT_SECRET` | JWT signing secret | Use Render's "Generate" button |
| `AUTH_SERVICE_URL` | Auth microservice endpoint | `https://auth.yourdomain.com` |
| `EVENTS_SERVICE_URL` | Events microservice endpoint | `https://events.yourdomain.com` |
| `ORDERS_SERVICE_URL` | Orders microservice endpoint | `https://orders.yourdomain.com` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `NEXT_PUBLIC_API_URL` | API Gateway URL (build + runtime) | `https://dsmeventos-api-gateway.onrender.com` |

⚠️ **Critical**: `NEXT_PUBLIC_API_URL` must be set **before** building the frontend!

## 🔄 Updating Your Deployment

### Automatic Deploys (Recommended)

Render automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both services will rebuild and deploy automatically.

### Manual Deploys

1. Go to Render Dashboard
2. Select the service (Gateway or Frontend)
3. Click "Manual Deploy" → "Deploy latest commit"

### Rebuilding Frontend After Gateway URL Change

If you change the API Gateway URL:

1. Update `NEXT_PUBLIC_API_URL` in Frontend service settings
2. Trigger a manual deploy or redeploy
3. Frontend will rebuild with new API URL

## 📊 Monitoring

### View Logs

1. Go to your service in Render Dashboard
2. Click "Logs" tab
3. View real-time logs

### Health Checks

Render automatically monitors:
- API Gateway: `GET /` (should return 200)
- Frontend: `GET /` (should return 200)

If health checks fail, Render will attempt to restart the service.

## 🐛 Troubleshooting

### Build Failures

**Frontend build fails:**
```bash
# Check that NEXT_PUBLIC_API_URL is set in Environment Variables
# It needs to be available at build time
```

**API Gateway build fails:**
```bash
# Check Render logs for specific errors
# Verify Dockerfile is in api-gateway directory
```

### Runtime Issues

**API Gateway returns 502:**
- Check environment variables are set correctly
- Verify microservice URLs are accessible
- Check logs for connection errors

**Frontend can't connect to API:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check if API Gateway is running
- Look for CORS issues in browser console

**JWT validation errors:**
- Ensure `JWT_SECRET` is the same across deploys
- Use Render's environment variable feature (not auto-generated on each deploy)

### Free Tier Limitations

Render's free tier spins down services after 15 minutes of inactivity:
- First request after spin-down takes ~30 seconds
- Consider upgrading to Starter plan for always-on services

## 💰 Cost Optimization

### Free Tier (Both Services)
- **Cost**: $0/month
- **Limitations**: 
  - Services spin down after 15 min inactivity
  - 750 hours/month shared across all services
  - Slower cold starts

### Starter Plan (Recommended for Production)
- **Cost**: $7/service/month ($14 total)
- **Benefits**:
  - Always on
  - Faster performance
  - Custom domains
  - Better support

## 🔒 Security Recommendations

1. **Use Strong Secrets**
   - Generate JWT_SECRET using Render's generator
   - Never commit secrets to git

2. **Enable HTTPS**
   - Render provides free SSL certificates
   - Ensure your frontend uses `https://` for API_URL

3. **Environment Variables**
   - Use Render's encrypted environment variables
   - Don't expose secrets in logs

4. **CORS Configuration**
   - Configure CORS in Gateway to only allow your frontend domain
   - Update when deploying to production

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Docker Deployment Guide](https://render.com/docs/docker)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Render Free Tier Details](https://render.com/docs/free)

## 🆘 Support

If you encounter issues:
1. Check Render logs for both services
2. Verify all environment variables are set
3. Test endpoints manually using curl
4. Check Render status page: [status.render.com](https://status.render.com)
