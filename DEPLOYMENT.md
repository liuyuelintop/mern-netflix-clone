# Netflix Clone Deployment Guide

This guide provides the exact steps used to deploy the MERN Netflix Clone on AWS EC2, based on the original deployment at netwatch.liuyuelin.xyz.

## Prerequisites

### Required Accounts
- AWS account with EC2 access
- MongoDB Atlas account (or MongoDB instance)
- TMDB API key from [themoviedb.org](https://www.themoviedb.org/signup)
- Domain name (if you want HTTPS like netwatch.liuyuelin.xyz)

### Local Requirements
- SSH key pair for EC2 access
- Git repository with your code
- Node.js locally for development

### SSH Key Setup
If you don't have an SSH key pair, create one:
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -c "your-email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Create a new project and cluster
3. Go to Database Access → Add Database User
4. Go to Network Access → Add IP Address (add 0.0.0.0/0 for all IPs or your EC2 IP)
5. Get connection string from Connect → Connect your application

## EC2 Instance Setup

### Step 1: Launch EC2 Instance
- Launch Ubuntu Server 20.04 LTS instance
- Configure security groups for HTTP (80), HTTPS (443), and SSH (22)
- Connect to your instance via SSH

### Step 2: System Update
```bash
sudo apt update
sudo apt upgrade
```

### Step 3: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Application Deployment

### Step 1: Transfer Code to Server
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i ~/.ssh/your-key.pem" \
. ubuntu@ip-address:~/app
```

### Step 2: Install Dependencies & Build
SSH into your server and run:
```bash
cd ~/app

# The project has a custom build script that installs both backend and frontend dependencies
npm run build
```

The build script in package.json:
```json
"build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
```

### Step 3: Environment Configuration
Create the production environment file:
```bash
sudo vim /etc/netflix-clone.env
```

Add your environment variables (replace with your actual values):
```env
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
PORT=5001
```

Secure the environment file:
```bash
sudo chmod 600 /etc/netflix-clone.env
sudo chown ubuntu:ubuntu /etc/netflix-clone.env
```

## SystemD Service Configuration

### Step 1: Create SystemD Service File
```bash
sudo vim /etc/systemd/system/netflix-clone.service
```

Add the following configuration (this is the exact configuration used):
```ini
[Unit]
Description=Netflix Clone MERN App
After=network.target multi-user.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/app
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=/etc/netflix-clone.env
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=netflix_clone_app

[Install]
WantedBy=multi-user.target
```

### Step 2: Start and Enable Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable netflix-clone.service
sudo systemctl start netflix-clone.service
```

### Step 3: Verify Service Status
```bash
sudo systemctl status netflix-clone.service
```

## Domain Setup (Optional)

If you want to use a custom domain like netwatch.liuyuelin.xyz:

### Step 1: Purchase Domain
- Buy domain from Namecheap, GoDaddy, or AWS Route 53

### Step 2: AWS Route 53 Setup (if using AWS)
1. Go to AWS Route 53
2. Create hosted zone for your domain
3. Note the Name Server (NS) record values
4. Update your domain registrar's nameservers with AWS NS records
5. Create an A record pointing to your EC2 instance's public IP

### Step 3: Point Domain to EC2
- Create an A record in your DNS provider
- Point the record to your EC2 instance's public IP address

## HTTPS with Caddy

### Step 1: Install Caddy
```bash
sudo apt install caddy
```

### Step 2: Configure Caddy
```bash
sudo vim /etc/caddy/Caddyfile
```

Add your domain configuration (replace with your domain):
```
netwatch.liuyuelin.xyz {
    reverse_proxy localhost:5001
}
```

### Step 3: Start Caddy
```bash
sudo systemctl enable caddy
sudo systemctl start caddy
```

## Monitoring & Maintenance

### Check Application Status
```bash
# Check service status
sudo systemctl status netflix-clone.service

# View application logs
sudo journalctl -u netflix-clone.service -f

# Check Caddy status
sudo systemctl status caddy
```

### Update Application
```bash
# Stop the service
sudo systemctl stop netflix-clone.service

# Update code (from your local machine)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i ~/.ssh/your-key.pem" \
. ubuntu@your-ec2-ip:~/app

# SSH to server and rebuild
ssh -i ~/.ssh/your-key.pem ubuntu@your-ec2-ip
cd ~/app
npm run build

# Restart the service
sudo systemctl start netflix-clone.service
```

This guide contains only the essential steps used in the actual deployment, without unnecessary generic AWS information.