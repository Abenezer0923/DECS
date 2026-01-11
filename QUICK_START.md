# DECS Quick Start Guide

Get the complete DECS system (Backend + Frontend) running in 5 minutes!

## 🚀 Super Quick Start

```bash
# 1. Start everything with Docker
docker-compose up --build

# 2. Wait for services to start (2-3 minutes)

# 3. Open your browser:
# - Frontend: http://localhost:3001
# - Backend API: http://localhost:3000
# - API Docs: http://localhost:3000/api-docs

# 4. Login:
# Username: admin
# Password: Admin@123
```

✅ **Done!** You're now running the full DECS system.

---

## 📋 What Just Happened?

Docker Compose started 3 services:

1. **PostgreSQL Database** (port 5432)
   - Stores all election data
   - Automatically initialized

2. **Backend API** (port 3000)
   - REST API with Swagger docs
   - Handles all business logic
   - Connected to database

3. **Frontend App** (port 3001)
   - Next.js web application
   - User interface
   - Connected to backend API

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3001 | Main web application |
| **Backend API** | http://localhost:3000 | REST API endpoints |
| **API Documentation** | http://localhost:3000/api-docs | Swagger UI for testing |
| **Health Check** | http://localhost:3000/health | Backend status |

---

## 👤 Test Accounts

### Admin Account (Full Access)
```
Username: admin
Password: Admin@123
Role: Admin
```

### Board Member (View & Approve)
```
Username: board_member
Password: Admin@123
Role: ManagementBoard
```

### Communication Officer
```
Username: comm_officer
Password: Admin@123
Role: Communication
```

---

## 🎯 What to Try First

### 1. Login to Frontend
1. Go to http://localhost:3001
2. Click "Login"
3. Enter: admin / Admin@123
4. You'll see the dashboard

### 2. Create an Election
1. Click "Elections" in sidebar
2. Click "Create Election"
3. Fill in the form:
   - Name: "2026 General Election"
   - Type: National
   - Start Date: 2026-01-01
   - End Date: 2026-12-31
4. Click "Create"

### 3. Create a Milestone
1. Click "Milestones" in sidebar
2. Click "Create Milestone"
3. Fill in the form:
   - Election: Select the one you created
   - Title: "Voter Registration"
   - Start Date: 2026-03-01
   - End Date: 2026-03-31
4. Click "Create"

### 4. Test the API
1. Go to http://localhost:3000/api-docs
2. Click "Authorize" (top right)
3. Login to get token
4. Try different endpoints

---

## 🛠️ Common Commands

### Start Services
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

### Restart a Service
```bash
docker-compose restart frontend
docker-compose restart backend
```

### Rebuild After Changes
```bash
docker-compose up --build
```

---

## 🔧 Troubleshooting

### Problem: Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution:**
```bash
# Find what's using the port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
```

### Problem: Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED
```

**Solution:**
```bash
# Wait a bit longer (database takes time to initialize)
# Or restart services
docker-compose restart backend
```

### Problem: Frontend Can't Connect to Backend

**Error:**
```
Network Error
```

**Solution:**
1. Check backend is running: http://localhost:3000/health
2. Check NEXT_PUBLIC_API_URL in docker-compose.yml
3. Restart frontend: `docker-compose restart frontend`

### Problem: Changes Not Reflecting

**Solution:**
```bash
# Rebuild the containers
docker-compose down
docker-compose up --build
```

---

## 📚 Next Steps

### For Users
1. ✅ Login to frontend
2. ✅ Explore the dashboard
3. ✅ Create test election
4. ✅ Create test milestones
5. ⏳ Try creating communications
6. ⏳ Generate reports
7. ⏳ View public calendar

### For Developers
1. ✅ Review backend code (`backend/src/`)
2. ✅ Review frontend code (`frontend/src/`)
3. ✅ Read API documentation
4. ⏳ Implement frontend components
5. ⏳ Add new features
6. ⏳ Write tests
7. ⏳ Deploy to production

---

## 📖 Documentation

### Backend
- **README:** `backend/README.md`
- **API Docs:** http://localhost:3000/api-docs
- **Testing Guide:** `docs/SWAGGER_TESTING_GUIDE.md`
- **Deployment:** `docs/deployment_guide.md`

### Frontend
- **README:** `frontend/README.md`
- **Setup Guide:** `frontend/SETUP_GUIDE.md`
- **Implementation:** `frontend/IMPLEMENTATION_GUIDE.md`

### Full System
- **Project Evaluation:** `docs/project_evaluation_and_roadmap.md`
- **Testing Scenarios:** `docs/TESTING_SCENARIOS.md`
- **API Reference:** `docs/API_QUICK_REFERENCE.md`

---

## 🎓 Learning Path

### Day 1: Setup & Exploration
- ✅ Run with Docker
- ✅ Login and explore UI
- ✅ Test API with Swagger
- ✅ Read documentation

### Day 2: Backend Understanding
- ⏳ Review database schema
- ⏳ Understand API endpoints
- ⏳ Test different user roles
- ⏳ Try all features

### Day 3: Frontend Understanding
- ⏳ Review frontend structure
- ⏳ Understand state management
- ⏳ Review component architecture
- ⏳ Understand routing

### Week 2: Development
- ⏳ Implement frontend components
- ⏳ Add new features
- ⏳ Write tests
- ⏳ Customize for your needs

---

## 🚀 Production Deployment

### Prerequisites
- Server with Docker installed
- Domain name
- SSL certificate

### Steps
1. Update environment variables
2. Build production images
3. Deploy with Docker Compose
4. Set up reverse proxy (Nginx)
5. Configure SSL
6. Set up monitoring

See `docs/deployment_guide.md` for detailed instructions.

---

## 💡 Tips

### Development Tips
- Use `docker-compose logs -f` to watch logs
- Backend changes auto-reload (nodemon)
- Frontend changes auto-reload (Next.js HMR)
- Use Swagger UI for API testing

### Performance Tips
- Backend runs on port 3000
- Frontend runs on port 3001
- Database runs on port 5432
- All services in same network

### Security Tips
- Change default passwords in production
- Use environment variables for secrets
- Enable HTTPS in production
- Regular security updates

---

## 📊 System Requirements

### Minimum
- CPU: 2 cores
- RAM: 4GB
- Disk: 10GB
- Docker: 20.10+

### Recommended
- CPU: 4 cores
- RAM: 8GB
- Disk: 20GB
- Docker: Latest version

---

## ✅ Checklist

### Initial Setup
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Ports 3000, 3001, 5432 available
- [ ] Run `docker-compose up --build`
- [ ] Wait for services to start
- [ ] Access frontend at http://localhost:3001
- [ ] Login with admin credentials

### Verification
- [ ] Frontend loads successfully
- [ ] Can login
- [ ] Dashboard shows data
- [ ] Can create election
- [ ] Can create milestone
- [ ] API docs accessible
- [ ] Backend health check passes

### Next Steps
- [ ] Read documentation
- [ ] Explore all features
- [ ] Test different user roles
- [ ] Try API endpoints
- [ ] Plan customizations

---

## 🎉 Success!

If you can:
- ✅ Access the frontend
- ✅ Login successfully
- ✅ See the dashboard
- ✅ Create an election
- ✅ View API documentation

**Congratulations!** Your DECS system is running perfectly.

---

## 📞 Need Help?

- **Documentation:** Check the `docs/` folder
- **Backend Issues:** See `backend/README.md`
- **Frontend Issues:** See `frontend/README.md`
- **API Testing:** Use Swagger at http://localhost:3000/api-docs
- **Questions:** Create an issue in the repository

---

**Time to Complete:** 5 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Docker installed

**Happy Election Managing!** 🗳️✨
