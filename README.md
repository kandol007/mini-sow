# Mini SOW - Invoice Management System

A modern, responsive invoice management system with JWT authentication, multi-language support, and a dynamic price list interface.

## 🚀 Tech Stack

### Frontend
- **React** 18.3.1
- **Vite** 5.4.2 (Build tool & dev server)
- **Vanilla CSS** (Fully responsive, no frameworks)
- **HTML5** with modern semantics

### Backend
- **Node.js** 18.x or higher (LTS recommended)
- **Express.js** 4.18.x
- **JSON Web Tokens (JWT)** for authentication
- **bcrypt** for password hashing

### Database
- **PostgreSQL** 14.x or higher
- **pg** (node-postgres) driver

### Development Tools
- **ESLint** for code linting
- **Git** for version control

## ✨ Features

- 🔐 JWT-based authentication
- 🌍 Multi-language support (English/Swedish)
- 📱 Fully responsive design (Mobile, Tablet, Desktop)
- 🎨 Modern UI with sliding sidebar navigation
- 📊 Dynamic price list with real-time editing
- 🔍 Search and filter functionality
- 🖨️ Print-friendly layouts
- 📋 Terms and Conditions page with smart navigation

## 📋 Prerequisites

Make sure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **PostgreSQL** >= 14.0 ([Download](https://www.postgresql.org/download/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** (optional, for version control)

## 🛠️ Quick Local Setup

### 1. Database Setup

Create and initialize the database:

```bash
# Create database
createdb mini_sow

# Run schema
psql -d mini_sow -f sql/schema.sql

# Seed initial data
psql -d mini_sow -f sql/seed.sql
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
# Example:
# DATABASE_URL=postgresql://username:password@localhost:5432/mini_sow
# JWT_SECRET=your-super-secret-key-change-this-in-production
# PORT=4000

# Install dependencies
npm install

# Create default test user
npm run create-user

# Start backend server
npm start
```

Backend will run on: `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

**Default Login Credentials:**
- Username: `testuser`
- Password: `Password123`

## 📁 Project Structure

```
mini-sow/
├── backend/
│   ├── server.js           # Express server
│   ├── create_user.js      # User creation script
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main router
│   │   ├── main.jsx        # Entry point
│   │   ├── styles.css      # Global styles
│   │   └── pages/
│   │       ├── Login.jsx   # Login page
│   │       ├── Terms.jsx   # Terms & Conditions
│   │       └── Pricelist.jsx # Price list management
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── sql/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample data
└── README.md
```

## 🔧 Configuration

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mini_sow
JWT_SECRET=change-this-to-a-random-secret-in-production
PORT=4000
NODE_ENV=development
```

### Frontend (vite.config.js)

The frontend is configured to proxy API requests to the backend:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
})
```

## 📱 Responsive Design Breakpoints

- **Mobile**: < 481px
- **Tablet Portrait**: 481px - 768px
- **Tablet Landscape**: 769px - 1024px
- **Desktop**: > 1024px

## 🎨 UI Features by Screen Size

### Mobile (< 481px)
- Blue header with hamburger menu
- Search boxes for filtering
- Action buttons (Add, Print, Advanced)
- Simplified 3-column layout
- Dropdown navigation menu

### Tablet (481px - 1024px)
- Simplified header with buttons
- 4-column layout
- Dropdown menu navigation

### Desktop (> 1024px)
- Full header with search
- Sliding sidebar navigation
- 7-column full data display
- Hover effects and tooltips

## 🗄️ Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `password` (VARCHAR - bcrypt hashed)

### Products Table
- `id` (SERIAL PRIMARY KEY)
- `article_no` (VARCHAR)
- `product_service` (VARCHAR)
- `in_price` (DECIMAL)
- `price` (DECIMAL)
- `unit` (VARCHAR)
- `in_stock` (INTEGER)

### Texts Table (i18n)
- `id` (SERIAL PRIMARY KEY)
- `language` (VARCHAR - 'en' or 'se')
- `key` (VARCHAR)
- `value` (TEXT)

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized static files.

#### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name mini-sow-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend static files
    location / {
        root /var/www/mini-sow/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 🔐 Security Notes

**⚠️ Important for Production:**

1. **Change JWT_SECRET** in `.env` to a strong random string
2. **Use HTTPS** (SSL/TLS) in production
3. **Set secure cookie flags** if using cookies
4. **Enable CORS** properly for your domain
5. **Use environment variables** for all secrets
6. **Update default credentials** immediately
7. **Keep dependencies updated**: `npm audit fix`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Navigate: Login → Terms → Back to Login
- [ ] Navigate: Pricelist → Terms → Back to Pricelist
- [ ] Add new product
- [ ] Edit product fields (auto-save on blur)
- [ ] Delete product
- [ ] Search products by article number
- [ ] Search products by name
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test hamburger menu on all screen sizes
- [ ] Print functionality
- [ ] Browser back/forward buttons
- [ ] Direct URL access (`/login`, `/terms`, `/pricelist`)
- [ ] Logout functionality
- [ ] Language switching (EN/SE)

## 📝 API Endpoints

### Authentication
- `POST /api/login` - Login with username/password
  - Request: `{ username, password }`
  - Response: `{ token }`

### Products (Requires Authentication)
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Texts (i18n)
- `GET /api/texts/:lang` - Get translations for language (en/se)

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
psql -l | grep mini_sow

# Test connection
psql -d mini_sow -c "SELECT version();"
```

### Port Already in Use
```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Frontend Not Loading
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

## 📦 Dependencies

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.1",
  "vite": "^5.4.2"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Credits

- Design inspired by modern invoice management systems
- Built with React, Vite, and PostgreSQL
- Responsive design principles for optimal UX

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using React, Vite, Node.js, and PostgreSQL**

© 2025 Mini SOW. All rights reserved.