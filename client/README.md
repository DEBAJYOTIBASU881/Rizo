# RIZO - Online Exam Result Management Solution

A modern, production-ready web application for managing student results, built with React + TypeScript and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Backend Setup**
```bash
cd c:\server
npm install
npm start
```
Server will run on `http://localhost:4000`

2. **Frontend Setup**
```bash
cd c:\client
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🔑 Default Credentials

**Faculty Login:**
- Username: `faculty@college.local`
- Password: `FacultyPass123`

**Student Login:**
- Students are created by faculty
- Use the Student ID and password set during creation

## 📋 Features

### Faculty Module
- ✅ Student Management (Create, Update, Delete)
- ✅ Subject Enrollment per Semester
- ✅ Marks Entry and Management
- ✅ Dashboard with Statistics

### Student Module
- ✅ View Profile
- ✅ View Semester Results
- ✅ Secure Login

### UI/UX
- ✅ Dark/Light Mode Toggle
- ✅ Responsive Design
- ✅ Smooth Animations (Framer Motion)
- ✅ Premium Glassmorphism Theme

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Router
- Axios

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- CORS enabled

## 📁 Project Structure

```
RIZO/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
└── server/          # Node.js backend
    ├── index.js
    ├── db.sql
    ├── .env
    └── package.json
```

## 🎨 Design System

**Colors:**
- Primary: Royal Blue (#0A3D91)
- Accent: Gold (#D4AF37)
- Dark Background: #0C1424
- Dark Card: #1B2434

**Typography:**
- Headings: Poppins
- Body: Inter
- Monospace: Roboto Mono

## 📝 API Endpoints

### Authentication
- `POST /faculty/login` - Faculty authentication
- `POST /student/login` - Student authentication

### Students
- `GET /students` - List all students
- `POST /student` - Create student
- `GET /student/:id` - Get student details
- `PUT /student/:id` - Update student
- `DELETE /student/:id` - Delete student

### Subjects & Marks
- `GET /subjects` - Get subjects (with filters)
- `GET /subject/:subjectId/students` - Get enrolled students
- `POST /subject/:subjectId/marks` - Save marks

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=4000
```

## 👥 Authors

**DEBAJYOTI BASU & ABHIJIT KUNAR**

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email your-email@example.com
