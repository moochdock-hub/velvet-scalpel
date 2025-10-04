# 🚀 Hostinger Deployment Guide for Velvet Scalpel

## Prerequisites ✅

Before starting, ensure you have:
- Hostinger account with Node.js hosting support
- Git access in your Hostinger control panel
- OpenAI API key
- GitHub account

## Step 1: Create GitHub Repository

1. **Go to GitHub and create a new repository**
   - Repository name: `velvet-scalpel` (or your preferred name)
   - Set to Public or Private
   - Don't initialize with README (we already have one)

2. **Add remote origin to your local repository**
   ```bash
   cd C:\Users\Mecsu\OneDrive\Documents\GitHub\DeepCode\generated_projects\velvet_project
   git remote add origin https://github.com/YOUR_USERNAME/velvet-scalpel.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Hostinger Setup

### 2.1 Enable Node.js
1. Log into your Hostinger control panel
2. Go to **Advanced** > **Node.js**
3. Click **Create Application**
4. Choose Node.js version (14+ recommended)
5. Set application root directory (e.g., `/domains/yourdomain.com/public_html/velvet-scalpel`)
6. Set startup file: `server.js`

### 2.2 Configure Domain (Optional)
- If using subdomain: `velvet.yourdomain.com`
- If using subdirectory: `yourdomain.com/velvet`

## Step 3: Deploy via Git

### 3.1 Access Hostinger Terminal
1. In Hostinger control panel, go to **Advanced** > **SSH Access**
2. Enable SSH access if not already enabled
3. Use provided SSH credentials or the web terminal

### 3.2 Clone Repository
```bash
# Navigate to your domain directory
cd /domains/yourdomain.com/public_html

# Clone your repository
git clone https://github.com/YOUR_USERNAME/velvet-scalpel.git

# Navigate to project directory
cd velvet-scalpel
```

### 3.3 Install Dependencies
```bash
# Install production dependencies
npm install --production

# Or use the provided script
chmod +x deploy.sh
./deploy.sh
```

## Step 4: Environment Configuration

### 4.1 Create Environment File
```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

### 4.2 Configure Environment Variables
Add the following to your `.env` file:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=3000
NODE_ENV=production
```

**Important**: Replace `your_actual_openai_api_key_here` with your real OpenAI API key

## Step 5: Start the Application

### 5.1 Test Run
```bash
# Test the application
npm start
```

If you see "Server is running on port 3000", the setup is working!

### 5.2 Production Start
For production, run in background:
```bash
# Start in background
nohup npm start > velvet-scalpel.log 2>&1 &

# Check if running
ps aux | grep node
```

## Step 6: Configure Hostinger Node.js App

1. Go back to Hostinger **Node.js** section
2. Click on your application
3. Set the following:
   - **Application root**: `/domains/yourdomain.com/public_html/velvet-scalpel`
   - **Application URL**: Your chosen URL
   - **Startup file**: `server.js`
4. Click **Save**

## Step 7: Access Your Application

Your Velvet Scalpel application should now be accessible at:
- `https://yourdomain.com` (if main domain)
- `https://velvet.yourdomain.com` (if subdomain)
- `https://yourdomain.com/velvet` (if subdirectory)

## 🔄 Future Updates

To deploy updates:

1. **Make changes locally**
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

3. **Update on Hostinger**:
   ```bash
   cd /domains/yourdomain.com/public_html/velvet-scalpel
   git pull origin main
   npm install --production
   
   # Restart the application
   pkill -f "node server.js"
   nohup npm start > velvet-scalpel.log 2>&1 &
   ```

## 🛠 Troubleshooting

### Common Issues:

**1. Application not starting**
- Check Node.js version: `node --version`
- Verify dependencies: `npm install --production`
- Check logs: `tail -f velvet-scalpel.log`

**2. API errors**
- Verify OpenAI API key in `.env` file
- Check API key permissions and billing

**3. Port conflicts**
- Hostinger may assign different ports automatically
- Check Hostinger Node.js panel for actual port

**4. Permission errors**
- Ensure correct file permissions: `chmod -R 755 .`
- Check directory ownership

### Useful Commands:
```bash
# Check running processes
ps aux | grep node

# Stop application
pkill -f "node server.js"

# View logs
tail -f velvet-scalpel.log

# Check port usage
netstat -tulpn | grep :3000

# Test application locally
curl http://localhost:3000
```

## 📞 Support

- **Hostinger Support**: For hosting-related issues
- **GitHub Issues**: For application bugs
- **OpenAI Support**: For API-related problems

## 🔒 Security Notes

- Never commit `.env` file to repository
- Use strong API keys
- Enable HTTPS in production
- Regularly update dependencies
- Monitor API usage and costs

---

**🎉 Congratulations!** Your Velvet Scalpel application is now deployed and ready for mystical conversations! 🔮✨

## Quick Reference Commands

```bash
# Deploy fresh update
git pull && npm install --production && pkill -f "node server.js" && nohup npm start > velvet-scalpel.log 2>&1 &

# Check status
ps aux | grep node && tail -5 velvet-scalpel.log

# Stop application
pkill -f "node server.js"
```