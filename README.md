# Student Result Management System

A comprehensive web application for managing student results, enrollments, and academic interactions. This system provides distinct interfaces for faculty and students, facilitating efficient academic management and communication.

## Features

### Faculty Dashboard
- **Student Management**: Add, update, and delete student records.
- **Marks Management**: Enter and update marks for students across different subjects.
- **Polls**: Create and manage polls to gather student feedback.
- **Announcements**: Post announcements visible to all students.
- **Q&A**: View and respond to student queries.
- **Settings**: Configure system settings like University Name.

### Student Dashboard
- **View Results**: Access detailed result sheets and marks.
- **Polls**: Vote on active polls and view results.
- **Announcements**: View latest announcements from the faculty.
- **Q&A**: Ask questions to the faculty and view responses.
- **Profile Management**: Change password and view profile details.

## Technology Stack

### Frontend
- **React**: UI library for building the user interface.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Library for animations and transitions.
- **OGL**: WebGL library for the dynamic Aurora background.
- **Lucide React**: Icon library.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express**: Web framework for building the API.
- **Supabase**: Backend-as-a-Service providing PostgreSQL database and authentication.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (or yarn/pnpm)
- **Supabase Account**: For the database.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Rizo
    ```

2.  **Server Setup:**
    ```bash
    cd server
    npm install
    ```
    - Create a `.env` file in the `server` directory with the following credentials:
      ```env
      SUPABASE_URL=your_supabase_url
      SUPABASE_KEY=your_supabase_anon_key
      PORT=4000
      ```
    - **Database Setup**: Run the SQL scripts in your Supabase SQL editor in the following order:
        1. `db.sql` (Initial schema)
        2. `FINAL_DB_SETUP.sql` (Complete schema setup)
        3. `update_db.sql` (If needed for updates)
        4. `update_db_v2.sql` (Latest updates)

3.  **Client Setup:**
    ```bash
    cd ../client
    npm install
    ```
    - Create a `.env` file in the `client` directory (if needed, though mostly handled by Vite proxy or hardcoded API URL if not using env vars for API base).
      *(Note: Ensure the client points to the correct server URL, usually `http://localhost:4000`)*

## Running the Application

1.  **Start the Server:**
    Open a terminal in the `server` directory:
    ```bash
    npm run dev
    ```
    The server will start on port 4000 (or as specified in `.env`).

2.  **Start the Client:**
    Open a new terminal in the `client` directory:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## Usage

- **Faculty Login**:
    - Email: `faculty@college.local`
    - Password: `FacultyPass123`
- **Student Login**:
    - Use the Student ID and Password created by the faculty.

## Project Structure

- `client/`: React frontend application.
- `server/`: Node.js/Express backend application.
- `server/*.sql`: SQL scripts for database schema setup.
