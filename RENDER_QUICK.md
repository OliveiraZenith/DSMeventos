# DSMeventos - Render Deployment Quick Reference

## 🚀 Pre-Deployment Checklist

```bash
# 1. Test Docker builds locally
npm run render:test-gateway
npm run render:test-frontend

# 2. Commit and push to GitHub
git add .
git commit -m "Prepare for Render deployment"
git push origin main

# 3. Go to Render and connect your repository
```

## 📦 Deployment Order

1. **Deploy API Gateway First**
   - Wait for it to be live
   - Copy the Gateway URL (e.g., `https://dsmeventos-api-gateway.onrender.com`)

2. **Deploy Frontend Second**
   - Set `NEXT_PUBLIC_API_URL` to your Gateway URL
   - Deploy and verify connection

## ⚙️ Render Service Configuration

### API Gateway

```yaml
Name: dsmeventos-api-gateway
Root Directory: api-gateway
Environment: Docker
Dockerfile: ./Dockerfile
Port: 4000 (auto-detected)
Auto-Deploy: Yes
```

**Environment Variables:**
```
NODE_ENV=production
PORT=4000
JWT_SECRET=[Generate in Render]
AUTH_SERVICE_URL=[Your auth service]
EVENTS_SERVICE_URL=[Your events service]
ORDERS_SERVICE_URL=[Your orders service]
```

### Frontend

```yaml
Name: dsmeventos-frontend
Root Directory: frontend
Environment: Docker
Dockerfile: ./Dockerfile
Port: 3000 (auto-detected)
Auto-Deploy: Yes
```

**Environment Variables:**
```
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://dsmeventos-api-gateway.onrender.com
```

⚠️ **Set `NEXT_PUBLIC_API_URL` before first build!**

## 🔄 Update Workflow

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Render auto-deploys both services
# Wait 2-5 minutes for builds to complete
```

## 🧪 Testing Local Render Builds

```bash
# Test Gateway build
cd api-gateway
docker build -t test-gateway .
docker run -p 4000:4000 -e JWT_SECRET=test test-gateway

# Test Frontend build
cd frontend
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:4000 -t test-frontend .
docker run -p 3000:3000 test-frontend
```

## 🔍 Quick Debugging

### Check if services are running:
```bash
curl https://dsmeventos-api-gateway.onrender.com/
curl https://dsmeventos-frontend.onrender.com/
```

### Common Issues:

**Frontend can't reach API:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check Gateway is responding
- Look for CORS errors

**Gateway returns 502:**
- Check environment variables
- Verify microservice URLs
- Review Render logs

**Build fails:**
- Check Dockerfile syntax
- Verify all dependencies in package.json
- Review build logs in Render

## 💡 Tips

- **Free tier sleeps after 15 min** - First request will be slow
- **Logs are your friend** - Check them first when debugging
- **Environment variables** - Frontend needs them at BUILD time
- **Sequential deploy** - Deploy Gateway first, then Frontend
- **Health checks** - Both services have automatic health monitoring

## 📱 Service URLs

After deployment:
- **Gateway**: `https://dsmeventos-api-gateway.onrender.com`
- **Frontend**: `https://dsmeventos-frontend.onrender.com`

## 🆘 Emergency Rollback

If something breaks:
1. Go to Render Dashboard
2. Select the broken service
3. Click "Manual Deploy"
4. Select a previous successful deploy
5. Click "Deploy"

---

For detailed instructions, see `RENDER_DEPLOY.md`
