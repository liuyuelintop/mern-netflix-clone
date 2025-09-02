# MERN Netflix Clone

A full-stack Netflix clone built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, movie/TV show browsing, search functionality, and responsive design.

[![Netflix Clone](image/README/1721878819768.png)](https://mern-netflix-clone-mj1d.onrender.com/)

## 🚀 Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Browse Content**: Explore movies and TV shows by categories
- **Search Functionality**: Search for movies, TV shows, and people
- **Search History**: Track and manage search history
- **Responsive Design**: Mobile-friendly interface
- **Real-time Data**: Integration with TMDB API for up-to-date content
- **Watch Pages**: Detailed movie/TV show pages with trailers

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Cookie Parser

### External APIs
- The Movie Database (TMDB) API

## 📦 Project Structure

```
mern-netflix-clone/
├── backend/
│   ├── config/         # Database and environment configurations
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Authentication middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # External API services
│   ├── utils/          # Utility functions
│   └── server.js       # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Page components
│   │   ├── store/      # Zustand store
│   │   └── utils/      # Utility functions
│   ├── public/         # Static assets
│   └── package.json    # Frontend dependencies
└── package.json        # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mern-netflix-clone
```

2. Install dependencies:
```bash
npm run build
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```env
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🌐 Deployment to AWS EC2

### Prerequisites
- AWS EC2 instance (Ubuntu 20.04 LTS recommended)
- Security groups configured for HTTP (80), HTTPS (443), and SSH (22)
- Domain name (optional, for SSL)

### Step-by-Step Deployment

#### 1. Server Setup

SSH into your EC2 instance and update the system:
```bash
sudo apt update
sudo apt upgrade -y
```

Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Code Deployment

Transfer your code to the server (replace with your actual key path and IP):
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i ~/.ssh/your-key.pem" \
. ubuntu@your-ec2-ip:~/app
```

#### 3. Application Setup

SSH into your server and navigate to the app directory:
```bash
ssh -i ~/.ssh/your-key.pem ubuntu@your-ec2-ip
cd ~/app
```

Install dependencies and build the application:
```bash
npm run build
```

#### 4. Environment Configuration

Create the production environment file:
```bash
sudo vim /etc/netflix-clone.env
```

Add your production environment variables:
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
```

Secure the environment file:
```bash
sudo chmod 600 /etc/netflix-clone.env
sudo chown ubuntu:ubuntu /etc/netflix-clone.env
```

#### 5. SystemD Service Setup

Create a SystemD service file:
```bash
sudo vim /etc/systemd/system/netflix-clone.service
```

Add the following configuration:
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

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable netflix-clone.service
sudo systemctl start netflix-clone.service
```

Check the service status:
```bash
sudo systemctl status netflix-clone.service
```

#### 6. Reverse Proxy with Caddy (Optional - for HTTPS)

Install Caddy:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

Configure Caddy:
```bash
sudo vim /etc/caddy/Caddyfile
```

Add your domain configuration:
```
your-domain.com {
    reverse_proxy localhost:5000
}
```

Start Caddy:
```bash
sudo systemctl enable caddy
sudo systemctl start caddy
```

### Deployment Management

#### Update Application
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

#### Monitor Application
```bash
# Check service status
sudo systemctl status netflix-clone.service

# View logs
sudo journalctl -u netflix-clone.service -f

# Check system resources
htop
```

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Movies
- `GET /api/v1/movie/trending` - Get trending movies
- `GET /api/v1/movie/:id/trailers` - Get movie trailers
- `GET /api/v1/movie/:id/details` - Get movie details
- `GET /api/v1/movie/:id/similar` - Get similar movies
- `GET /api/v1/movie/:category` - Get movies by category

### TV Shows
- `GET /api/v1/tv/trending` - Get trending TV shows
- `GET /api/v1/tv/:id/trailers` - Get TV show trailers
- `GET /api/v1/tv/:id/details` - Get TV show details
- `GET /api/v1/tv/:id/similar` - Get similar TV shows
- `GET /api/v1/tv/:category` - Get TV shows by category

### Search
- `GET /api/v1/search/person/:query` - Search for people
- `GET /api/v1/search/movie/:query` - Search for movies
- `GET /api/v1/search/tv/:query` - Search for TV shows
- `GET /api/v1/search/history` - Get search history
- `DELETE /api/v1/search/history/:id` - Delete search history item

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Demo

[Live Demo](https://mern-netflix-clone-mj1d.onrender.com/)

## 🚀 Deployment Guide

**📋 [Complete Deployment Guide](./DEPLOYMENT.md)**

If you need to deploy this project from scratch or migrate to a new environment, see the comprehensive deployment guide which includes:

- **Account Setup**: AWS, MongoDB Atlas, TMDB API setup
- **Cost Estimation**: Monthly cost breakdowns and optimization tips  
- **Infrastructure**: Detailed AWS EC2 setup and configuration
- **Deployment**: Step-by-step application deployment process
- **Domain & SSL**: Custom domain and HTTPS configuration
- **Monitoring**: Application monitoring and maintenance procedures
- **Troubleshooting**: Common issues and solutions
- **Backup & Migration**: Data backup and system migration guides

## TODO

- [ ] ActorPage
