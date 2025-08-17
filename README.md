# Munch

A platform for finding recipes from **your** ingredients!

Domain: [https://youamunch.duckdns.org/](https://youamunch.duckdns.org/)

A full-stack application featuring:

- **munch-api**: Flask-based backend REST API  
- **munch-app**: React frontend for user interaction  

---

## Overview

Munch is organized into two main components:

- `munch-api` – Handles backend logic, authentication, and data APIs (Flask)  
- `munch-app` – Provides the frontend interface (React)  

For local development, you can either run everything manually or use **Docker Compose** to bring up the full environment with one command.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- Or, for manual setup:  
  - Python 3.x & virtual environment tools  
  - Node.js (LTS) & npm  

---

## Local Environment

### Clone the Repo
```bash
git clone https://github.com/kumankai/munch.git
cd munch
```

### Environment Variables
Copy and configure it before running:
```
cp .env.example .env
```

### Running with Docker Compose (recommended)

From the project root:
```
docker-compose up --build
```

This will spin up all necessary containers:

- munch-api (Flask backend)

- munch-app (React frontend)

- db (PostgreSQL or whichever DB you configure in .env)

After startup:

- API available at: http://localhost:5000

- Frontend available at: http://localhost:3000

To stop containers:

```
docker-compose down
```

### Running Manually (alternative)
Backend
```
cd munch-api
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
flask run
```

Frontend
```
cd munch-app
npm install
npm run dev
```
