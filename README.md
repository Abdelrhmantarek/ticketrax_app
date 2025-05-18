# Ticketrax_app 🎟️
Ticketrax is a lightweight, full-stack support ticket management system designed to streamline communication between clients and support/admin teams.

---

## 🚀 Tech Highlights
  - **Frontend**: React + Vite + TypeScript + Tailwind + shadcn-ui.
  - **Backend**: Django + Django REST Framework (DRF).
  - **Auth**: Auth token.
  - **Database**: SQLite (default), easily swap to PostgreSQL in production.

---

## 📂 Repository Structure

```
ticketrax_app/
├── client/                     # React frontend (Vite + TS)
│   ├── node_modules/
│   ├── public/                 # Static assets
│   │   ├── favicon.ico
│   │   ├── placeholder.svg
│   │   └── robots.txt
│   ├── src/                    # React app source
│   │   ├── components/         # UI components (admin, ui)
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utility functions
│   │   ├── pages/              # Route views
│   │   ├── services/           # API services (auth, tickets)
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env                    # Local env (API URL, etc.)
│   ├── bun.lockb               
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── server/                     # Django backend
│   ├── ticketrax/              # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── base/                   # Core app (models, views, serializers)
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3              # Default dev DB
│   ├── venv/                   # Python virtualenv (ignored)
├── .gitignore
├── LICENSE
└── README.md                   # This file 😃
```

---

## 🔧 Prerequisites

- **Node.js & npm** (v16+ recommended)
- **Python 3.9+**
- **pip** (Python package manager)
- **Git** (for cloning)

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Abdelrhmantarek/ticketrax_app.git
cd ticketrax_app
```

### 2. Backend Setup (Django + DRF)

1. Navigate then Create and activate a Python virtual environment:
   ```bash
   cd server
   python -m virtualenv venv
   source venv/bin/activate      # macOS/Linux
   venv/Scripts/activate    # Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in values:
   ```bash
   cp .env.example .env
   ```
   > **Variables:**
   > - `DJANGO_SECRET_KEY` – secret key for Django
   > - `DEBUG` – `True` for development
   > - `CORS_ALLOWED_ORIGINS` = http://localhost:8080
   > - `CSRF_TRUSTED_ORIGINS` = http://localhost:8080
4. Apply migrations and create a superuser:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```


### 3. Frontend Setup (React + Vite + TS)

1. Navigate to client folder and install:
   ```bash
   cd ../client
   npm i
   ```
2. Copy `.env.example` to `.env` and fill in API endpoint:
   ```bash
   cp .env.example .env
   ```
   > **Variables:**
   > - `VITE_API_BASE_URL` – e.g. `http://localhost:8000/api`

---

## 🎬 Running the Application

It’s easiest to run both servers concurrently in separate terminals:

1. **Backend** (port 8000):
   ```bash
   cd ticketrax_app/server
   venv/Scripts/activate      # if not already
   python manage.py runserver
   ```
2. **Frontend** (port 8080):
   ```bash
   cd ticketrax_app/client
   npm run dev
   ```

**Access:**
- Client app:  `http://localhost:8080/` (or as printed by Vite)  
- Admin panel: `http://localhost:8000/admin/`
- DRF Api: `http://localhost:8000/api/`

---

---

## 🚢 Deployment

_For production, consider Dockerizing both services or deploying separately._

1. **Backend**
   - Configure `DEBUG=False` and production database (PostgreSQL).
   - Collect static files:
     ```bash
     python manage.py collectstatic
     ```
   - Serve via Gunicorn + Nginx.

2. **Frontend**
   - Build assets:
     ```bash
     npm run build
     ```
   - Serve static build via CDN or static hosting (Netlify, Vercel).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request.

1. Fork
2. Create branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m "Add YourFeature"`
4. Push: `git push origin feature/YourFeature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 🪄 Contact

Reach out at **abdelrhman.tareekk@gmail.com**.

Happy coding!
