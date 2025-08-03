# CareerGuard - Job Consultancy Website

A comprehensive job consultancy platform with cyber fraud protection services, built with React, Node.js, Express, and MongoDB.

## Features

### Frontend
- **Modern Landing Page**: Stunning UI inspired by Finixia with smooth animations
- **Responsive Design**: Works perfectly on all devices
- **Service Sections**: 
  - Cyber Crime Fraud Assistance
  - Job Consultancy Services
  - Web & App Development
  - Digital Marketing
  - Training & Certification
- **Admin Dashboard**: Complete admin panel for managing clients and services
- **Contact Forms**: Multiple contact forms for different services

### Backend
- **RESTful API**: Built with Express.js
- **MongoDB Database**: Secure data storage
- **Authentication**: JWT-based authentication system
- **Email Integration**: Nodemailer for email notifications
- **File Upload**: Multer for handling file uploads

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- React Router DOM
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Nodemailer for emails
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careerguard
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/careerguard
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   npm run dev
   ```

## Usage

### Accessing the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/admin/login

### Admin Credentials (Demo)
- **Email**: admin@careerguard.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Contact Management
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get all contacts (admin only)

### Job Applications
- `POST /api/job-applications` - Submit job application
- `GET /api/job-applications` - Get all applications (admin only)

### Fraud Cases
- `POST /api/fraud-cases` - Report fraud case
- `GET /api/fraud-cases` - Get all fraud cases (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (admin only)

## Services Offered

### 1. Cyber Crime Fraud Assistance
- Cyber fraud complaint support
- Guidance for filing FIR or online complaint
- Awareness and prevention tips

### 2. Job Consultancy Services
- IT & Non-IT job placements (Freshers & Experienced)
- Resume building and interview support
- Work from Home job listings

### 3. Web & App Development
- Website development (static/dynamic)
- E-commerce platform setup
- Mobile app development (Android/iOS)
- UI/UX Design

### 4. Digital Marketing
- Social media marketing
- SEO (Search Engine Optimization)
- Google Ads / Meta Ads

### 5. Training & Certification
- Short-term IT training (Python, Testing, Web Dev)
- Digital marketing certification programs
- Freelancing skill development

## Project Structure

```
careerguard/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Footer.tsx
│   │   └── admin/
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AdminLogin.tsx
│   │   └── AdminDashboard.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   └── App.tsx
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@careerguard.com or create an issue in the repository.

## Acknowledgments

- Design inspiration from Finixia
- Icons by Lucide React
- Animations by Framer Motion
- UI components styled with Tailwind CSS